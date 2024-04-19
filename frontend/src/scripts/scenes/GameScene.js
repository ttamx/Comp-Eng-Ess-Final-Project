import { sendScore } from "../api.js";

export class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	preload() {
		this.load.image('character', '../../assets/capoo.png');
		this.load.image('bomb', '../../assets/bomb.png');
		this.load.image('star', '../../assets/star.png');
	}

	create() {
		this.username = document.cookie.split('=')[1];
		this.player = this.physics.add.sprite(100, 450, 'character').setScale(0.07);
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.player.setVelocityY(-330);
		this.isJump = false;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.velocity = -500;
		this.obstacles = this.physics.add.group();
		this.lastdistance = 0;
		this.distance = 0;
		this.gameOver = false;
		this.score = 0;
		this.physics.add.collider(this.player, this.obstacles, () => {
			this.gameOver = true;
			this.physics.pause();
			this.player.setTint(0xff0000);
			console.log(this.username, this.score, Math.floor(this.distance/1000));
			sendScore(this.username, this.score, Math.floor(this.distance/1000));
		});
		this.stars = this.physics.add.group();
		this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#0F0' });
		this.distanceText = this.add.text(16, 48, 'distance: 0', { fontSize: '32px', fill: '#0F0' });
		this.physics.add.overlap(this.player, this.stars, (player, star) => {
			star.destroy();
			this.score += 1;
			this.scoreText.setText('Score: ' + this.score);
		});
		this.count = 0;
	}

	update() {
		if (this.gameOver) {
			return;
		}
		this.distance -= this.velocity;
		this.distanceText.setText('Distance: ' + Math.floor(this.distance/1000));
		if (this.cursors.space.isDown) {
				this.player.setVelocityY(-300);
		} else {
			this.player.setVelocityY(300);
		}
		while (this.distance - this.lastdistance > 1000) {
			this.count += 1;
			this.lastdistance += 1000;
		}
		if (this.count % 7 == 0) {
			this.createBomb();
		}
		if (this.count % 15 == 0) {
			this.createStar();
		}
		if (this.count % 100 == 0) {
			this.velocity -= 5;
		}
	}

	createBomb() {
		const randomY = Math.floor(Math.random() * 700);
		var bomb = this.obstacles.create(1280, randomY, 'bomb').setScale(1.5);
		bomb.setVelocityX(this.velocity);
		bomb.setBounce(1);
		bomb.checkWorldBounds = true;
		bomb.outOfBoundsKill = true;
	}

	createStar() {
		const randomY = Math.floor(Math.random() * 705);
		var star = this.stars.create(1280, randomY, 'star').setScale(1);
		star.setVelocityX(this.velocity);
		star.setBounce(1);
		star.checkWorldBounds = true;
		star.outOfBoundsKill = true;
	}
}