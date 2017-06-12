angular.module('TCModule').controller('GameController', function($scope, $mdToast, $mdDialog, $interval, $q, $document, $timeout, Cards, socket, Gravatar) {
	$scope.collection;
	$scope.currentCard;
	$scope.host;
	$scope.gameInProgress;
	$scope.turn;

	// counter for the number of rounds played
	$scope.round;

	// result object to compare scores and 
	// calculate who wins a round
	$scope.result = {
		myScore: 0,
		opponentScore: 0,
		opponentCard: {},
		category: ''
	};

	// gravatar images for score bar and in-game chat
	$scope.myGravatarUrl;
	$scope.opponentGravatarUrl;

	// chat object sent during in-game chat
  	$scope.chat = {
  		messages: [],
		sendMessage: ''
	};

	// opponent score variables
	$scope.showScore = false;
	$scope.showResult = false;
	// scoreSlider moves the opponent score slider bar
	$scope.result.scoreSlider = 0;
	// scoreSliderValue increments the opponent's score value
	// required as a separate value because scoreSlider is 
	// incremented in different steps depending on the values
	$scope.result.scoreSliderValue = 0;
	$scope.result.message = '';

	// overall game score
	// assumes a 10 card game, will need to 
	// change when option is added for different
	// sized games
	$scope.myScore = 10;
	$scope.opponentScore = 10;


	// functions...
	$scope.init = function(user) {
		// get my gravatar
		$scope.myGravatarUrl = Gravatar(user.email, 80);

		// create connection to socket.io
		socket.connect();

		// now listen for events
		socket.on('onconnected', function(data) {
			console.log('Connected to TC via socket.io. Player id is ' + data);
		});

		// in-game chat message received
		socket.on('message', function(message) {
			message.me = false;
			$scope.chat.messages.push(message);
		});

		// status update sent
		socket.on('status', function(status) {
			// status messages are not player specific, so
			// add the TC logo as the avatar
			var statusMessage = {
				message: status,
				gravatarUrl: '/images/tc-avatar.png'
			};

			$scope.chat.messages.push(statusMessage);
		});

		// opponent's gravatar sent
		socket.on('opponentGravatar', function(data) {
			$scope.opponentGravatarUrl = data.gravatar;
		});

		// game has started
		socket.on('start', function(status) {
			// $scope.msg = 'Game has begun!';
			$scope.gameInProgress = true;
			$scope.round = 0;

			// send avatar to opponent for score bar
			socket.emit('opponentGravatar', { gravatar: $scope.myGravatarUrl });

			if(status === 'host') {
				$scope.host = true;
				$scope.turn = true;
				
				// inform host they go first
				$mdToast.show(
		      		$mdToast.simple()
			        .textContent('Your turn!')
			        .position('bottom')
			        .hideDelay(3000)
			    );

			} else {
				$scope.host = false;
				$scope.turn = false;
			}

			// get user's card collection
			Cards.getCardCollection().then(function(cards) {
				$scope.collection = cards.data;
				// force array creation for ng-repeat to work
				// otherwise the card object is at the "wrong level"
				// and we get a card for each property of a card 
				// instead of a single object
				$scope.currentCard = [$scope.collection[$scope.round]];
			});
		});

		// user has been sent a card they've won from an opponent
		// just add to end of collection
		socket.on('victorious', function(data) {
			console.log('I win :) ');

			$scope.collection.push(data[0]);
			$scope.round++;
			$scope.turn = true;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});

		// user has lost a round, remove their current card
		socket.on('defeated', function() {
			console.log('I lose :(');

			$scope.turn = false;
			$scope.collection.splice($scope.round, 1);

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});

		// round was drawn, just move onto next card
		socket.on('draw', function() {
			console.log('Draw :|');

			$scope.round++;

			// minus 1 from collection length because $scope.round starts at zero
			if($scope.round > $scope.collection.length - 1) {
				// go back to beginning of pack
				$scope.round = 0;
			}

			console.log('my round: ', $scope.round);
			$scope.collection.forEach(function(card) {
				console.log(card.name);
			});
			console.log($scope.turn);
		});

		// opponentScore event
		// the player "out-of-turn" has sent his score back to
		// the player "in-turn" and the slider needs to move accordinly
		// so both players can visually see each other's scores
		socket.on('opponentScore', function(result) {
			// assign out-of-turn player's card to result object
			// so player-in-turn can see who their opponent
			$scope.result.opponentCard = result.card;

			$scope.moveOpponentScoreSlider(result.category, result.score, $scope.result.myScore).then(function() {
				// show result then emit nextRound event
				// to show you're ready to proceed
				if($scope.result.myScore > result.score) {
					// you've won
					$scope.myScore++;
					$scope.opponentScore--;
					$scope.result.message = '🎉 So Much Win!';
				} else if($scope.result.myScore < result.score) {
					// you've lost
					$scope.myScore--;
					$scope.opponentScore++;
					$scope.result.message = '💩 What A Lose';
				} else {
					// draw
					$scope.result.message = '😑 It\'s a Draw';
				}

				$scope.showResult = true;
				socket.emit('nextRound');
			});
		});

		// nextRound event - both players are ready for their next card
		socket.on('nextRound', function() {
			console.log('next round!');

			$timeout(function() {
				// reset opponent score visibility and unhide card categories
				$scope.showScore = false;
				$scope.showResult = false;
				$scope.result.scoreSlider = 0;
				$scope.result.scoreSliderValue = 0;
				$scope.result.message = '';

				$scope.hideUnpalatibility = false;
				$scope.hideUpTheirOwnArsemanship = false;
				$scope.hideMediaAttention = false;
				$scope.hideLegacy = false;
				$scope.hidePpc = false;
				$scope.hideSpecialAbility = false;

				if($scope.collection.length === 0) {
					// I've lost, game over
					$mdDialog.show(
						$mdDialog.alert()
							.parent(angular.element($document.body))
							.clickOutsideToClose(true)
							.title('Game Over')
							.textContent('You lose. The Donald does a cry, you lost to a bad hombre')
							.ariaLabel('Game Over Dialog')
							.ok('Home')
					);

					socket.emit('gameOver');
				} else {
					$scope.currentCard = [$scope.collection[$scope.round]];
				}
			}, 5000);
		});

		// in-game play events
		// this is where the result is calculated, this always happens for the 
		// player "out-of-turn" i.e. it isn't their turn to play a card.
		// the result is then passed back to the player "in-turn"
		socket.on('play', function(play) {
			$scope.result.myScore = $scope.currentCard[0][play.category];
			$scope.result.opponentScore = play.score;
			$scope.result.opponentCard = play.card;
			$scope.result.category = play.category;

			// send score to opponent to update their slider
			socket.emit('opponentScore', { category: $scope.result.category, score: $scope.result.myScore, card: $scope.currentCard });

			console.log($scope.result);

			$scope.moveOpponentScoreSlider($scope.result.category, $scope.result.opponentScore, $scope.result.myScore).then(function() {
				$scope.resultCheck();
			});

		});

		// game over event, player has won
		socket.on('gameOver', function() {
			$mdDialog.show(
				$mdDialog.alert()
					.parent(angular.element($document.body))
					.clickOutsideToClose(true)
					.title('Game Over')
					.textContent('You win! The Donald is proud, you\'re making America great again')
					.ariaLabel('Game Over Dialog')
					.ok('Home')
			);
		});

	};


	// in-game chat - send message
	$scope.send = function() {
		var message = {
			message: $scope.chat.sendMessage,
			gravatarUrl: $scope.myGravatarUrl,
			me: true
		};

		$scope.chat.messages.push(message);
		socket.emit('message', message);

		// clear input ready for a new message
		$scope.chat.sendMessage = null;
	};


	// user has selected a category to play
	$scope.play = function(category, score) {
		if($scope.turn) {
			// update result object
			$scope.result.myScore = score;
			$scope.result.category = category;

			socket.emit('play', { card: $scope.currentCard, category: category, score: score });
		}
	};


	// move slider function to see opponent's score
	$scope.moveOpponentScoreSlider = function(category, opponentScore, myScore) {
		$scope.showScore = true;
		$scope.maskCategories(category);

		console.log('opponentScore: ', opponentScore, ' myScore: ', myScore);

		return $q(function(resolve, reject) {
			$interval(function() {
				// $scope.result.scoreSlider += 1;
				$scope.result.scoreSlider += (100 / myScore);
				$scope.result.scoreSliderValue += 1;
			}, 200, opponentScore, true).then(function() {
				resolve();
			});
		});
	};


	// function that hides all other categories other than the selected one
	// ready for the result display
	$scope.maskCategories = function(category) {
		$scope.hideUnpalatibility = (category === 'unpalatibility') ? false : true;
		$scope.hideUpTheirOwnArsemanship = (category === 'up_their_own_arsemanship') ? false : true;
		$scope.hideMediaAttention = (category === 'media_attention') ? false : true;
		$scope.hideLegacy = (category === 'legacy') ? false : true;
		$scope.hidePpc = (category === 'ppc') ? false : true;
		$scope.hideSpecialAbility = (category === 'special_ability') ? false : true;
	};


	// check the result once sliders have finished moving
	$scope.resultCheck = function() {
		if($scope.result.myScore > $scope.result.opponentScore) {
			// win! opponent's card is added to collection :)
			console.log('I win :)');

			$scope.collection.push($scope.result.opponentCard[0]);
			$scope.round++;
			$scope.turn = true;
			$scope.myScore++;
			$scope.opponentScore--;
			$scope.result.message = '🎉 So Much Win!';
			$scope.showResult = true;

			// tell opponent they have been defeated so their card is removed
			socket.emit('defeated');

		} else if($scope.result.myScore < $scope.result.opponentScore) {
			// lost, card is removed from collection and sent to winner :(
			console.log('I lose :(');

			$scope.turn = false;
			$scope.myScore--;
			$scope.opponentScore++;
			$scope.result.message = '💩 What A Lose';
			$scope.showResult = true;

			// tell opponent they have won the round and send them their new card
			var lostCard = $scope.collection.splice($scope.round, 1);
			socket.emit('victorious', lostCard);

		} else {
			console.log('It\'s a draw :|');

			$scope.round++;
			$scope.result.message = '😑 It\'s a Draw';
			$scope.showResult = true;

			socket.emit('draw');
		}

		// minus 1 from collection length because $scope.round starts at zero
		if($scope.round > $scope.collection.length - 1) {
			// go back to beginning of pack
			$scope.round = 0;
		}

		// ready for next round
		socket.emit('nextRound');

		// debugging info...
		console.log('my round: ', $scope.round);
		$scope.collection.forEach(function(card) {
			console.log(card.name);
		});
		console.log('my turn: ', $scope.turn);
	};


	// this method checks for the start of a route change
	// i.e. player is leaving the game, so disconnect them
	$scope.$on('$stateChangeStart', function(next, current) {
		// if game was in progress and user was host then disconnect
		if($scope.gameInProgress && $scope.host) {
			console.log('host is disconnecting');
			socket.emit('message', 'Host has left the game...');
			socket.disconnect();
		} else if($scope.gameInProgress && !$scope.host) {
			console.log('client is disconnecting');
			socket.emit('message', 'Opponent has left the game...');
			socket.disconnect();
		}
	});

});
