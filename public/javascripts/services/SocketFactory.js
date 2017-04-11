// this is a wrapper service around socket.io on the client
// this enables it to be tested
// we use $scope.$apply() to force a template update after an event
angular.module('TCModule').factory('socket', function SocketFactory($rootScope) {
	var socket;

	return {
		connect: function() {
			console.log('SocketFactory connect() called!');
			socket = io.connect();
		},
		on: function(eventName, callback) {
			console.log('SocketFactory on() called!');
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			console.log('SocketFactory emit() called!');
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});
