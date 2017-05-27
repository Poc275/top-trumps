angular.module('TCModule').controller('GameController', function($scope, $mdToast, $mdDialog, $interval, $q, $document, Cards, socket, Gravatar) {

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

	// gravatar images for in-game chat
	$scope.myGravatarUrl;
	$scope.opponentGravatarUrl;

	// chat object sent during in-game chat
  	$scope.chat = {
  		messages: [],
		sendMessage: ''
	};

	// opponent score variables
	$scope.unpalatibilityScore = 0;
	$scope.upTheirOwnArsemanshipScore = 0;
	$scope.mediaAttentionScore = 0;
	$scope.legacyScore = 0;
	$scope.ppcScore = 0;
	$scope.specialAbilityScore = 0;



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


		// game has started
		socket.on('start', function(status) {
			$scope.msg = 'Game has begun!';
			$scope.gameInProgress = true;
			$scope.round = 0;

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

			// $scope.currentCard = [$scope.collection[$scope.round]];

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

			// $scope.currentCard = [$scope.collection[$scope.round]];

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

			// $scope.currentCard = [$scope.collection[$scope.round]];

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
			$scope.moveOpponentScoreSlider(result.category, result.score).then(function() {
				var resultMessage = {
					message: '',
					gravatarUrl: '/images/tc-avatar.png'
				};

				// inform user in chat if they've won/lost/drawn
				if($scope.currentCard[0][result.category] > result.score) {
					resultMessage.message = 'You win';
				} else if($scope.currentCard[0][result.category] < result.score) {
					resultMessage.message = 'You lose';
				} else {
					resultMessage.message = 'It\'s a draw';
				}

				$scope.chat.messages.push(resultMessage);

				// ready for next round
				socket.emit('nextRound');
			});
		});


		// nextRound event - both players are ready for their next card
		socket.on('nextRound', function() {
			console.log('next round!');

			// reset slider visibility and scores
			$scope.unpalatibilityScoreVisible = false;
			$scope.upTheirOwnArsemanshipScoreVisible = false;
			$scope.mediaAttentionScoreVisible = false;
			$scope.legacyScoreVisible = false;
			$scope.ppcScoreVisible = false;
			$scope.specialAbilityScoreVisible = false;

			$scope.unpalatibilityScore = 0;
			$scope.upTheirOwnArsemanshipScore = 0;
			$scope.mediaAttentionScore = 0;
			$scope.legacyScore = 0;
			$scope.ppcScore = 0;
			$scope.specialAbilityScore = 0;

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
			socket.emit('opponentScore', { category: $scope.result.category, score: $scope.result.myScore });

			console.log($scope.result);

			$scope.moveOpponentScoreSlider($scope.result.category, $scope.result.opponentScore).then(function() {
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
			socket.emit('play', { card: $scope.currentCard, category: category, score: score });
		}
	};


	// move slider function to see opponent's score
	$scope.moveOpponentScoreSlider = function(category, score) {

		switch(category) {
			case 'unpalatibility':
				$scope.unpalatibilityScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.unpalatibilityScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});

			case 'up_their_own_arsemanship':
				$scope.upTheirOwnArsemanshipScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.upTheirOwnArsemanshipScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});

			case 'media_attention':
				$scope.mediaAttentionScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.mediaAttentionScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});

			case 'legacy':
				$scope.legacyScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.legacyScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});

			case 'ppc':
				$scope.ppcScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.ppcScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});

			case 'special_ability':
				$scope.specialAbilityScoreVisible = true;

				return $q(function(resolve, reject) {
					$interval(function() {
						$scope.specialAbilityScore += 1;
					}, 200, score, true).then(function() {
						resolve();
					});
				});
		}
	};


	// check the result once sliders have finished moving
	$scope.resultCheck = function() {
		var resultMessage = {
			message: '',
			gravatarUrl: '/images/tc-avatar.png'
		};

		if($scope.result.myScore > $scope.result.opponentScore) {
			// win! opponent's card is added to collection :)
			console.log('I win :)');

			resultMessage.message = 'You win';
			$scope.collection.push($scope.result.opponentCard[0]);
			$scope.round++;
			$scope.turn = true;

			// tell opponent they have been defeated so their card is removed
			socket.emit('defeated');

		} else if($scope.result.myScore < $scope.result.opponentScore) {
			// lost, card is removed from collection and sent to winner :(
			console.log('I lose :(');

			resultMessage.message = 'You lose';
			$scope.turn = false;

			// tell opponent they have won the round and send them their new card
			var lostCard = $scope.collection.splice($scope.round, 1);
			socket.emit('victorious', lostCard);

		} else {
			console.log('It\'s a draw :|');

			resultMessage.message = 'It\'s a draw';
			$scope.round++;
			socket.emit('draw');
		}

		// minus 1 from collection length because $scope.round starts at zero
		if($scope.round > $scope.collection.length - 1) {
			// go back to beginning of pack
			$scope.round = 0;
		}


		$scope.chat.messages.push(resultMessage);

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
