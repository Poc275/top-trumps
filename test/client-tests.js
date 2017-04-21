describe('CardController Tests', function() {
	var $httpBackend;
	var $rootScope;
	var createController;

	beforeEach(module('TCModule'));

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
		expect($rootScope.cards.data.name).toBe('Donald Trump');
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

	beforeEach(module('TCModule'));

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

	beforeEach(module('TCModule'));

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

	beforeEach(module('TCModule'));

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

	beforeEach(module('TCModule'));

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


describe('UserController Tests', function() {
	var $httpBackend;
	var $rootScope;
	var createController;
	var location;

	beforeEach(module('TCModule'));

	beforeEach(inject(function($injector, $location) {
		// set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');

		// mock requests
		$httpBackend.whenRoute('GET', '/me').respond({email: 'abc123@test.com'});
		$httpBackend.whenRoute('GET', '/logout').respond();
		$httpBackend.whenRoute('GET', '/templates/home.html').respond('<html></html>');
		$httpBackend.whenRoute('GET', '/templates/collection.html').respond('<html></html>');

		// mock templates
		$httpBackend.expectGET('/templates/index.html').respond('<html></html>');

		// setup scope and location (for logout testing)
		$rootScope = $injector.get('$rootScope');
		location = $location;

		// the $controller service is used to create instances of controllers
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('UserController', { '$scope' : $rootScope });
		};
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
     	$httpBackend.verifyNoOutstandingRequest();
	});


	it('/me call is made when controller instantiated', function() {
		$httpBackend.when('/me');
		var controller = createController();
		$httpBackend.flush();

		expect($rootScope.user.email).toBe('abc123@test.com');
	});


	it('Gravatar address is valid', function() {
		var controller = createController();
		var gravatarUrl = $rootScope.gravatarUrl('abc123@test.com');
		$httpBackend.flush();

		expect(gravatarUrl).not.toBeNull();
		expect(gravatarUrl).toContain('https://www.gravatar.com/avatar/');
	});


	it('logging out returns you to the home page', function() {
		var controller = createController();
		$rootScope.logout();
		$httpBackend.flush();

		expect(location.path()).toBe('/');
	});


	// not a great test because the cards factory isn't mocked 
	// inside this function, need to add this in to improve the test...
	it('user\'s card collection is assigned to scope', function() {
		var controller = createController();
		$rootScope.getCards();
		$httpBackend.flush();

		expect($rootScope.collection).not.toBeNull();
		expect($rootScope.collection).not.toBeUndefined();
	});
});


describe('GameController Tests', function() {
	var $httpBackend;
	var $rootScope;
	var location;
	var createController;
	var socketMock;


	beforeEach(module('TCModule'));

	beforeEach(inject(function($injector, $location) {
		// set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');

		// mock requests
		$httpBackend.whenRoute('GET', '/me/collection').respond({id: '12345'});

		// mock templates
		$httpBackend.expectGET('/templates/index.html').respond('<html></html>');

		// setup scope and location (for logout testing)
		$rootScope = $injector.get('$rootScope');
		socketMock = new sockMock($rootScope);

		location = $location;

		// the $controller service is used to create instances of controllers
		var $controller = $injector.get('$controller');

		createController = function() {
			return $controller('GameController', { '$scope' : $rootScope, socket: socketMock });
		};
	}));


	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
     	$httpBackend.verifyNoOutstandingRequest();
	});


	it('Game controller can receive message events', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		socketMock.receive('message', 'Joined a room, waiting for opponent');

		expect($rootScope.msg).toBe('Joined a room, waiting for opponent');

		$httpBackend.flush();
	});


	it('Host goes first when game starts', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		socketMock.receive('start', 'host');

		expect($rootScope.host).toBe(true);
		expect($rootScope.turn).toBe(true);
		expect($rootScope.gameInProgress).toBe(true);
		expect($rootScope.round).toBe(0);

		// host can play a card first
		// verify by checking there is a play event emitted
		$rootScope.play('ppc', 25);

		expect(socketMock.emits.play).not.toBeNull();
		expect(socketMock.emits.play).not.toBeUndefined();

		$httpBackend.flush();
	});


	it('Client goes second when game starts', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		socketMock.receive('start', 'client');

		expect($rootScope.host).toBe(false);
		expect($rootScope.turn).toBe(false);
		expect($rootScope.gameInProgress).toBe(true);
		expect($rootScope.round).toBe(0);

		// client cannot play a card first
		// verify by checking there isn't a play event emitted
		$rootScope.play('ppc', 25);

		expect(socketMock.emits.play).toBeUndefined();

		$httpBackend.flush();
	});


	it('In game messages can be sent', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		$rootScope.message = 'Hi!';
		$rootScope.send();

		// we should have received a message event
		expect(socketMock.emits.message).not.toBeNull();
		expect(socketMock.emits.message).not.toBeUndefined();
		expect(socketMock.emits.message[0]).toContain('Hi!');

		$httpBackend.flush();
	});


	it('Game disconnected if host leaves page', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		socketMock.receive('start', 'host');
		location.path('/logout');
		expect(socketMock.emits.message[0]).toContain('Host has left the game...');

		$httpBackend.flush();
	});


	it('Game disconnected if client leaves page', function() {
		var controller = createController();
		$rootScope.init('abc@123.com');
		socketMock.receive('start', 'client');
		location.path('/logout');
		expect(socketMock.emits.message[0]).toContain('Opponent has left the game...');

		$httpBackend.flush();
	});

});


