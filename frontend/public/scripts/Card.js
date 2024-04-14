class Card {
	constructor(scene, x, y, value, suit) {
		this.scene = scene;
		this.value = value;
		this.suit = suit;
		this.sprite = scene.add.sprite(x, y, `${value.toLowerCase()}_of_${suit.toLowerCase()}`);
		this.sprite.setScale(0.2);
		this.sprite.setInteractive();
		this.sprite.on('pointerdown', this.onPointerDown, this);
	}

	onPointerDown() {
		console.log(`${this.value} of ${this.suit} was clicked`);
	}
}

export { Card };