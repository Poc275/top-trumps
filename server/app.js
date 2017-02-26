var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
// we have to initialise passport.js before we can use it
// (see app.use(passport.initilize() below)
// then we pass it to our passport.js file to use in strategies
require('../config/passport')(passport);

var app = express();

var mongoose = require('mongoose');
// use default JS promises as mongoose promises are deprecated
mongoose.Promise = global.Promise;
var db = mongoose.createConnection('localhost', 'tc');

var cardSchema = require('../models/Card.js').CardSchema;
var card = db.model('cards', cardSchema);
var userSchema = require('../models/User.js').UserSchema;
var user = db.model('users', userSchema);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
// don't expose external paths to resources, so to access node_modules
// for angular etc. use a /scripts alias for the path
app.use('/scripts', express.static(path.join(__dirname, '../node_modules')));
app.use(passport.initialize());


// routes
app.get('/cards', function(req, res) {
	card.find({}, function(err, cards) {
		console.log(cards);
		res.json(cards);
	});
});

// facebook oauth
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
}));


app.listen(3000, () => console.log('Listening on port 3000'));