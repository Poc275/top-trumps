angular.module('TCModule').controller('UserController', function($scope, $http, $location, $state, Cards, Gravatar) {
	
	$scope.getUser = function() {
		$http.get('/me').then(function(user) {
			$scope.user = user.data;
		});
	};

	$scope.gravatarUrl = function(email) {
		return Gravatar(email, 80);
	};

	$scope.logout = function() {
		$http.get('/logout').then(function() {
			$location.path('/');
		});
	};

	$scope.getCards = function() {
		Cards.getCardCollection().then(function(cards) {
			$scope.collection = cards.data;
			console.log($scope.collection);
		});

		$state.go('home.collection');
	};

	$scope.getUser();
});
