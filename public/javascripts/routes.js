angular.module('CardsModule').config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/templates/index.html'
	}).when('/home', {
		controller: 'routeController',
		templateUrl: '/templates/logged-in.html'
	}).when('/collection', {
		controller: 'routeController',
		templateUrl: '/templates/logged-in.html'
	}).otherwise({redirectTo: '/'});
}).controller('routeController', function($scope, $location) {
	// if url is /collection then showCollection is true
	// and the collection.html template is shown (ng-if)
	$scope.showCollection = $location.path() === '/collection';
});