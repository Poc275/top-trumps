var expect = require('chai').expect;


describe('database tests', function() {
	var mongoUtil = require('../server/mongoUtil');
	var cards;

	// check we're connected before running any tests
	before(function(done) {
		mongoUtil.connect(function(err, result) {
			mongoUtil.cards(function(err, result) {
				cards = result;
				done();
			});
		});
	});

	it('connect to the database', function() {
		expect(mongoUtil.connected()).to.be.true;
	});

	it('read data from the database', function() {
		expect(cards).to.be.a('array');
		expect(cards).to.have.length.of(3);

		expect(cards[0]).to.have.property('_id');
		expect(cards[0]).to.have.property('name');
		expect(cards[0]).to.have.property('unpalatibility');
		expect(cards[0]).to.have.property('up_their_own_arsemanship');
		expect(cards[0]).to.have.property('media_attention');
		expect(cards[0]).to.have.property('legacy');
		expect(cards[0]).to.have.property('special_ability');
		expect(cards[0]).to.have.property('ppc');
		expect(cards[0]).to.have.property('cuntal_order');
		expect(cards[0]).to.have.property('category');
		expect(cards[0]).to.have.property('special_ability_description');

		expect(cards[0].name).to.be.a('string');
		expect(cards[0].unpalatibility).to.be.a('number');
		expect(cards[0].up_their_own_arsemanship).to.be.a('number');
		expect(cards[0].media_attention).to.be.a('number');
		expect(cards[0].legacy).to.be.a('number');
		expect(cards[0].special_ability).to.be.a('number');
		expect(cards[0].ppc).to.be.a('number');
		expect(cards[0].cuntal_order).to.be.a('string');
		expect(cards[0].category).to.be.a('string');
		expect(cards[0].special_ability_description).to.be.a('string');
	});
});