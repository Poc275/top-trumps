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


describe('GravatarFactory tests', function() {
	var gravatarFactory;
	var email = 'poc275@gmail.com';

	beforeEach(module('CardsModule'));

	beforeEach(inject(function(_Gravatar_) {
		gravatarFactory = _Gravatar_;
		email = CryptoJS.MD5(email);
	}));

	it('should return a url with hashed email', function() {
		expect(gravatarFactory('poc275@gmail.com')).toEqual('https://www.gravatar.com/avatar/' + email + '?size=80');
	});
});


describe('CardsFactory all() tests', function() {
	var cardsFactory;
	var httpBackend;

	beforeEach(module('CardsModule'));

	beforeEach(inject(function(_Cards_, $httpBackend) {
		cardsFactory = _Cards_;
		httpBackend = $httpBackend;

		// mock api response with some card objects
		httpBackend.whenRoute('GET', '/cards').respond({
			cards: [
				{
					"_id": "58962a7f11671b2e78b6ec8f",
					"name": "Vladimir Putin",
					"unpalatibility": 87,
					"up_their_own_arsemanship": 92,
					"media_attention": 86,
					"legacy": 77,
					"special_ability": 96,
					"ppc": 200000,
					"cuntal_order": "Gold",
					"category": "World Leaders",
					"special_ability_description": "Land grabbing election interfering miscreant",
					"bio":"",
					"references": ["https://goo.gl/W59LNx"]
				},
				{
					"_id": "58962b5845c58e2e78ae0121",
					"name": "Genghis Khan",
					"unpalatibility": 75,
					"up_their_own_arsemanship": 70,
					"media_attention": 3,
					"legacy": 70,
					"special_ability": 85,
					"ppc": 150000,
					"cuntal_order": "Silver",
					"category": "World Leaders",
					"special_ability_description": "0.5% of global male population directly descended from this lad",
					"bio": "",
					"references": []
				},
				{
					"_id": "58962ce045c58e2e78ae0126",
					"name": "Donald Trump",
					"unpalatibility": 99,
					"up_their_own_arsemanship": 99,
					"media_attention": 99,
					"legacy": 50,
					"special_ability": 95,
					"ppc": 3700,
					"cuntal_order": "Gold",
					"category": "World Leaders",
					"special_ability_description": "He only has time for winning presidencies and grabbin' pussies! And the inauguration is over...",
					"bio": "Praying on people's fears for political gain...",
					"references": ["https://goo.gl/XTASMi", "https://goo.gl/P0KzJd"]
				}
			]
		});

		// this test kept failing until I added this line
		// i'm not sure why it is trying to get a template when I'm only
		// testing the factory??? just respond with some simple html for now
		httpBackend.expectGET('/templates/index.html').respond('<html></html>');
	}));

	// if you get $digest still in progress errors then 
	// pass false to these 2 parameters
	// this doesn't fix the problem but will allow 
	// the error msg to be more descriptive
	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
     	httpBackend.verifyNoOutstandingRequest();
	});

	it('all() function should return all cards', function() {
		cardsFactory.all().then(function(res) {
			expect(res.data.cards.length).toEqual(3);

			expect(res.data.cards[0]._id).toEqual('58962a7f11671b2e78b6ec8f');
			expect(res.data.cards[0].name).toEqual('Vladimir Putin');
			expect(res.data.cards[0].unpalatibility).toEqual(87);
			expect(res.data.cards[0].up_their_own_arsemanship).toEqual(92);
			expect(res.data.cards[0].media_attention).toEqual(86);
			expect(res.data.cards[0].legacy).toEqual(77);
			expect(res.data.cards[0].special_ability).toEqual(96);
			expect(res.data.cards[0].ppc).toEqual(200000);
			expect(res.data.cards[0].cuntal_order).toEqual('Gold');
			expect(res.data.cards[0].category).toEqual('World Leaders');
			expect(res.data.cards[0].special_ability_description).toEqual('Land grabbing election interfering miscreant');
			expect(res.data.cards[0].bio).toEqual('');
			expect(res.data.cards[0].references.length).toEqual(1);
			expect(res.data.cards[0].references[0]).toEqual('https://goo.gl/W59LNx');

			expect(res.data.cards[1]._id).toEqual('58962b5845c58e2e78ae0121');
			expect(res.data.cards[1].name).toEqual('Genghis Khan');
			expect(res.data.cards[1].unpalatibility).toEqual(75);
			expect(res.data.cards[1].up_their_own_arsemanship).toEqual(70);
			expect(res.data.cards[1].media_attention).toEqual(3);
			expect(res.data.cards[1].legacy).toEqual(70);
			expect(res.data.cards[1].special_ability).toEqual(85);
			expect(res.data.cards[1].ppc).toEqual(150000);
			expect(res.data.cards[1].cuntal_order).toEqual('Silver');
			expect(res.data.cards[1].category).toEqual('World Leaders');
			expect(res.data.cards[1].special_ability_description).toEqual('0.5% of global male population directly descended from this lad');
			expect(res.data.cards[1].bio).toEqual('');
			expect(res.data.cards[1].references.length).toEqual(0);

			expect(res.data.cards[2]._id).toEqual('58962ce045c58e2e78ae0126');
			expect(res.data.cards[2].name).toEqual('Donald Trump');
			expect(res.data.cards[2].unpalatibility).toEqual(99);
			expect(res.data.cards[2].up_their_own_arsemanship).toEqual(99);
			expect(res.data.cards[2].media_attention).toEqual(99);
			expect(res.data.cards[2].legacy).toEqual(50);
			expect(res.data.cards[2].special_ability).toEqual(95);
			expect(res.data.cards[2].ppc).toEqual(3700);
			expect(res.data.cards[2].cuntal_order).toEqual('Gold');
			expect(res.data.cards[2].category).toEqual('World Leaders');
			expect(res.data.cards[2].special_ability_description).toEqual('He only has time for winning presidencies and grabbin\' pussies! And the inauguration is over...');
			expect(res.data.cards[2].bio).toEqual('Praying on people\'s fears for political gain...');
			expect(res.data.cards[2].references.length).toEqual(2);
			expect(res.data.cards[2].references[0]).toEqual('https://goo.gl/XTASMi');
			expect(res.data.cards[2].references[1]).toEqual('https://goo.gl/P0KzJd');
		});

		httpBackend.flush();
	});
});


