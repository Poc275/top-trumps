/**
 * Passport module that handles authentiction strategies
 * for Facebook, Google, and Twitter.
 * @module config/passport
 * @todo Twitter will not provide email addresses until the application requesting
 * access has a Ts and Cs and privacy policy document.
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');

var config;

// try and load config/auth.js
// if it's missing, we are in production mode
// so we access auth info from env variables instead
try {
	config = require('./auth');
} catch(e) {
	console.log(e);
}

mongoose.Promise = global.Promise;
var db = mongoose.createConnection('localhost', 'tc');

var userSchema = require('../models/User.js').UserSchema;
var User = db.model('users', userSchema);

var cardSchema = require('../models/Card.js').CardSchema;
var Card = db.model('cards', cardSchema);


/**
 * function that takes the initialised passport object (from app.js) 
 * and handles the oAuth callbacks using Facebook, Google, Twitter strategies.
 * @param {object} passport - initialised passport object
 * @returns {Error|User} Error if something went wrong, or the user if found. If 
 * the user wasn't found they are created and added to the database
 */
module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		// subsequent requests can use req.user to use this username
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	// facebook strategy
	passport.use(new FacebookStrategy({
			clientID: process.env.FacebookClientID || config.facebook.clientID,
			clientSecret: process.env.FacebookClientSecret || config.facebook.clientSecret,
			callbackURL: process.env.FacebookCallbackURL || config.facebook.callbackURL,
			// this isn't documented in passport.js but
			// we have to pass which fields we want in addition to 
			// passport's scope due to a Facebook API update
			profileFields: ['id', 'name', 'email']
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({
				'id': profile.id.toString()
			}, function(err, user) {
				if(err) {
					return done(err);
				}
				// if no user was found, create them
				// passport provides the user info in the profile parameter
				if(!user) {
					var username;

					if(profile.username === undefined) {
						// sometimes usernames might not be set
						// so just grab the first part of the email address
						username = profile.emails[0].value.split('@')[0];
					} else {
						username = profile.username;
					}

					// create starter pack
					createStarterPack(function(err, cardIds) {
						if(err) {
							console.log(err);
							throw(err);
						}

						user = new User({
							username: username,
							name: profile.name.givenName.toString() + ' ' + profile.name.familyName.toString(),
							email: profile.emails[0].value.toString(),
							provider: 'facebook',
							id: profile.id.toString(),
							cards: createStarterPack()
						});

						user.save(function(err) {
							if(err) {
								console.log(err);
								return done(err, null);
							}
							return done(null, user);
						});
					});
				} else {
					// we found a user, return them
					return done(null, user);
				}
			});
		}
	));

	// twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: process.env.TwitterConsumerKey || config.twitter.consumerKey,
			consumerSecret: process.env.TwitterConsumerSecret || config.twitter.consumerSecret,
			callbackURL: process.env.TwitterCallbackURL || config.twitter.callbackURL
		},
		function(token, tokenSecret, profile, done) {
			User.findOne({
				'id': profile.id.toString()
			}, function(err, user) {
				if(err) {
					return done(err);
				}

				if(!user) {
					// create starter pack
					createStarterPack(function(err, cardIds) {
						if(err) {
							console.log(err);
							throw(err);
						}

						user = new User({
							username: profile.username,
							name: profile.displayName,
							email: 'test@twitter.com',
							provider: 'twitter',
							id: profile.id.toString(),
							cards: createStarterPack()
						});

						user.save(function(err) {
							if(err) {
								console.log(err);
								return done(err, null);
							}
							return done(null, user);
						});
					});
				} else {
					// we found a user
					return done(null, user);
				}
			});
		}
	));

	// google strategy
	passport.use(new GoogleStrategy({
			clientID: process.env.GoogleClientID || config.google.clientID,
			clientSecret: process.env.GoogleClientSecret || config.google.clientSecret,
			callbackURL: process.env.GoogleCallbackURL || config.google.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({
				'id': profile.id.toString()
			}, function(err, user) {
				if(err) {
					return done(err);
				}

				if(!user) {
					var username;

					if(profile.username === undefined) {
						// sometimes usernames might not be set
						// so just grab the first part of the email address
						username = profile.emails[0].value.split('@')[0];
					} else {
						username = profile.username;
					}

					// create starter pack
					createStarterPack(function(err, cardIds) {
						if(err) {
							console.log(err);
							throw(err);
						}

						user = new User({
							username: username,
							name: profile.displayName,
							email: profile.emails[0].value,
							provider: 'google',
							id: profile.id.toString(),
							cards: cardIds
						});

						user.save(function(err) {
							if(err) {
								console.log(err);
								return done(err, null);
							}
							return done(null, user);
						});
					});
				} else {
					// we found a user
					return done(null, user);
				}
			});
		}
	));
};


/**
 * Function that creates a new user's starter pack. A starter
 * pack consists of 10 bronze cards.
 * @returns {Error|Array} Array of card ids
 */
function createStarterPack(callback) {
	var cardIds = [];

	Card.aggregate([
		{ $match: { cuntal_order: "Bronze" }},
		{ $project: { _id: true }},
		{ $sample: { size: 10 }}
	], function(err, result) {
		if(err) {
			return callback(err, null);
		}
		
		result.forEach(function(item) {
			cardIds.push(item._id);
		});

		return callback(null, cardIds);
	});
}