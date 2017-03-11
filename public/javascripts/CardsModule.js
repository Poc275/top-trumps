angular.module('CardsModule', ['ngMaterial', 'ngRoute', 'ngAnimate'])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			.primaryPalette('pink')
			.accentPalette('orange')
			.warnPalette('red')
			.dark();
});