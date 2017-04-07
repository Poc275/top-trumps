angular.module('TCModule').controller('UserController', function($scope, $http, $location, $state, Cards, Gravatar) {
	
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

	$scope.getCards = function() {
		Cards.getCardCollection().success(function(cards) {
			$scope.collection = cards;
			console.log($scope.collection);
		});

		$state.go('home.collection');
	};

	$scope.getUser();
});
