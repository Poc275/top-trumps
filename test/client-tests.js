describe('CardController Tests', function() {
	var $httpBackend;
	var $rootScope;
	var createController;
	var getCardsRequestHandler;

	beforeEach(module('CardsModule'));

	beforeEach(inject(function($injector) {
		// set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');

		// mock a request for /cards
		getCardsRequestHandler = $httpBackend.when('GET', '/cards').respond({name: 'Donald Trump'});

		$rootScope = $injector.get('$rootScope');

		// the $controller service is used to create instances of controllers
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('CardController', {'$scope' : $rootScope});
		}
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
     	$httpBackend.verifyNoOutstandingRequest();
	});


	it('http calls are being mocked correctly', function() {
		$httpBackend.expectGET('/cards');
		var controller = createController();
		$httpBackend.flush();
		expect($rootScope.cards.name).toBe('Donald Trump');
	});
});