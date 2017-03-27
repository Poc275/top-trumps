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


gameServer.onMessage = function(client, msg) {
	// get opposition player to send msg to
	var opponent = client.game.playerHost.game;

	// console.log(opponent);

	// opponent.send('host says: ' + msg);
	if(client.game.playerClient) {
		console.log('emitting message');
		client.to(client.game.playerClient).emit('message', { message: msg });
	}
};


/**
 * Function that starts the game once 2 players are connected.
 * @param {object} game - game object to start
 */
gameServer.startGame = function(game) {
	// game has 2 players so we can start
	console.log('game has started');

	// tell the other player they are joining the game
	// game.playerClient.send('You have joined game: ' + game.playerHost.userid);

	// now tell both the game has started
	game.playerClient.send('Game has started!');
	game.playerHost.send('Game has started');

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
	player.emit('message', 'You are now the host, waiting for another player');

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