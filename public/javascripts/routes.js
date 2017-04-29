angular.module('TCModule').config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider.state('root', {
		url: '/',
		templateUrl: '/templates/index.html'
	})
	.state('home', {
		url: '/home',
		templateUrl: '/templates/home.html',
		controller: 'UserController'
	})
	.state('home.collection', {
		url: '/collection',
		templateUrl: '/templates/collection.html',
		controller: 'UserController'
	})
	.state('home.play', {
		url: '/play',
		templateUrl: '/templates/game.html'
	});
});