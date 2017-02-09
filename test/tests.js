var expect = require('chai').expect;


describe('database tests', function() {
	var mongoUtil = require('../server/mongoUtil');

	// check we're connected before running any tests
	before(function(done) {
		mongoUtil.connect(function(err) {
			done();
		});
	});

	it('connect to the database', function() {
		expect(mongoUtil.connected()).to.be.true;
	});
});