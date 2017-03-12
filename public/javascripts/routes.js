angular.module('CardsModule').config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/templates/index.html'
	}).when('/home', {
		templateUrl: '/templates/logged-in.html'
	}).when('/collection', {
		templateUrl: '/templates/collection.html'
	}).otherwise({redirectTo: '/'});
});