angular.module('TCModule').controller('CardController', function($scope, $http, $stateParams, Cards) {
	$scope.result = [];

	Cards.findByName($stateParams.name).then(function(card) {
		console.log(card.data);
		$scope.result[0] = card.data;
	});
});