describe('Game Logic Tests', function() {
	var httpBackend;
	var playerOneController;
	var playerTwoController;
	var playerOneScope;
	var playerTwoScope;
	var playerOneSockMock;
	var playerTwoSockMock;

	var dt = {
		_id: '12345',
		name: 'Donald Trump',
		unpalatibility: 87,
		up_their_own_arsemanship: 92,
		media_attention: 86,
		legacy: 77,
		special_ability: 96,
		ppc: 200000,
		cuntal_order: 'Gold',
		category: 'World Leaders',
		special_ability_description: 'General bad apple',
		bio: 'This guy is unbelievable...',
		references: ['see this here', 'and this as well'],
		images: ['front.jpg', 'rear.png']
	};

	var gk = {
		_id: '13579',
		name: 'Genghis Khan',
		unpalatibility: 79,
		up_their_own_arsemanship: 43,
		media_attention: 12,
		legacy: 86,
		special_ability: 80,
		ppc: 5,
		cuntal_order: 'Silver',
		category: 'World Leaders',
		special_ability_description: 'Trail blazer',
		bio: 'Wow!',
		references: ['novel'],
		images: ['front-pic.jpg', 'rear-pic.png']
	};

	var vp = {
		_id: '67890',
		name: 'Vladimir Putin',
		unpalatibility: 84,
		up_their_own_arsemanship: 92,
		media_attention: 85,
		legacy: 85,
		special_ability: 90,
		ppc: 100000,
		cuntal_order: 'Gold',
		category: 'World Leaders',
		special_ability_description: 'Bad ass',
		bio: 'This guy is a real treasure...',
		references: ['news article', 'video'],
		images: ['front-pic.jpg', 'rear-pic.png']
	};

	var sb = {
		_id: '24680',
		name: 'Silvio Berlusconi',
		unpalatibility: 65,
		up_their_own_arsemanship: 62,
		media_attention: 70,
		legacy: 54,
		special_ability: 80,
		ppc: 6000,
		cuntal_order: 'Silver',
		category: 'World Leaders',
		special_ability_description: 'Bunga bunga',
		bio: 'Italian plutocracy for the win',
		references: ['paparazzi', 'tabloid-scandal'],
		images: ['front-pic.jpg', 'rear-pic.gif']
	};

	beforeEach(module('TCModule'));

	// setup 2 players with their own controllers/scope
	beforeEach(inject(function($httpBackend, $controller, $rootScope) {
		httpBackend = $httpBackend;

		// mock requests
		httpBackend.whenRoute('GET', '/me/collection').respond({id: '12345'});

		// mock templates
		httpBackend.expectGET('/templates/index.html').respond('<html></html>');

		playerOneScope = $rootScope.$new();
		playerTwoScope = $rootScope.$new();

		playerOneSockMock = new sockMock(playerOneScope);
		playerTwoSockMock = new sockMock(playerTwoScope);

		playerOneController = $controller('GameController', {
			$scope: playerOneScope,
			socket: playerOneSockMock
		});

		playerTwoController = $controller('GameController', {
			$scope: playerTwoScope,
			socket: playerTwoSockMock
		});
	}));


	it('Game is setup correctly', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		expect(playerOneScope.msg).toBe('Game has begun!');
		expect(playerOneScope.gameInProgress).toBe(true);
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.host).toBe(true);
		expect(playerOneScope.turn).toBe(true);

		expect(playerTwoScope.msg).toBe('Game has begun!');
		expect(playerTwoScope.gameInProgress).toBe(true);
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.host).toBe(false);
		expect(playerTwoScope.turn).toBe(false);
	});


	it('Player 2 wins the game', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		playerOneScope.collection = [dt, gk];
		playerTwoScope.collection = [vp, sb];

		playerOneScope.currentCard = [dt];
		playerTwoScope.currentCard = [vp];

		// before game, player 1 goes first
		expect(playerOneScope.turn).toBe(true);
		expect(playerTwoScope.turn).toBe(false);

		// player two wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'legacy', score: 77 });
		playerOneSockMock.receive('defeated');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Vladimir Putin');
		expect(playerTwoScope.collection[1].name).toBe('Silvio Berlusconi');
		expect(playerTwoScope.collection[2].name).toBe('Donald Trump');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Silvio Berlusconi');

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(1);
		expect(playerOneScope.collection[0].name).toBe('Genghis Khan');
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.currentCard[0].name).toBe('Genghis Khan');

		// player two wins again - game over for player one
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'media_attention', score: 12 });
		playerOneSockMock.receive('defeated');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(4);
		expect(playerTwoScope.collection[0].name).toBe('Vladimir Putin');
		expect(playerTwoScope.collection[1].name).toBe('Silvio Berlusconi');
		expect(playerTwoScope.collection[2].name).toBe('Donald Trump');
		expect(playerTwoScope.collection[3].name).toBe('Genghis Khan');
		expect(playerTwoScope.round).toBe(2);
		expect(playerTwoScope.currentCard[0].name).toBe('Donald Trump');

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(0);
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.currentCard[0]).toBeUndefined();
	});


	it('Player 1 wins the game', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		playerOneScope.collection = [dt, gk];
		playerTwoScope.collection = [vp, sb];

		playerOneScope.currentCard = [dt];
		playerTwoScope.currentCard = [vp];

		// before game, player 1 goes first
		expect(playerOneScope.turn).toBe(true);
		expect(playerTwoScope.turn).toBe(false);

		// player one wins
		// victorious expects an array..
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 87 });
		playerOneSockMock.receive('victorious', [vp]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(3);
		expect(playerOneScope.collection[0].name).toBe('Donald Trump');
		expect(playerOneScope.collection[1].name).toBe('Genghis Khan');
		expect(playerOneScope.collection[2].name).toBe('Vladimir Putin');
		expect(playerOneScope.round).toBe(1);
		expect(playerOneScope.currentCard[0].name).toBe('Genghis Khan');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(1);
		expect(playerTwoScope.collection[0].name).toBe('Silvio Berlusconi');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Silvio Berlusconi');

		// player one wins again - game over for player two
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'legacy', score: 86 });
		playerOneSockMock.receive('victorious', [sb]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(4);
		expect(playerOneScope.collection[0].name).toBe('Donald Trump');
		expect(playerOneScope.collection[1].name).toBe('Genghis Khan');
		expect(playerOneScope.collection[2].name).toBe('Vladimir Putin');
		expect(playerOneScope.collection[3].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.round).toBe(2);
		expect(playerOneScope.currentCard[0].name).toBe('Vladimir Putin');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(0);
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0]).toBeUndefined();
	});

	
	it('A draw just moves onto the next card', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		playerOneScope.collection = [dt, gk];
		playerTwoScope.collection = [vp, sb];

		playerOneScope.currentCard = [dt];
		playerTwoScope.currentCard = [vp];

		// before game, player 1 goes first
		expect(playerOneScope.turn).toBe(true);
		expect(playerTwoScope.turn).toBe(false);

		// draw
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'up_their_own_arsemanship', score: 92 });
		playerOneSockMock.receive('draw');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(2);
		expect(playerOneScope.collection[0].name).toBe('Donald Trump');
		expect(playerOneScope.collection[1].name).toBe('Genghis Khan');
		expect(playerOneScope.round).toBe(1);
		expect(playerOneScope.currentCard[0].name).toBe('Genghis Khan');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(2);
		expect(playerTwoScope.collection[0].name).toBe('Vladimir Putin');
		expect(playerTwoScope.collection[1].name).toBe('Silvio Berlusconi');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Silvio Berlusconi');

		// another draw, current card should reset to beginning of pack
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'special_ability', score: 80 });
		playerOneSockMock.receive('draw');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(2);
		expect(playerOneScope.collection[0].name).toBe('Donald Trump');
		expect(playerOneScope.collection[1].name).toBe('Genghis Khan');
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.currentCard[0].name).toBe('Donald Trump');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(2);
		expect(playerTwoScope.collection[0].name).toBe('Vladimir Putin');
		expect(playerTwoScope.collection[1].name).toBe('Silvio Berlusconi');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Vladimir Putin');
	});
});


