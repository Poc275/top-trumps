angular.module('TCModule').factory('Cards', function CardsFactory($http) {
	return {
		all: function() {
			return $http.get('/cards');
		},
		findByName: function(name) {
			return $http.get('/cards/' + name);
		},
		getCardCollection: function() {
			return $http.get('/me/collection');
		}
	};
});