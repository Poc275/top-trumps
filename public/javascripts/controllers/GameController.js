angular.module('TCModule').controller('GameController', function($scope, $http) {
	$scope.socket;

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
			console.log('client has received message: ' + $scope.msg);
		});

		// game has started
		$scope.socket.on('start', function() {
			$scope.msg = 'Game has begun!';
			$scope.$apply();
			console.log('Game has begun!');
		});
	};


	// test function for socket.io messages
	$scope.send = function() {
		$scope.socket.emit('message', $scope.message);
	};

});
