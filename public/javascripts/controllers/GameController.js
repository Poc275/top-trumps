angular.module('TCModule').controller('GameController', function($scope, $http, Cards, socket) {
	$scope.collection;
	$scope.currentCard;
	$scope.turn;

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

			if(status === 'host') {
				$scope.turn = true;
				console.log(status);
			} else {
				$scope.turn = false;
			}

			// get user's card collection
			Cards.getCardCollection().success(function(cards) {
				$scope.collection = cards;
				// force array creation for ng-repeat to work
				// otherwise the card object is at the "wrong level"
				// and we get a card for each property of a card 
				// instead of a single object
				$scope.currentCard = [$scope.collection[0]];
			});
		});

		// in-game play events
		socket.on('play', function(play) {
			var myScore = $scope.currentCard[0][play.category];

			if(myScore > play.score) {
				console.log('I win :)');
			} else if(myScore < play.score) {
				console.log('I lose :(');
			} else {
				console.log('It\'s a draw :|');
			}
		});

		// THIS DOESN' WORK AS EXPECTED, A STATE CHANGE IS FIRED WHEN WE 
		// GO FROM WAITING FOR A GAME TO STARTING A GAME...
		// this method checks for the start of a route change
		// i.e. player is leaving the game, so disconnect them
		// $scope.$on('$stateChangeStart', function(next, current) {
		// 	console.log('stateChangeStart');
		//	$scope.socket.disconnect();
 		//});
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

});
