angular.module('CardsModule').controller('UserController', function($scope, $http, $location, Gravatar) {
	
	$scope.getUser = function() {
		$http.get('/me').success(function(user) {
			$scope.user = user;
		});
	};

	$scope.gravatarUrl = function(email) {
		return Gravatar(email);
	};

	$scope.logout = function() {
		$http.get('/logout').success(function() {
			$location.path('/');
		});
	};

	/*
	 * @todo just display a test card for now
	 * but eventually this will show a user's card collection
	 */
	$scope.getCards = function() {
		$location.path('/collection');
	};

	$scope.getUser();
});
