var expect = require('chai').expect;


describe('object instantiation tests', function() {
	var parser = new XMLParser();
	var playlist = new Playlist('test');
	var track = new Track(12345, 'title', 'artist', 'album');

	it('xml parser object instantiates OK', function() {
		expect(parser).to.be.an.instanceOf(XMLParser);
	});

	it('playlist object instantiates OK', function() {
		expect(playlist).to.be.an.instanceOf(Playlist);
	});

	it('track object instantiates OK', function() {
		expect(track).to.be.an.instanceOf(Track);
		expect(track._id).to.equal(12345);
		expect(track._title).to.equal('title');
		expect(track._artist).to.equal('artist');
		expect(track._album).to.equal('album');
		expect(track._spotifyUri).to.equal(null);
	});

	it('track toString() returns encoded Uri', function() {
		expect(track.toString()).to.equal(encodeURIComponent('track:"title" artist:"artist"'));
	});
});