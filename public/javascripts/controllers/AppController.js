angular.module('TCModule').controller('AppController', function($scope, $mdSidenav) {
	// toggle sidenav menu
	$scope.toggleMenu = function() {
		$mdSidenav('side-menu').toggle();
	};
});