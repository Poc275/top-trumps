var expect = require('chai').expect;

var mongodb = require('mongo-mock');
// mimic async db behaviour by setting max_delay
mongodb.max_delay = 0;

var MongoClient = mongodb.MongoClient;

describe('database tests', function() {
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
		collection.find({}, {_id:-1}).toArray(function(err, docs) {
            expect(docs).to.have.length.of(2);
            done();
        });
	});


	it('card objects have correct properties and data types', function(done) {
		collection.find({}, {_id:-1}).toArray(function(err, docs) {
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

	
	it('card attributes can be compared numerically', function() {
		collection.find({}, {_id:-1}).toArray(function(err, docs) {
			var trump = docs[0];
			var putin = docs[1];

			expect(trump.unpalatibility).to.be.above(putin.unpalatibility);
			expect(trump.up_their_own_arsemanship).to.be.above(putin.up_their_own_arsemanship);
			expect(trump.media_attention).to.deep.equal(putin.media_attention);
			expect(trump.legacy).to.be.below(putin.legacy);
			expect(trump.special_ability).to.be.below(putin.special_ability);
			expect(trump.ppc).to.be.below(putin.ppc);
		});
	});
});
