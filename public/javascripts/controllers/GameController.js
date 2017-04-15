angular.module('TCModule').controller('GameController', function($scope, $http, $mdToast, Cards, socket) {

	$scope.collection;
	$scope.currentCard;

	$scope.host;
	$scope.gameInProgress;
	$scope.turn;

	// counter for the number of rounds played
	$scope.round;


	$scope.init = function(user) {

		// create connection to socket.io
		socket.connect();


		// now listen for events
		socket.on('onconnected', function(data) {
			console.log('Connected to TC via socket.io. Player id is ' + data);
		});


		socket.on('message', function(message) {
			$scope.msg = message;
		});


		// game has started
		socket.on('start', function(status) {
			$scope.msg = 'Game has begun!';
			$scope.gameInProgress = true;
			$scope.round = 0;

			if(status === 'host') {
				$scope.host = true;
				$scope.turn = true;
				
				// inform host they go first
				$mdToast.show(
		      		$mdToast.simple()
			        .textContent('Your turn!')
			        .position('bottom')
			        .hideDelay(3000)
			    );

			} else {
				$scope.host = false;
				$scope.turn = false;
			}

			// get user's card collection
			Cards.getCardCollection().success(function(cards) {
				$scope.collection = cards;
				// force array creation for ng-repeat to work
				// otherwise the card object is at the "wrong level"
				// and we get a card for each property of a card 
				// instead of a single object
				$scope.currentCard = [$scope.collection[$scope.round]];
			});
		});


		// user has been sent a card they've won from an opponent
		// just add to end of collection
		socket.on('victorious', function(data) {
			console.log('I win :) ');

			$scope.collection.push(data[0]);
			$scope.round++;
			$scope.turn = true;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			$scope.currentCard = [$scope.collection[$scope.round]];

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});


		// user has lost a round, remove their current card
		socket.on('defeated', function() {
			console.log('I lose :(');

			$scope.turn = false;
			$scope.collection.splice($scope.round, 1);

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			$scope.currentCard = [$scope.collection[$scope.round]];

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});


		// round was drawn, just move onto next card
		socket.on('draw', function() {
			console.log('Draw :|');
			$scope.round++;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			$scope.currentCard = [$scope.collection[$scope.round]];

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});


		// in-game play events
		socket.on('play', function(play) {
			var myScore = $scope.currentCard[0][play.category];

			if(myScore > play.score) {
				// win! opponent's card is added to collection
				console.log('I win :)');

				$scope.collection.push(play.card[0]);
				$scope.round++;
				$scope.turn = true;

				// tell opponent they have been defeated so their card is removed
				socket.emit('defeated');

			} else if(myScore < play.score) {
				// lost, card is removed from collection and sent to winner
				console.log('I lose :(');

				$scope.turn = false;

				// tell opponent they have won the round and send them their new card
				var lostCard = $scope.collection.splice($scope.round, 1);
				socket.emit('victorious', lostCard);

			} else {
				console.log('It\'s a draw :|');
				$scope.round++;

				socket.emit('draw');
			}

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			$scope.currentCard = [$scope.collection[$scope.round]];

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log('my turn: ', $scope.turn);
		});
	};


	// test function for socket.io messages
	$scope.send = function() {
		socket.emit('message', $scope.message);
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		if($scope.turn) {
			socket.emit('play', { card: $scope.currentCard, category: category, score: score });
		}
	};


	// this method checks for the start of a route change
	// i.e. player is leaving the game, so disconnect them
	$scope.$on('$stateChangeStart', function(next, current) {
		// if game was in progress and user was host then disconnect
		if($scope.gameInProgress && $scope.host) {
			console.log('host is disconnecting');
			socket.emit('message', 'Host has left the game...');
			socket.disconnect();
		} else if($scope.gameInProgress && !$scope.host) {
			console.log('client is disconnecting');
			socket.emit('message', 'Opponent has left the game...');
			socket.disconnect();
		}
	});

});
