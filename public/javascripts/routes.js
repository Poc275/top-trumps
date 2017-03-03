angular.module('CardsModule').config(function($routeProvider) {
	$routeProvider.when('/auth/google/callback', {
		templateUrl: '/templates/index.html',
	}).otherwise('/');
});