angular.module('TCModule').controller('GameController', function($scope, $http, Cards) {
	$scope.socket;
	$scope.collection;
	$scope.currentCard;
	$scope.turn;

	$scope.init = function(user) {

		// create connection to socket.io
		$scope.socket = io.connect();

		// now listen for events
		$scope.socket.on('onconnected', function(data) {
			console.log('Connected to socket.io server. Player id is ' + data);
		});

		// $scope.$apply() forces a new digest 
		// cycle so the view gets updated immediately
		$scope.socket.on('message', function(message) {
			$scope.msg = message;
			$scope.$apply();
		});

		// game has started
		$scope.socket.on('start', function(status) {
			$scope.msg = 'Game has begun!';
			$scope.$apply();

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
	};


	// test function for socket.io messages
	$scope.send = function() {
		$scope.socket.emit('message', $scope.message);
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		console.log(category, score, $scope.turn);

		if($scope.turn) {
			$scope.socket.emit('message', category + ' ' + score);
			console.log('message sent');
		}
	};

});