describe('Full Game Test', function() {
	var httpBackend;
	var playerOneController;
	var playerTwoController;
	var playerOneScope;
	var playerTwoScope;
	var playerOneSockMock;
	var playerTwoSockMock;

	// only 1 category per card as it's all that is required for testing
	var mc = {
		name: 'Miley Cyrus',
		unpalatibility: 79
	};

	var rh = {
		name: 'Rihanna',
		unpalatibility: 67
	};

	var gb = {
		name: 'George Bush Snr',
		unpalatibility: 43
	};

	var jc = {
		name: 'Johnnie Cochran',
		unpalatibility: 65
	};

	var dd = {
		name: 'Dick Dastardly',
		unpalatibility: 43
	};

	var sb = {
		name: 'Silvio Berlusconi',
		unpalatibility: 72
	};

	var tb = {
		name: 'Tim Burton',
		unpalatibility: 31
	};

	var cm = {
		name: 'Chris Martin (Coldplay)',
		unpalatibility: 43
	};

	var ptg = {
		name: 'Phil the Greek',
		unpalatibility: 66
	};

	var nod = {
		name: 'Noddy',
		unpalatibility: 17
	};


	beforeEach(module('TCModule'));

	// setup 2 players with their own controllers/scope
	beforeEach(inject(function($httpBackend, $controller, $rootScope) {
		httpBackend = $httpBackend;

		// mock requests
		httpBackend.whenRoute('GET', '/me/collection').respond({id: '12345'});

		// mock templates
		httpBackend.expectGET('/templates/index.html').respond('<html></html>');

		playerOneScope = $rootScope.$new();
		playerTwoScope = $rootScope.$new();

		playerOneSockMock = new sockMock(playerOneScope);
		playerTwoSockMock = new sockMock(playerTwoScope);

		playerOneController = $controller('GameController', {
			$scope: playerOneScope,
			socket: playerOneSockMock
		});

		playerTwoController = $controller('GameController', {
			$scope: playerTwoScope,
			socket: playerTwoSockMock
		});
	}));


	it('Game is setup correctly', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		expect(playerOneScope.msg).toBe('Game has begun!');
		expect(playerOneScope.gameInProgress).toBe(true);
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.host).toBe(true);
		expect(playerOneScope.turn).toBe(true);

		expect(playerTwoScope.msg).toBe('Game has begun!');
		expect(playerTwoScope.gameInProgress).toBe(true);
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.host).toBe(false);
		expect(playerTwoScope.turn).toBe(false);
	});


	it('Game concludes with 1 winner', function() {
		playerOneScope.init('abc@123.com');
		playerTwoScope.init('def@456.com');

		playerOneSockMock.receive('start', 'host');
		playerTwoSockMock.receive('start', 'client');

		playerOneScope.collection = [mc, rh, gb, jc, dd];
		playerTwoScope.collection = [sb, tb, cm, ptg, nod];

		playerOneScope.currentCard = [mc];
		playerTwoScope.currentCard = [sb];

		// before game, player 1 goes first
		expect(playerOneScope.turn).toBe(true);
		expect(playerTwoScope.turn).toBe(false);

		// round 1 - player 1 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 79 });
		playerOneSockMock.receive('victorious', [sb]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(6);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[4].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[5].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.round).toBe(1);
		expect(playerOneScope.currentCard[0].name).toBe('Rihanna');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(4);
		expect(playerTwoScope.collection[0].name).toBe('Tim Burton');
		expect(playerTwoScope.collection[1].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[2].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[3].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Tim Burton');

		// round 2 - player 1 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 67 });
		playerOneSockMock.receive('victorious', [tb]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[4].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[5].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.round).toBe(2);
		expect(playerOneScope.currentCard[0].name).toBe('George Bush Snr');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 3 - draw
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 43 });
		playerOneSockMock.receive('draw');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[4].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[5].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.round).toBe(3);
		expect(playerOneScope.currentCard[0].name).toBe('Johnnie Cochran');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Phil the Greek');

		// round 4 - player 2 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 65 });
		playerOneSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(6);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		// expect(playerOneScope.collection[3].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Tim Burton');
		expect(playerOneScope.round).toBe(3);
		expect(playerOneScope.currentCard[0].name).toBe('Dick Dastardly');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(4);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.collection[3].name).toBe('Johnnie Cochran');
		expect(playerTwoScope.round).toBe(2);
		expect(playerTwoScope.currentCard[0].name).toBe('Noddy');

		// round 5 - player 1 wins
		playerOneSockMock.receive('play', { card: playerTwoScope.currentCard, category: 'unpalatibility', score: 17 });
		playerTwoSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Tim Burton');
		expect(playerOneScope.collection[6].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(4);
		expect(playerOneScope.currentCard[0].name).toBe('Silvio Berlusconi');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		// expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.collection[2].name).toBe('Johnnie Cochran');
		expect(playerTwoScope.round).toBe(2);
		expect(playerTwoScope.currentCard[0].name).toBe('Johnnie Cochran');

		// round 6 - player 1 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 72 });
		playerOneSockMock.receive('victorious', [jc]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(8);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Tim Burton');
		expect(playerOneScope.collection[6].name).toBe('Noddy');
		expect(playerOneScope.collection[7].name).toBe('Johnnie Cochran');
		expect(playerOneScope.round).toBe(5);
		expect(playerOneScope.currentCard[0].name).toBe('Tim Burton');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(2);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		// expect(playerTwoScope.collection[2].name).toBe('Johnnie Cochran');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 7 - player 2 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 31 });
		playerOneSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		// expect(playerOneScope.collection[5].name).toBe('Tim Burton');
		expect(playerOneScope.collection[5].name).toBe('Noddy');
		expect(playerOneScope.collection[6].name).toBe('Johnnie Cochran');
		expect(playerOneScope.round).toBe(5);
		expect(playerOneScope.currentCard[0].name).toBe('Noddy');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Tim Burton');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Phil the Greek');

		// round 8 - player 2 wins
		playerOneSockMock.receive('play', { card: playerTwoScope.currentCard, category: 'unpalatibility', score: 66 });
		playerTwoSockMock.receive('victorious', [nod]);

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(6);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		// expect(playerOneScope.collection[5].name).toBe('Noddy');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.round).toBe(5);
		expect(playerOneScope.currentCard[0].name).toBe('Johnnie Cochran');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(4);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Tim Burton');
		expect(playerTwoScope.collection[3].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(2);
		expect(playerTwoScope.currentCard[0].name).toBe('Tim Burton');

		// round 9 - player 1 wins
		playerOneSockMock.receive('play', { card: playerTwoScope.currentCard, category: 'unpalatibility', score: 31 });
		playerTwoSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.round).toBe(6);
		expect(playerOneScope.currentCard[0].name).toBe('Tim Burton');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		// expect(playerTwoScope.collection[2].name).toBe('Tim Burton');
		expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(2);
		expect(playerTwoScope.currentCard[0].name).toBe('Noddy');

		// round 10 - player 1 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 31 });
		playerOneSockMock.receive('victorious', [nod]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(8);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(7);
		expect(playerOneScope.currentCard[0].name).toBe('Noddy');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(2);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		// expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 11 - player 2 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 17 });
		playerOneSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(false);
		expect(playerOneScope.collection.length).toBe(7);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		// expect(playerOneScope.collection[7].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(0);
		expect(playerOneScope.currentCard[0].name).toBe('Miley Cyrus');

		expect(playerTwoScope.turn).toBe(true);
		expect(playerTwoScope.collection.length).toBe(3);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[2].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Phil the Greek');

		// round 12 - player 1 wins
		playerOneSockMock.receive('play', { card: playerTwoScope.currentCard, category: 'unpalatibility', score: 66 });
		playerTwoSockMock.receive('defeated');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(8);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Phil the Greek');
		expect(playerOneScope.round).toBe(1);
		expect(playerOneScope.currentCard[0].name).toBe('Rihanna');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(2);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		// expect(playerTwoScope.collection[1].name).toBe('Phil the Greek');
		expect(playerTwoScope.collection[1].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(1);
		expect(playerTwoScope.currentCard[0].name).toBe('Noddy');

		// round 13 - player 1 wins
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 67 });
		playerOneSockMock.receive('victorious', [nod]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(9);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Phil the Greek');
		expect(playerOneScope.collection[8].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(2);
		expect(playerOneScope.currentCard[0].name).toBe('George Bush Snr');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(1);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		// expect(playerTwoScope.collection[1].name).toBe('Noddy');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 14 - draw
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 43 });
		playerOneSockMock.receive('draw');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(9);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Phil the Greek');
		expect(playerOneScope.collection[8].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(3);
		expect(playerOneScope.currentCard[0].name).toBe('Dick Dastardly');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(1);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 15 - draw
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 43 });
		playerOneSockMock.receive('draw');

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(9);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Phil the Greek');
		expect(playerOneScope.collection[8].name).toBe('Noddy');
		expect(playerOneScope.round).toBe(4);
		expect(playerOneScope.currentCard[0].name).toBe('Silvio Berlusconi');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(1);
		expect(playerTwoScope.collection[0].name).toBe('Chris Martin (Coldplay)');
		expect(playerTwoScope.round).toBe(0);
		expect(playerTwoScope.currentCard[0].name).toBe('Chris Martin (Coldplay)');

		// round 16 - player 1 wins - GAME OVER
		playerTwoSockMock.receive('play', { card: playerOneScope.currentCard, category: 'unpalatibility', score: 72 });
		playerOneSockMock.receive('victorious', [cm]);

		expect(playerOneScope.turn).toBe(true);
		expect(playerOneScope.collection.length).toBe(10);
		expect(playerOneScope.collection[0].name).toBe('Miley Cyrus');
		expect(playerOneScope.collection[1].name).toBe('Rihanna');
		expect(playerOneScope.collection[2].name).toBe('George Bush Snr');
		expect(playerOneScope.collection[3].name).toBe('Dick Dastardly');
		expect(playerOneScope.collection[4].name).toBe('Silvio Berlusconi');
		expect(playerOneScope.collection[5].name).toBe('Johnnie Cochran');
		expect(playerOneScope.collection[6].name).toBe('Tim Burton');
		expect(playerOneScope.collection[7].name).toBe('Phil the Greek');
		expect(playerOneScope.collection[8].name).toBe('Noddy');
		expect(playerOneScope.collection[9].name).toBe('Chris Martin (Coldplay)');
		expect(playerOneScope.round).toBe(5);
		expect(playerOneScope.currentCard[0].name).toBe('Johnnie Cochran');

		expect(playerTwoScope.turn).toBe(false);
		expect(playerTwoScope.collection.length).toBe(0);
		expect(playerTwoScope.currentCard[0]).toBeUndefined();

	});

});