// I originally had this test in the previous describe block
// with a separate whenRoute() but the first whenRoute() always 
// ran even though the url was different
// Need to understand why but it works as a separate test...
describe('CardsFactory findByName() tests', function() {
	var cardsFactory;
	var httpBackend;

	beforeEach(module('CardsModule'));

	beforeEach(inject(function(_Cards_, $httpBackend) {
		cardsFactory = _Cards_;
		httpBackend = $httpBackend;

		// mock api response with some card objects
		httpBackend.whenRoute('GET', '/cards/thedonald').respond({
			card: [
				{
					"_id": "58962ce045c58e2e78ae0126",
					"name": "Donald Trump",
					"unpalatibility": 99,
					"up_their_own_arsemanship": 99,
					"media_attention": 99,
					"legacy": 50,
					"special_ability": 95,
					"ppc": 3700,
					"cuntal_order": "Gold",
					"category": "World Leaders",
					"special_ability_description": "He only has time for winning presidencies and grabbin' pussies! And the inauguration is over...",
					"bio": "Praying on people's fears for political gain...",
					"references": ["https://goo.gl/XTASMi", "https://goo.gl/P0KzJd"]
				}
			]
		});

		// this test kept failing until I added this line
		// i'm not sure why it is trying to get a template when I'm only
		// testing the factory??? just respond with some simple html for now
		httpBackend.expectGET('/templates/index.html').respond('<html></html>');
	}));

	// if you get $digest still in progress errors then 
	// pass false to these 2 parameters
	// this doesn't fix the problem but will allow 
	// the error msg to be more descriptive
	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
     	httpBackend.verifyNoOutstandingRequest();
	});

	it('findByName() function should return 1 card', function() {
		cardsFactory.findByName('thedonald').then(function(res) {
			expect(res.data.card.length).toEqual(1);
			expect(res.data.card[0].name).toEqual('Donald Trump');
		});

		httpBackend.flush();
	});
});


describe('CardsFactory getCardCollection() tests', function() {
	var cardsFactory;
	var httpBackend;

	beforeEach(module('CardsModule'));

	beforeEach(inject(function(_Cards_, $httpBackend) {
		cardsFactory = _Cards_;
		httpBackend = $httpBackend;

		// mock api response with some card objects
		httpBackend.whenRoute('GET', '/me/collection').respond({
			cards: [
				{
					"_id": "58962a7f11671b2e78b6ec8f",
					"name": "Vladimir Putin",
					"unpalatibility": 87,
					"up_their_own_arsemanship": 92,
					"media_attention": 86,
					"legacy": 77,
					"special_ability": 96,
					"ppc": 200000,
					"cuntal_order": "Gold",
					"category": "World Leaders",
					"special_ability_description": "Land grabbing election interfering miscreant",
					"bio":"",
					"references": ["https://goo.gl/W59LNx"]
				},
				{
					"_id": "58962b5845c58e2e78ae0121",
					"name": "Genghis Khan",
					"unpalatibility": 75,
					"up_their_own_arsemanship": 70,
					"media_attention": 3,
					"legacy": 70,
					"special_ability": 85,
					"ppc": 150000,
					"cuntal_order": "Silver",
					"category": "World Leaders",
					"special_ability_description": "0.5% of global male population directly descended from this lad",
					"bio": "",
					"references": []
				}
			]
		});

		// this test kept failing until I added this line
		// i'm not sure why it is trying to get a template when I'm only
		// testing the factory??? just respond with some simple html for now
		httpBackend.expectGET('/templates/index.html').respond('<html></html>');
	}));

	// if you get $digest still in progress errors then 
	// pass false to these 2 parameters
	// this doesn't fix the problem but will allow 
	// the error msg to be more descriptive
	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
     	httpBackend.verifyNoOutstandingRequest();
	});

	it('getCardCollection() function should return 2 cards', function() {
		cardsFactory.getCardCollection().then(function(res) {
			expect(res.data.cards.length).toEqual(2);
			expect(res.data.cards[0].name).toEqual('Vladimir Putin');
			expect(res.data.cards[1].name).toEqual('Genghis Khan');
		});

		httpBackend.flush();
	});
});