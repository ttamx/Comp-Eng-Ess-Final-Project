import { Player } from './Player.js';

class GameState {
	// waiting,preflop, flop, turn, river, showdown
	constructor() {
		this.players = [];
		this.deck = [];
		this.communityCards = [];
		this.currentPlayer = 0;
		this.currentRound = 'waiting';
		this.smallBlind = 10;
		this.bigBlind = 20;
		this.currentBet = 0;
		this.pot = 0;
		this.dealer = 0;
	}

	dealCards() {
		var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
		var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
		values.forEach((value) => {
			suits.forEach((suit) => {
				var cardKey = `${value}_of_${suit}`;
				var cardKey2 = cardKey;
				if (value === 'jack' || value === 'queen' || value === 'king') {
					cardKey2 = `${value}_of_${suit}2`;
				}
				this.deck.push(cardKey);
			});
		});
	}

	shuffleDeck() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}

	addPlayer(name) {
		this.players.push(new Player(name));
	}

	dealEachPlayer() {
		for (let t = 0; t < 2; t++) {
			for (let i = 0; i < this.players.length; i++) {
				this.players[i].dealCard(this.deck.pop());
			}
		}
	}

	dealCommunityCards() {
		this.communityCards.push(this.deck.pop());
	}

	addPot(amount) {
		this.pot += amount;
	}

	nextPlayer() {
		this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
		return this.currentPlayer;
	}

	check() {
		this.players[this.currentPlayer].currentBet = this.currentBet;	
	}

	bet(amount) {
		this.players[this.currentPlayer].bet(amount);
		this.currentBet = amount;
	}

	fold() {
		this.players[this.currentPlayer].fold();
	}

	isAllIn(player) {
		return player.chips === 0;
	}

	checkAllBets() {
		var currentBet = this.players[this.currentPlayer].currentBet;
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].currentBet !== currentBet && !this.isAllIn(this.players[i])) {
				return false;
			}
		}
		return true;
	}

	bettingRound() {
		while (!this.checkAllBets()) {
			if (this.isAllIn(this.players[this.currentPlayer])) {
				this.nextPlayer();
				continue;
			}
			// idk
		}
	}

			

	startGame() {
		this.dealCards();
		this.shuffleDeck();
		this.dealEachPlayer();
	}

	preFlop() {
		this.currentRound = 'preflop';
		this.addPot(this.smallBlind);
		this.players[(this.dealer + 1) % this.players.length].bet(this.smallBlind);
		this.addPot(this.bigBlind);
		this.players[(this.dealer + 2) % this.players.length].bet(this.bigBlind);
	}




}