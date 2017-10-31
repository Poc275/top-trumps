angular.module('TCModule').factory('Cards', function CardsFactory($http, Auth) {
	return {
		all: function() {
			return $http.get('/cards', {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		findByName: function(name) {
			return $http.get('/card/' + name, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		findById: function(id) {
			return $http.get('/card/id/' + id, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		getCardCollection: function() {
			return $http.get('/me/collection', {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		getGamePack: function(size) {
			return $http.get('/me/pack/' + size, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		getComputerPack: function(size) {
			return $http.get('/card/pack/' + size, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		},
		purchase: function(grade) {
			return $http.get('/purchase/' + grade, {
				headers: {
					Authorization: 'Bearer ' + Auth.getToken()
				}
			});
		}
	};
});