angular.module('CardsModule').controller('UserController', function($scope, $http, $location, Cards, Gravatar) {
	
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
		$scope.collection = Cards.getCardCollection().success(function(cards) {
			$scope.collection = cards;
		});

		// change the url so the ng-if statement in home.html template
		// is set to true and loads the collection.html template
		$location.path('/collection');
	};

	$scope.getUser();
});
