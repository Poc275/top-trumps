angular.module('TCModule').controller('GameController', function($scope, $http) {
	$scope.socket;

	// set route so game content appears in <md-content>
	// $scope.inGame = $location.path() === '/play';

	$scope.init = function() {
		// call server to setup sockets
		// $http.get('/play');

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
	};


	// test function for socket.io messages
	$scope.send = function() {
		$scope.socket.emit('message', $scope.message);

		// $scope.socket.on('message', function(message) {
		// 	$scope.msg = message;
		// 	$scope.$apply();
		// 	console.log('chat message received: ' + $scope.msg);
		// });
	};

	// init();
});
