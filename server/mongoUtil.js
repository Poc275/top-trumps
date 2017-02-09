var mongo = require('mongodb');
var client = mongo.MongoClient;

// variables prefixed with an underscore is a convention 
// that states that it is only used inside this module
var _db;

module.exports = {
	// connect method
	connect() {
		// connection string for mongodb:
		// mongodb = protocol
		// ://localhost = server location
		// :27017 = all mongo installations default to this port
		// /olympics-dev = database name
		client.connect('mongodb://localhost:27017/tc', function(err, db) {
			if(err) {
				console.log('Error connecting to Mongo - check mongod connection');

				// exit node.js (we don't want the app running without a database connection)
				process.exit(1);
			}
			_db = db;
			console.log('Connected to Mongo');
		});
	},
	// return all sports method
	// sports() {
	// 	return _db.collection('sports');
	// }
}