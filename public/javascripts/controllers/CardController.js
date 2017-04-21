angular.module('TCModule').controller('CardController', function($scope, $http, Cards) {
	$scope.cards = [];

	Cards.all().then(function(data) {
		console.log(data);
		$scope.cards = data;
	});
});
