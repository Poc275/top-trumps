/**
 * Passport module that handles authentiction strategies
 * for Facebook, Google, and Twitter.
 * @module config/passport
 * @todo Twitter will not provide email addresses until the application requesting
 * access has a Ts and Cs and privacy policy document.
 * @todo createStarterPack() returns a callback. Only the Google strategy is set up 
 * correctly in calling/returning from this function, need to update Twitter & Facebook.
 * @todo db connection is duplicated in app.js and passport.js, migrate
 * to its own file.
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var config;

// THESE VARS REQUIRED FOR TESTING ONLY!!!
var LocalStrategy = require('passport-local').Strategy;


// try and load config/auth.js
// if it's missing, we are in production mode
// so we access auth info from env variables instead
// try {
// 	config = require('./auth');
// } catch(e) {
// 	console.log(e);
// }
if(!process.env.FacebookClientID) {
	config = require('./auth');
}


mongoose.Promise = global.Promise;
var options = {
	user: process.env.MongoUsername || config.mongo.username,
	pass: process.env.MongoPassword || config.mongo.password
};

var db = mongoose.createConnection('ds062919.mlab.com:62919/tc', options);

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
							cards: cardIds,
							level: 1,
							played: 0,
							won: 0,
							lost: 0,
							xp: 0,
							coin: 0
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
							cards: cardIds,
							level: 1,
							played: 0,
							won: 0,
							lost: 0,
							xp: 0,
							coin: 0
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
							name: profile.name.givenName + " " + profile.name.familyName,
							email: profile.emails[0].value,
							provider: 'google',
							id: profile.id.toString(),
							cards: cardIds,
							level: 1,
							played: 0,
							won: 0,
							lost: 0,
							xp: 0,
							coin: 0
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


	/*
	* FOR TESTING PURPOSES ONLY!!!
	* local signup to allow other users to register where 
	* oauth wouldn't work, for testing gameplay etc.
	*/
	passport.use(new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({
			'email': email
		}, function(err, user) {
			if(err) {
				return done(err);
			}

			if(!user) {
				console.log('local signup user not found, creating...');

				// create starter pack
				createStarterPack(function(err, cardIds) {
					if(err) {
						console.log(err);
						throw(err);
					}

					user = new User({
						username: email.split('@')[0],
						name: email.split('@')[0],
						email: email,
						provider: 'local',
						id: email.split('@')[0],
						cards: cardIds,
						level: 1,
						played: 0,
						won: 0,
						lost: 0,
						xp: 0,
						coin: 0
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
				console.log('local signup user found!');
				return done(null, user);
			}
		});
	}));
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