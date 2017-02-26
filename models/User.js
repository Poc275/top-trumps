var mongoose = require('mongoose');

exports.UserSchema = new mongoose.Schema({
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	provider: { type: String, required: true },
	id: { type: String, required: true },
});
