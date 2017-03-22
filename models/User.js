/**
 * User mongoose model to handle user profiles stored in MongoDB.
 * @module models/User
 * @todo Need to consolidate a single user's profiles to handle the same user signing 
 * up using different social media profiles. We need to treat them as the same user.
 */
var mongoose = require('mongoose');

/**
 * Mongooser User schema
 */
exports.UserSchema = new mongoose.Schema({
	/**
	 * User schema fields.
	 * @property {ObjectId} _id - MongoDB primary key - auto generated
	 * @property {string} username - User's username, retrieved from passport
	 * @property {string} name - User's name, retrieved from passport
	 * @property {string} email - User's email address, retrieved from passport. Must be unique
	 * @property {string} provider - oAuth provider i.e. Facebook, Google, Twitter
	 * @property {string} id - User's id, retrieved from passport
	 * @property {array} cards - User's card collection
	 */
	_id: { type: mongoose.Schema.Types.ObjectId, required: true },
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	provider: { type: String, required: true },
	id: { type: String, required: true },
	cards: { type: Array, required: true }
});
