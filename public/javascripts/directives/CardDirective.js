angular.module('CardsModule').directive('card', function() {
	return {
		restrict: 'E',
		templateUrl: '/templates/card.html',
		controller: function($scope, Cards) {

			// Cards.findByName('Paul Dacre').success(function(data) {
			// 	$scope.card = data;
			// });
		}
	};
});