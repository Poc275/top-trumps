angular.module('TCModule').factory('Users', function UsersFactory($http) {
	return {
		getUsersStats: function() {
			return $http.get('/me/stats');
		},
		updateUsersStats: function(newStats) {
			return $http.put('/me/stats', newStats);
		}
	};
});