angular.module('TCModule').controller('GameController', function($scope, $http) {
	var socket;

	// set route so game content appears in <md-content>
	// $scope.inGame = $location.path() === '/play';

	$scope.init = function() {
		// call server to setup sockets
		// $http.get('/play');

		// create connection to socket.io
		socket = io.connect();

		// now listen for events
		socket.on('onconnected', function(data) {
			console.log('Connected to socket.io server. Player id is ' + data);

			socket.on('message', function(message) {
  				$scope.msg = message;
  				console.log('client has received message: ' + $scope.msg);
			});
		});
	};

	// init();
});
