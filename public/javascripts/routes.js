// angular.module('CardsModule').config(function($routeProvider) {
// 	$routeProvider.when('/', {
// 		templateUrl: '/templates/index.html'
// 	}).when('/home', {
// 		controller: 'RouteController',
// 		templateUrl: '/templates/home.html'
// 	}).when('/collection', {
// 		controller: 'RouteController',
// 		templateUrl: '/templates/home.html'
// 	}).when('/play', {
// 		templateUrl: '/templates/home.html'
// 	}).otherwise({redirectTo: '/'});
// }).controller('RouteController', function($scope, $location) {

// 	// in the route controller we check the url and update 
// 	// an appropriate property to load the correct template 
// 	// into home.html <md-content> which is the "main" interaction area
// 	$scope.homeView = $location.path() === '/home';

// 	// if url is /collection then showCollection is true
// 	// and the collection.html template is shown (ng-if)
// 	$scope.showCollection = $location.path() === '/collection';
// });

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
		templateUrl: '/templates/game.html',
		controller: 'GameController'
	});
});