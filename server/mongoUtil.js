var mongo = require('mongodb');
var client = mongo.MongoClient;

// variables prefixed with an underscore is a convention 
// that states that it is only used inside this module
var _db;
var _connected = false;

var connect = function(callback) {
	// connection string for mongodb:
	// mongodb = protocol
	// ://localhost = server location
	// :27017 = all mongo installations default to this port
	// /tc = database name
	client.connect('mongodb://localhost:27017/tc', function(err, db) {
		if(err) {
			console.log('Error connecting to Mongo - check mongod connection');
			// exit node.js (we don't want the app running without a database connection)
			process.exit(1);
			return callback(err, null);
		} else {
			_db = db;
			_connected = true;
			return callback(null, true);
		}
	});
};

var connected = function() {
	return _connected;
};

// get all cards
var cards = function(callback) {
	if(_connected) {
		var cards = _db.collection('cards');
		cards.find({}).limit(3).toArray(function(err, docs) {
			if(err) {
				return callback(err, null);
			}

			return callback(null, docs);
		});
	} else {
		return callback(new Error('Database not connected'), null);
	}
};


// exports
exports.connect = connect;
exports.connected = connected;
exports.cards = cards;