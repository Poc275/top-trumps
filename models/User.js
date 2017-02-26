var mongoose = require('mongoose');

exports.UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	provider: { type: String, required: true },
	facebook: { type: String, required: false}
});
