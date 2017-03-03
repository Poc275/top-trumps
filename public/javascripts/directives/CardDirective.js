angular.module('CardsModule').directive('card', function() {
	return {
		restrict: 'E',
		templateUrl: '/templates/card.html',
		controller: function($scope, Cards) {
			Cards.find('Donald Trump').success(function(data) {
				$scope.card = data;
			});
		}
	};
});