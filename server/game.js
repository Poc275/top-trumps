/**
 * Game module that handles the game functionality. Creating/finding games, 
 * connecting players, handling socket.io communications etc.
 * @module server/game
 */
var gameServer = module.exports = {
	games: {},
	gameCount: 0
};

var uuid = require('uuid');


/**
 * Function that handles the in-game play messages. These messages 
 * are the category/score that a player has chosen to play. This is 
 * then sent onto the opposing player for comparison to see who wins the card.
 * @param {object} client - The client whose turn it was to play
 * @param {object} msg - Card object
 */
gameServer.onPlay = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;
	console.log('sender userid: ' + sender);

	if(client.game.playerHost.userid === sender) {
		console.log('host sending message to guest: ' + msg);
		client.game.playerClient.emit('play', msg);
	} else {
		console.log('guest sending message to host: ' + msg);
		client.game.playerHost.emit('play', msg);
	}
};


/**
 * The "out-of-turn" player assesses the result because the 
 * player "in-turn" sends the score to them for comparison. This 
 * means that the player "out-of-turn" must inform the other player 
 * the result otherwise the result is only applied to 1 player. This 
 * function is for when the player "in-turn" has won a round.
 * @param {object} client - The client who lost the round
 * @param {object} msg - Card object
 */
gameServer.onVictorious = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;
	console.log('sender userid: ' + sender);

	if(client.game.playerHost.userid === sender) {
		console.log('host lost card: ' + msg);
		client.game.playerClient.emit('victorious', msg);
	} else {
		console.log('guest lost card: ' + msg);
		client.game.playerHost.emit('victorious', msg);
	}
};


/**
 * As onVictorious() but this function is for when the 
 * player "in-turn" has lost a round.
 * @param {object} client - The client who won the round
 */
gameServer.onDefeated = function(client) {
	// get opposition player to send msg to
	var sender = client.userid;
	console.log('sender userid: ' + sender);

	if(client.game.playerHost.userid === sender) {
		console.log('host won card');
		client.game.playerClient.emit('defeated');
	} else {
		console.log('guest won card');
		client.game.playerHost.emit('defeated');
	}
};


/**
 * As onVictorious() but this function is for when the 
 * round has been drawn.
 * @param {object} client - The client sending the draw result
 */
gameServer.onDraw = function(client) {
	// get opposition player to send msg to
	var sender = client.userid;
	console.log('sender userid: ' + sender);

	if(client.game.playerHost.userid === sender) {
		console.log('draw');
		client.game.playerClient.emit('draw');
	} else {
		console.log('draw');
		client.game.playerHost.emit('draw');
	}
};


/**
 * Function that handles the passing of messages between players.
 * The 'message' event is for status updates (game found, game created, 
 * waiting for 2nd player etc.) and in-game chat.
 * @param {object} client - The client who sent the message
 * @param {string} msg - The content of the message
 */
gameServer.onMessage = function(client, msg) {
	// get opposition player to send msg to
	var sender = client.userid;
	console.log('sender userid: ' + sender);

	if(client.game.playerHost.userid === sender) {
		console.log('host sending message to guest: ' + msg);
		client.game.playerClient.emit('message', msg);
	} else {
		console.log('guest sending message to host: ' + msg);
		client.game.playerHost.emit('message', msg);
	}
};


/**
 * Function that starts the game once 2 players are connected.
 * @param {object} game - game object to start
 */
gameServer.startGame = function(game) {
	// game has 2 players so we can start
	console.log('game has started');

	// send a start game event to kick things off
	game.playerClient.emit('start', 'client');
	game.playerHost.emit('start', 'host');

	game.playerClient.game = game;
	game.active = true;
};


/**
 * Function that creates a new game instance.
 * @param {object} player - player creating the game, the host
 * @returns {object} newGame with properties:
 * @property {UUID} id - Game unique id
 * @property {object} playerHost - Host player object
 * @property {object} playerClient - Client player 2, set to null initally until findGame adds them
 * @property {number} playerCount - Number of players in the game, initially set to 1
 */
gameServer.createGame = function(player) {
	// create new game instance
	var newGame = {
		id: uuid(),
		playerHost: player,
		playerClient: null,
		playerCount: 1
	};

	// store it in the list of games
	gameServer.games[newGame.id] = newGame;
	gameServer.gameCount++;

	// tell the player they are now hosting a game and waiting
	player.emit('message', newGame.id + ': You are now the host, waiting for another player');

	player.game = newGame;
	player.hosting = true;

	console.log('player ' + player.userid + ' created game with id ' + player.game.id);

	return newGame;
};


/**
 * Function finds if a game is available by looping through all created 
 * games and seeing if there is only 1 player inside it. If a game is 
 * found then the user is added as the client to the game, if not, a new 
 * game is created and the user is added as the host.
 * @param {object} player - player trying to join the game
 */
gameServer.findGame = function(player) {
	console.log('looking for a game. We have: ' + gameServer.gameCount);

	if(gameServer.gameCount > 0) {
		// we have active games,
		// see if one needs another player
		var joined = false;

		for(var gameId in gameServer.games) {
			var gameInstance = gameServer.games[gameId];

			if(gameInstance.playerCount < 2) {
				// join game
				console.log('Joined game: ' + gameInstance.id);
				joined = true;
				gameInstance.playerClient = player;
				gameInstance.playerCount++;

				gameInstance.playerClient.emit('message', 'You have now joined a game');

				gameServer.startGame(gameInstance);
			}
		}

		// no games available to join
		// create one instead
		if(!joined) {
			console.log('all games full, creating one instead...');
			gameServer.createGame(player);
		}
	} else {
		// no games exist
		// create one
		console.log('no games exist, creating one...');
		gameServer.createGame(player);
	}
};


/**
 * Function that deletes a game object if a player disconnects or
 * navigates away from the page.
 * @param {object} gameId - Game ID to find and delete from gameServer.games
 * @param {object} userid - User ID of player that left, from this we can tell the other player what happened
 * @todo Try and reconnect the player that is left behind to a new game?
 */
gameServer.endGame = function(gameId, userid) {
	var game = gameServer.games[gameId];

	if(game) {
		// for now just kill the game, but will
		// need to handle this more gracefully
		delete gameServer.games[gameId];
		gameServer.gameCount--;

		console.log(gameId + ' removed. There are now ' + gameServer.gameCount + ' games left');
	}
};