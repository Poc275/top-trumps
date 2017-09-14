angular.module('TCModule').factory('Users', function UsersFactory($http) {
	return {
		getUsersBoon: function() {
            return $http.get('/me/boon');
		}
	};
});