/**
 * Card mongoose model to handle the card objects used in game.
 * @module models/Card
 * @todo Add fields for biography (markdown?) and references (array)
 */
var mongoose = require('mongoose');

/**
 * Mongoose Card schema
 */
exports.CardSchema = new mongoose.Schema({
	/**
	 * Card schema fields.
	 * @property {ObjectId} _id - MongoDB primary key - auto generated
	 * @property {string} name - Top C's name
	 * @property {number} unpalatibility - How unpalatible they are (0-100)
	 * @property {number} up_their_own_arsemanship - How up their own arse they are (0-100)
	 * @property {number} media_attention - The amount of media attention they receive (0-100)
	 * @property {number} legacy - Their lasting legacy (0-100)
	 * @property {number} special_ability - How effective is their special ability (0-100)
	 * @property {number} ppc - Price per c***, how much they are worth
	 * @property {string} cuntal_order - Colour rating. (Gold, Silver, Bronze or Brown Platinum for Tories)
	 * @property {string} category - Category to group related cards (World Leaders, Attention Seekers, 
	 * Wrong'n, Mouth Breathers, Sports, Fictional, Tories, 1%er, Jokers)
	 * @property {string} special_ability_description - A text description of their special ability
	 * @property {string} bio - Biography. A brief background/story as to why they qualify for a TC card
	 * @property {array} references - Array of links/references to back up the bio
	 * @property {array} images - Array of image urls for the front/rear of the card
	 */
	 _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
	unpalatibility: { type: Number, required: true },
	up_their_own_arsemanship: { type: Number, required: true },
	media_attention: { type: Number, required: true },
	legacy: { type: Number, required: true },
	special_ability: { type: Number, required: true },
	ppc: { type: Number, required: true },
	cuntal_order: { type: String, required: true },
	category: { type: String, required: true },
	special_ability_description: { type: String, required: true },
	bio: { type: String, required: true },
	references: { type: Array, required: false },
	images: { type: Array, required: true }
});