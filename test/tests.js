var chai = require('chai');
var expect = require('chai').expect;
var chaiHttp = require('chai-http');

var mongodb = require('mongo-mock');
// mimic async db behaviour by setting max_delay
mongodb.max_delay = 0;

var MongoClient = mongodb.MongoClient;

chai.use(chaiHttp);

describe('database card collection tests', function() {
	var url = 'mongodb://localhost:27017/tc';
	var collection;

	before(function(done) {	
		MongoClient.connect(url, {}, function(err, db) {
			// insert some dummy data into the mocked db
			collection = db.collection('cards');

			var cards = [{
				name: 'Donald Trump',
				unpalatibility: 97,
				up_their_own_arsemanship: 98,
				media_attention: 99,
				legacy: 75,
				special_ability: 68,
				ppc: 6800,
				cuntal_order: 'Gold',
				category: 'World Leaders',
				special_ability_description: 'Grabbin pussies'
			},{
				name: 'Vladimir Putin',
				unpalatibility: 90,
				up_their_own_arsemanship: 95,
				media_attention: 99,
				legacy: 88,
				special_ability: 84,
				ppc: 20000,
				cuntal_order: 'Gold',
				category: 'World Leaders',
				special_ability_description: 'Election interference'
			}];

			collection.insert(cards, function(err, result) {
				if(err) {
					console.log(err);
					throw(err);
				}
				done();
			});
		});
	});


	it('db contains 2 card objects', function(done) {
		collection.find({}).toArray(function(err, docs) {
            expect(docs).to.have.length.of(2);
            done();
        });
	});


	it('card objects have correct properties and data types', function(done) {
		collection.find({}).toArray(function(err, docs) {
            expect(docs).to.be.a('array');
			expect(docs).to.have.length.of(2);

			expect(docs[0]).to.have.property('name');
			expect(docs[0]).to.have.property('unpalatibility');
			expect(docs[0]).to.have.property('up_their_own_arsemanship');
			expect(docs[0]).to.have.property('media_attention');
			expect(docs[0]).to.have.property('legacy');
			expect(docs[0]).to.have.property('special_ability');
			expect(docs[0]).to.have.property('ppc');
			expect(docs[0]).to.have.property('cuntal_order');
			expect(docs[0]).to.have.property('category');
			expect(docs[0]).to.have.property('special_ability_description');

			expect(docs[0].name).to.be.a('string');
			expect(docs[0].unpalatibility).to.be.a('number');
			expect(docs[0].up_their_own_arsemanship).to.be.a('number');
			expect(docs[0].media_attention).to.be.a('number');
			expect(docs[0].legacy).to.be.a('number');
			expect(docs[0].special_ability).to.be.a('number');
			expect(docs[0].ppc).to.be.a('number');
			expect(docs[0].cuntal_order).to.be.a('string');
			expect(docs[0].category).to.be.a('string');
			expect(docs[0].special_ability_description).to.be.a('string');

            done();
        });
	});

	
	it('card attributes can be compared numerically', function(done) {
		collection.find({}).toArray(function(err, docs) {
			var trump = docs[0];
			var putin = docs[1];

			expect(trump.unpalatibility).to.be.above(putin.unpalatibility);
			expect(trump.up_their_own_arsemanship).to.be.above(putin.up_their_own_arsemanship);
			expect(trump.media_attention).to.deep.equal(putin.media_attention);
			expect(trump.legacy).to.be.below(putin.legacy);
			expect(trump.special_ability).to.be.below(putin.special_ability);
			expect(trump.ppc).to.be.below(putin.ppc);

			done();
		});
	});


	it('findOne returns only a single result', function(done) {
		collection.findOne({ 'name': 'Donald Trump' }, function(err, result) {
			expect(result).to.be.an('object');
			expect(result.name).to.deep.equal('Donald Trump');
			expect(result.unpalatibility).to.deep.equal(97);
			expect(result.up_their_own_arsemanship).to.deep.equal(98);
			expect(result.media_attention).to.deep.equal(99);
			expect(result.legacy).to.deep.equal(75);
			expect(result.special_ability).to.deep.equal(68);
			expect(result.ppc).to.deep.equal(6800);
			expect(result.cuntal_order).to.deep.equal('Gold');
			expect(result.category).to.deep.equal('World Leaders');
			expect(result.special_ability_description).to.deep.equal('Grabbin pussies');

			done();
		});
	});


	it('missing search handled ok', function(done) {
		collection.findOne({ 'name': 'Ronald Reagan' }, function(err, result) {
			expect(result).to.be.null;

			done();
		});
	});
});


describe('database user collection tests', function() {
	var url = 'mongodb://localhost:27017/tc';
	var collection;

	before(function(done) {	
		MongoClient.connect(url, {}, function(err, db) {
			// insert some dummy data into the mocked db
			collection = db.collection('users');

			var user = {
				username: 'harry123',
				name: 'Harry Belafonte',
				email: 'harry.b@emailme.com',
				provider: 'Google',
				id: '123456'
			};

			collection.insert(user, function(err, result) {
				if(err) {
					console.log(err);
					throw(err);
				}
				done();
			});
		});
	});


	it('db contains a user', function(done) {
		collection.find({}).toArray(function(err, docs) {
			expect(docs).to.be.a('array');
            expect(docs).to.have.length.of(1);
            done();
        });
	});


	it('user object has correct properties and data types', function(done) {
		collection.find({}).toArray(function(err, docs) {
			expect(docs[0]).to.have.property('username');
			expect(docs[0]).to.have.property('name');
			expect(docs[0]).to.have.property('email');
			expect(docs[0]).to.have.property('provider');
			expect(docs[0]).to.have.property('id');

			expect(docs[0].username).to.be.a('string');
			expect(docs[0].name).to.be.a('string');
			expect(docs[0].email).to.be.a('string');
			expect(docs[0].provider).to.be.a('string');
			expect(docs[0].id).to.be.a('string');

            done();
        });
	});


	it('find user works as expected', function(done) {
		collection.findOne({ 'email': 'harry.b@emailme.com' }, function(err, result) {
			expect(result).to.be.an('object');
			expect(result.username).to.deep.equal('harry123');
			expect(result.name).to.deep.equal('Harry Belafonte');
			expect(result.email).to.deep.equal('harry.b@emailme.com');
			expect(result.provider).to.deep.equal('Google');
			expect(result.id).to.deep.equal('123456');

			done();
		});
	});


	it('missing user search handled ok', function(done) {
		collection.findOne({ 'email': 'harry.b@emailme.co.uk' }, function(err, result) {
			expect(result).to.be.null;

			done();
		});
	});

});


// will need to change the url depending on test environment
// look into testUtils.getRootUrl() for an environment agnostic url method
// source: http://beletsky.net/2014/03/testable-apis-with-node-dot-js.html
describe('user authentication tests', function() {
	it('unauthenticated user cannot get /me', function(done) {
		chai.request('http://localhost:3000').get('/me').end(function(err, res) {
			expect(err).to.not.be.null;
			expect(res).to.have.status(401);

			done();
		});
	});
});
