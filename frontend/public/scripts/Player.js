class Player {
	constructor(name) {
		this.name = name;
		this.cards = [];
		this.chips = 1000;
		this.currentBet = 0;
		this.isFolded = false;
		this.decision = '';
	}

	bet(amount) {
		this.chips -= amount;
		this.currentBet += amount;
	}

	resetBet() {
		this.currentBet = 0;
	}

	fold() {
		this.cards = [];
	}

	win(amount) {
		this.chips += amount;
	}

	dealCard(card) {
		this.cards.push(card);
	}

	makeDecision() {
		// having 30 seconds to make a decision
		// if the player does not make a decision in 30 seconds, the player will be folded
		// the decision will be either fold, call, or raise

		// counting down from 30 seconds
		var submitButton = document.getElementById('submit');
		var seconds = 30;
		var timer = setInterval(() => {
			seconds--;
			if (seconds === 0) {
				this.decision = 'fold';
				clearInterval(timer);
			}
		}, 1000);
	}
}

export { Player };