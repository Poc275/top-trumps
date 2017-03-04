angular.module('CardsModule').config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '/templates/index.html'
	}).when('/auth/callback', {
		templateUrl: '/templates/logged-in.html',
	}).otherwise({redirectTo: '/'});
});