// var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./auth');
var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'tc');
mongoose.Promise = global.Promise;
var userSchema = require('../models/User.js').UserSchema;
var User = db.model('users', userSchema);

module.exports = function(passport) {
	// passport session signup required for persistent login sessions
	// passport requires the ability to serialise and deserialise users in/out of session
	passport.serializeUser(function(user, done) {
		// just serialize the username to the session to keep
		// the amount of data stored within the session to a minimum
		// subsequent requests can use req.user to use this username
		done(null, user.email);
	});

	passport.deserializeUser(function(email, done) {
		User.find(email, function(err, user) {
			done(err, user);
		});
	});

	// facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			// this isn't documented in passport.js but
			// we have to pass which fields we want in addition to 
			// passport's scope due to a Facebook API update
			profileFields: ['name', 'email']
		},
		function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			User.findOne({
				'facebook.id': profile.id
			}, function(err, user) {
				if(err) {
					return done(err);
				}
				// else no user was found, so create a new user
				// Facebook provides the info in the profile parameter
				if(!user) {
					user = new User({
						name: profile.name.givenName.toString() + ' ' + profile.name.familyName.toString(),
						email: profile.emails[0].value.toString(),
						provider: 'facebook',
						// note we save the profile info as a JSON object also, this is to
						// make User.findOne() easier to work with as we can just search for
						// 'facebook.id': profile.id
						facebook: JSON.stringify(profile._json)
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
}