/*
Simple mock for socket.io
see: https://github.com/btford/angular-socket-io-seed/issues/4
thanks to https://github.com/southdesign for the idea
*/
var sockMock = function($rootScope) {
  this.events = {};
  this.emits = {};

  // intercept connect call - my addition
  // just push an empty event into the events object
  // this event is really just for testing connections 
  // are made, the user doesn't see anything
  this.connect = function() {
  	if(!this.events['on.connected']) {
    	this.events['on.connected'] = [];
    }
    this.events['on.connected'].push();
  };

  // intercept disconnect call - my addition
  // just push an empty event into the events object
  // this event is really just for testing connections 
  // are made, the user doesn't see anything
  this.disconnect = function() {
  	if(!this.events['dis.connect']) {
    	this.events['dis.connect'] = [];
    }
    this.events['dis.connect'].push();
  };

  // intercept 'on' calls and capture the callbacks
  this.on = function(eventName, callback){
    if(!this.events[eventName]) {
    	this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  };

  // intercept 'emit' calls from the client and record them to assert against in the test
  this.emit = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(!this.emits[eventName]) {
    	this.emits[eventName] = [];
  	}
    this.emits[eventName].push(args);
  };

  // simulate an inbound message to the socket from the server (only called from the test)
  this.receive = function(eventName){
    var args = Array.prototype.slice.call(arguments, 1);

    if(this.events[eventName]) {
      angular.forEach(this.events[eventName], function(callback) {
        $rootScope.$apply(function() {
          callback.apply(this, args);
        });
      });
    }
  };
};