angular.module('TCModule').controller('AppController', function($scope, $mdSidenav, $http, $location, $mdDialog, Users) {
	// it's good practice to bind ng-model properties
	// to an object rather than a string on the scope
	$scope.local = {};

	$scope.flipped = false;

	$scope.showVrIcon = false;

	
	// toggle sidenav menu
	$scope.toggleMenu = function() {
		$mdSidenav('side-menu').toggle();
	};

	// ui-sref change event to add VR icon to the collection page
	$scope.$on('$stateChangeStart', function(event, toState, toParams) {
		if(toState.url === '/collection') {
			$scope.showVrIcon = true;
		} else {
			$scope.showVrIcon = false;
		}
	});

	// THIS IS FOR TESTING PURPOSES ONLY!!!
	// Local signup to test 2 player games etc.
	$scope.localSignin = function() {
		$http.post('/auth/local', $scope.local).then(function() {
			// you can't redirect from an AJAX post request
			// so redirect using angular
			$location.path('/home');
		});
	};

	// show the donald bot webchat
	$scope.showTheDonald = function(ev) {
		$mdDialog.show({
			controller: DialogController,
			templateUrl: '../templates/bot-dialog.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			fullscreen: true // Only for -xs, -sm breakpoints.
		});
	};

	function DialogController($scope, $mdDialog) {
		$scope.cancel = function() {
			$mdDialog.cancel();
		};
	}
});
