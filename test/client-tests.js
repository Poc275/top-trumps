describe('CardController Tests', function() {
	var $httpBackend;
	var $rootScope;
	var createController;

	beforeEach(module('CardsModule'));

	// beforeEach(module('templates'));

	beforeEach(inject(function($injector) {
		// set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');

		// mock a request for /cards
		$httpBackend.whenRoute('GET', '/cards').respond({name: 'Donald Trump'});

		// root route :)
		// this should serve templates/index.html but I can't get the html2js preprocessor to work
		$httpBackend.whenRoute('GET', '/').respond(function(method, url, data, headers, params) {
			return [200, {}];
		});

		$rootScope = $injector.get('$rootScope');

		// the $controller service is used to create instances of controllers
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('CardController', { '$scope' : $rootScope });
		};
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
     	$httpBackend.verifyNoOutstandingRequest();
	});


	it('http calls are being mocked correctly', function() {
		$httpBackend.when('/cards');
		var controller = createController();
		$httpBackend.flush();
		expect($rootScope.cards.name).toBe('Donald Trump');
	});


	it('home page should show login buttons', function() {
		$httpBackend.when('/');
		var controller = createController();
		$httpBackend.flush();
	});
});