angular.module('CardsModule').controller('UserController', function($scope, $http) {

	$scope.getUser = function() {
		$http.get('/me').success(function(user) {
			$scope.user = user;
		});
	};

	$scope.getUser();
});
