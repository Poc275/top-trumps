angular.module('TCModule').directive('tcCard', function() {
	return {
		restrict: 'E',
		templateUrl: '/templates/card.html',
		controller: function($scope) {
			$scope.flipped = false;
		}
	};
});