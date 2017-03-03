angular.module('CardsModule').factory('Cards', function CardsFactory($http) {
	return {
		all: function() {
			return $http.get('/cards');
		},
		find: function(name) {
			return $http.get('/cards/' + name);
		}
	};
});