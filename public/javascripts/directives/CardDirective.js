angular.module('TCModule').directive('tcCard', function($sce) {
	return {
		restrict: 'E',
		templateUrl: '/templates/card.html',
		controller: function($scope) {
			$scope.flipped = false;

			// doing the references in the same way as the bio
			// inside an array doesn't return a string, but a trustedHelperObject
			// so instead use a function in the controller that is called from
			// the template in an ng-repeat directive
			$scope.displayLink = function(link) {
				var converter = new showdown.Converter();
				var mdLink = converter.makeHtml(link);

				return $sce.trustAsHtml(mdLink);
			};
		},
		scope: {
			card: '='
		},
		link: function(scope, element) {
			var converter = new showdown.Converter();
			scope.card.bio = $sce.trustAsHtml(converter.makeHtml(scope.card.bio));
		}
	};
});