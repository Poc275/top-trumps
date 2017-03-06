// var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./auth');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var db = mongoose.createConnection('localhost', 'tc');

var userSchema = require('../models/User.js').UserSchema;
var User = db.model('users', userSchema);


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
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
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

					user = new User({
						username: username,
						name: profile.name.givenName.toString() + ' ' + profile.name.familyName.toString(),
						email: profile.emails[0].value.toString(),
						provider: 'facebook',
						id: profile.id.toString()
					});

					user.save(function(err) {
						if(err) {
							console.log(err);
							return done(err, null);
						}
						return done(null, user);
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
			consumerKey: config.twitter.consumerKey,
			consumerSecret: config.twitter.consumerSecret,
			callbackURL: config.twitter.callbackURL
		},
		function(token, tokenSecret, profile, done) {
			User.findOne({
				'id': profile.id.toString()
			}, function(err, user) {
				if(err) {
					return done(err);
				}

				if(!user) {
					// TODO - we need a web site with a privacy document
					// and T's and C's before Twitter will let us have email addresses
					user = new User({
						username: profile.username,
						name: profile.displayName,
						email: 'test@twitter.com',
						provider: 'twitter',
						id: profile.id.toString()
					});

					user.save(function(err) {
						if(err) {
							console.log(err);
							return done(err, null);
						}
						return done(null, user);
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
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL
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

					user = new User({
						username: username,
						name: profile.displayName,
						email: profile.emails[0].value,
						provider: 'google',
						id: profile.id.toString()
					});

					user.save(function(err) {
						if(err) {
							console.log(err);
							return done(err, null);
						}
						return done(null, user);
					});
				} else {
					// we found a user
					return done(null, user);
				}
			});
		}
	));
};