import { Card } from '../Card.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

	preload() {
		this.load.image('board', '../assets/board.png');
   		this.load.spritesheet('cards', '../assets/card.png', {
        frameWidth: 72,
        frameHeight: 96
    });
		var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
		var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
		values.forEach((value) => {
			suits.forEach((suit) => {
				var cardKey = `${value}_of_${suit}`;
				var cardKey2 = cardKey;
				if (value === 'jack' || value === 'queen' || value === 'king') {
					cardKey2 = `${value}_of_${suit}2`;
				}
				console.log(`Loading card: ${cardKey}`);
				this.load.image(`${cardKey}`, `../../assets/cards/${cardKey2}.png`);
			});
		});
	}

	create() {
		this.add.image(400, 300, 'board');
		this.cards = [];
		this.cards.push(new Card(this, 100, 100, 'Ace', 'Spades'));
		this.cards.push(new Card(this, 200, 100, 'King', 'Hearts'));
		this.cards.push(new Card(this, 300, 100, 'Queen', 'Clubs'));
		this.cards.push(new Card(this, 400, 100, 'Jack', 'Diamonds'));
	}
}

export { GameScene };