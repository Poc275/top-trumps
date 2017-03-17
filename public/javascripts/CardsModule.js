angular.module('CardsModule', ['ngMaterial', 'ngAnimate', 'ngRoute'])
	.config(function($mdThemingProvider) {
		$mdThemingProvider.theme('default')
			// .backgroundPalette('cyan')
			.primaryPalette('cyan')
			.accentPalette('blue', {
				'default': '900'
			})
			.warnPalette('red');
			// .dark();
});