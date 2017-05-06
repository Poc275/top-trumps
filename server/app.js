var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var uuid = require('uuid');
var passport = require('passport');
// we have to initialise passport.js before we can use it
// (see app.use(passport.initilize() below)
// then we pass it to our passport.js file to use in strategies
require('../config/passport')(passport);

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var game = require('./game.js');

var mongoose = require('mongoose');
// use default JS promises as mongoose promises are deprecated
mongoose.Promise = global.Promise;
var db = mongoose.createConnection('localhost', 'tc');

// create mongoose schemas and models from the schemas
// note 'cards' and 'users' refers to the collection names
var cardSchema = require('../models/Card.js').CardSchema;
var card = db.model('cards', cardSchema);
var userSchema = require('../models/User.js').UserSchema;
var user = db.model('users', userSchema);

// bot vars
var bot = require('./bot.js');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
// don't expose external paths to resources, so to access node_modules
// for angular etc. use a /scripts alias for the path
app.use('/scripts', express.static(path.join(__dirname, '../node_modules')));
app.use(session({ 
	secret: 'thedonald',
	resave: false,
	saveUninitialized: false 
}));
app.use(passport.initialize());
// remember to let passport access the session for req.isAuthenticated to work!
app.use(passport.session());


// middleware
// is user authenticated?
var isAuthenticated = function(req, res, next) {
	// if a user is authenticated, carry on
	// isAuthenticated provided by passport
	if (req.isAuthenticated()) {
		return next();
	}

	// not authenticated, redirect to home page to login
	res.writeHead(401, {
        'Location': '/#/'
    });
    res.end();
};


// sockets
// 'connection' is called when a client connects
// respond with their unique id so we can maintain a list of players
io.on('connection', function(client) {
	// client.userid = app.locals.userid;
	client.userid = uuid();

	// inform the user they are now connected and return their id
	client.emit('onconnected', { id: client.userid });
	console.log('socket.io connection: player ' + client.userid + ' connected');

	// find a game to play someone,
	// or if a game doesn't exist, create one and wait
	game.findGame(client);

	// handle messages that clients send
	// they are passed to game.js to handle
	client.on('message', function(msg) {
		game.onMessage(client, msg);
	});

	// in-game play event
	// again, pass to game.js to handle
	client.on('play', function(msg) {
		game.onPlay(client, msg);
	});

	// player in-turn has won a round
	// again, pass to game.js to handle
	client.on('victorious', function(msg) {
		game.onVictorious(client, msg);
	});

	// player in-turn has lost a round
	// again, pass to game.js to handle
	client.on('defeated', function() {
		game.onDefeated(client);
	});

	// round was a draw
	// again, pass to game.js to handle
	client.on('draw', function() {
		game.onDraw(client);
	});

	// opponent score event
	// moves appropriate category slider to the opponent's score
	// to show a visual result
	client.on('opponentScore', function(result) {
		game.onOpponentScore(client, result);
	});

	// nextRound event
	// sent by the players when they're ready for the next round
	client.on('nextRound', function() {
		game.onNextRound(client);
	});

	// gameOver event
	// sent by the losing player to tell the opponent they've won
	client.on('gameOver', function() {
		game.onGameOver(client);
	});

	client.on('disconnect', function() {
		// @todo End game properly when someone disconnects
		console.log('socket.io client disconnected: ' + client.userid);
		game.endGame(client.game.id, client.userid);
	});
});


// routes
app.get('/cards', function(req, res) {
	card.find({}, function(err, cards) {
		res.json(cards);
	});
});

app.get('/cards/:name', function(req, res) {
	card.findOne({ 'name': req.params.name }, function(err, card) {
		res.json(card);
	});
});

app.get('/me', isAuthenticated, function(req, res) {
	user.findOne({ 'email': req.user.email }, function(err, user) {
		if(err) {
			console.log(err);
		}
		res.json(user);
	});
});

app.get('/me/collection', isAuthenticated, function(req, res) {
	// fetch card collection which is an 
	// array of card Object Ids
	user.aggregate([
		{ $match: { email: req.user.email }},
		{ $project: { cards: true }}
	], function(err, collection) {
		if(err) {
			console.log(err);
		}
		// now retrieve card objects from the ids
		// first map the ids to an array of type ObjectId
		// note this is a mongoose supplied data type
		var cardIds = collection[0].cards.map(function(cardId) {
			return mongoose.Types.ObjectId(cardId);
		});

		// now we have the card ids, fetch the cards and return
		// you can query with an array using the $in operator in mongo
		card.find({ "_id": { "$in": cardIds } }, function(err, cards) {
			if(err) {
				console.log(err);
			}
			res.json(cards);
		});
	});
});

app.get('/logout', function(req, res) {
	// req.logout() provided by passport
	req.logout();
	res.status(200).end();
});


// facebook oauth
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res) {
	res.writeHead(302, {
        'Location': '/#!/home'
    });
    res.end();
});

// twitter oauth
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter'), function(req, res) {
	res.writeHead(302, {
        'Location': '/#!/home'
    });
    res.end();
});

// google oauth
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.profile.emails.read'] }));

app.get('/auth/google/callback', passport.authenticate('google'), function(req, res) {
	res.writeHead(302, {
        'Location': '/#!/home'
    });
    res.end();
});

// bot endpoints
app.post('/api/messages', bot.connector.listen());


/*
* FOR TESTING ONLY - LOCAL SIGNUP TO ALLOW OTHER USERS TO SIGNUP FOR TESTING
*/
app.post('/auth/local', passport.authenticate('local'), function(req, res) {
	// you can't redirect from an AJAX post request
	// so just respond with a status and let the front-end redirect
	res.status(200).end();
});


// start app
server.listen(3000, function() {
	console.log('Listening on port 3000');
});