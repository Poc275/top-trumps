angular.module('CardsModule').controller('UserController', function($scope, $http) {
	$scope.google = function() {
		console.log('Google oAuth login');
		$http.get('/auth/google');
	};
});
