angular.module('TCModule').controller('GameController', function($scope, $http, $mdToast, Cards, socket) {

	$scope.collection;
	$scope.currentCard;

	$scope.host = false;
	$scope.gameInProgress = false;
	$scope.turn = false;

	// counter for the number of rounds played
	$scope.round = 0;


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

		// in-game play events
		socket.on('play', function(play) {
			var myScore = $scope.currentCard[$scope.round][play.category];

			if(myScore > play.score) {
				console.log('I win :)');
			} else if(myScore < play.score) {
				console.log('I lose :(');
			} else {
				console.log('It\'s a draw :|');
			}

			$scope.round++;
		});
	};


	// test function for socket.io messages
	$scope.send = function() {
		socket.emit('message', $scope.message);
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		if($scope.turn) {
			socket.emit('play', { 'category': category, 'score': score });
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
