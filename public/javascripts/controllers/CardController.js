(function() {
	angular.module('CardsModule').controller('CardController', function($scope, $http) {
	$scope.cards = [];

	$scope.getCards = function() {
		$http.get('/cards').success(function(data) {
			console.log(data);
			$scope.cards = data;
		});
	};

	$scope.getCards();
})();