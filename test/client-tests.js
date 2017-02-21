describe('Basic functionality', function() {
	it('has a dummy spec to test 2 + 2', function() {
		expect(2 + 2).toEqual(4);
	});
});


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
		getCardsRequestHandler = $httpBackend.when('GET', '/cards').respond({name: 'created'});

		console.log(getCardsRequestHandler);

		$rootScope = $injector.get('$rootScope');

		// the $controller service is used to create instances of controllers
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('CardController', {'$scope' : $rootScope});
		}
	}));


	it('GET /cards should return card objects', function() {
		$httpBackend.expectGET('/cards');
		var controller = createController();
		$httpBackend.flush();
		console.log('controller object looks like this:' + controller.cards);
	});
});