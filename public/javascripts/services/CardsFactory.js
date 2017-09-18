angular.module('TCModule').factory('Cards', function CardsFactory($http) {
	return {
		all: function() {
			return $http.get('/cards');
		},
		findByName: function(name) {
			return $http.get('/card/' + name);
		},
		findById: function(id) {
			return $http.get('/card/id/' + id);
		},
		getCardCollection: function() {
			return $http.get('/me/collection');
		},
		getGamePack: function(size) {
			return $http.get('/me/pack/' + size);
		},
		purchase: function(grade) {
			return $http.get('/purchase/' + grade);
		}
	};
});