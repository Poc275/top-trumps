angular.module('TCModule').controller('CardController', function($scope, $http, Cards) {
	$scope.cards = [];

	Cards.all().success(function(data) {
		console.log(data);
		$scope.cards = data;
	});
});
