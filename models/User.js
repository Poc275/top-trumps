/**
 * User mongoose model to handle user profiles stored in MongoDB.
 * @module models/User
 * @todo Need to consolidate a single user's profiles to handle the same user signing 
 * up using different social media profiles. We need to treat them as the same user.
 */
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config;
if(!process.env.FacebookClientID) {
	config = require('../config/auth');
}

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
	 * @property {number} level - User's game level
	 * @property {number} played - Games played
	 * @property {number} won - Games won
	 * @property {number} lost - Games lost
	 * @property {number} xp - User's experience (XP)
	 * @property {number} boon - User's in-game currency total
	 * @property {string} role - User's role (user | admin)
	 */
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	username: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	provider: { type: String, required: true },
	id: { type: String, required: true },
	cards: { type: Array, required: true },
	level: { type: Number, required: true },
	played: { type: Number, required: true },
	won: { type: Number, required: true },
	lost: { type: Number, required: true },
	xp: { type: Number, required: true },
	boon: { type: Number, required: true },
	role: { type: String, required: true }
});

/** @function generateJwt
 * Generates a JWT for a user
 * @returns {object} A JWT
 */
this.UserSchema.methods.generateJwt = function() {
	var secret = process.env.JwtSecret || config.jwt.secret;
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		username: this.username,
		cards: this.cards,
		level: this.level,
		played: this.played,
		won: this.won,
		lost: this.lost,
		xp: this.xp,
		boon: this.boon,
		role: this.role,
		exp: parseInt(expiry.getTime() / 1000)
	}, secret);
};