var mongoose = require('mongoose');

exports.CardSchema = new mongoose.Schema({
	name: { type: String, required: true },
	unpalatibility: { type: Number, required: true },
	up_their_own_arsemanship: { type: Number, required: true },
	media_attention: { type: Number, required: true },
	legacy: { type: Number, required: true },
	special_ability: { type: Number, required: true },
	ppc: { type: Number, required: true },
	cuntal_order: { type: String, required: true },
	category: { type: String, required: true },
	special_ability_description: { type: String, required: true }
});