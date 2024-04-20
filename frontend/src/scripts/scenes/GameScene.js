import { sendScore } from "../api.js";

export class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	preload() {
		this.load.image('background', '../../assets/background.jpg');
		this.load.image('character', '../../assets/capoo.png');
		this.load.image('meteor', '../../assets/meteor.png');
		this.load.image('star', '../../assets/star.png');
	}

	create() {
		if(!document.cookie.includes('username=') || document.cookie.split('=')[1] === '') {
			window.location.href = '/';
			return;
		}
		this.background = this.physics.add.sprite(0, 0, 'background').setScale(0.3515625).setOrigin(0, 0);
		this.background.setVelocityX(0);
		this.background.setDepth(-1);
		this.background2 = this.physics.add.sprite(5625, 0, 'background').setScale(0.3515625).setOrigin(0, 0);
		this.background2.setVelocityX(0);
		this.background2.setDepth(-1);
		this.started = false;
		this.username = document.cookie.split('=')[1];
		this.player = this.physics.add.sprite(100, 450, 'character').setScale(0.07);
		this.player.setBounce(10);
		this.player.setCollideWorldBounds(true);
		this.player.setVelocityY(0);
		this.isJump = false;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.playerSpeed = 400;
		this.velocity = -500;
		this.gameSpeed = 1.3;
		this.meteors = this.physics.add.group();
		this.lastdistance = 0;
		this.distance = 0;
		this.gameOver = false;
		this.score = 0;
		this.invincible = false;
		this.health = 1;
		this.healthText = this.add.text(16, 80, `Health: ${this.health}`, { fontSize: '32px', fill: '#FFFFFF',fontFamily:'ArcadeClassic' });
		// overSound = this.sound.add('overSound');
		this.physics.add.overlap(this.player, this.meteors, (player, meteor) => {
			if (this.invincible) {
				return;
			}
			this.health -= 3;
			this.getHurt();
			if (this.health < 0) {
				this.health = 0;
			}
			this.healthText.setText('Health: ' + this.health);
			if(this.health === 0) {
				this.gameOver = true;
				this.physics.pause();
				this.player.setTint(0xff0000);
				console.log(this.username, this.score, Math.floor(this.distance/1000));
				sendScore(this.username, this.score, Math.floor(this.distance/1000));
			}
		});
		this.stars = this.physics.add.group();
		this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF',fontFamily:'ArcadeClassic'});
		this.distanceText = this.add.text(16, 48, 'Distance: 0', { fontSize: '32px', fill: '#FFFFFF',fontFamily:'ArcadeClassic'});
		this.physics.add.overlap(this.player, this.stars, (player, star) => {
			star.destroy();
			this.score += 1;
			this.scoreText.setText('Score: ' + this.score);
		});
		this.count = 0;
	}

	update() {
		if (!this.started) {
			if (this.cursors.space.isDown || this.input.activePointer.isDown) {
				this.started = true;
				this.updateCount();
			
				this.background.setVelocityX(-30);
				this.background2.setVelocityX(-30);
			} else {
				return;
			}
		}
		if (this.gameOver) {
			window.location.href = './gameover.html';
			return;
		}
		this.updateCyclicBackground();
		this.distance -= this.velocity * this.gameSpeed;
		this.distanceText.setText('Distance: ' + Math.floor(this.distance/1000));

		while (this.distance - this.lastdistance > 1000) {
			this.updateCount();
			this.lastdistance += 1000;
		}

		if (this.cursors.space.isDown || this.input.activePointer.isDown) {
			this.player.setVelocityY(-this.playerSpeed * this.gameSpeed );
		} else {
			this.player.setVelocityY(this.playerSpeed * this.gameSpeed);
		}
	}

	updateCyclicBackground() {
		if (this.background.x < -5625) {
			this.background.x = 5625;
		}
		if (this.background2.x < -5625) {
			this.background2.x = 5625;
		}
	}

	updateCount() {
		this.count += 1;

		if (this.count % 1000 == 0) {
			this.gameSpeed += 0.01;
			this.meteors.children.iterate((child) => {
				child.setVelocityX(this.velocity * this.gameSpeed);
			});
			this.stars.children.iterate((child) => {
				child.setVelocityX(this.velocity * this.gameSpeed);
			});
		}

		if (this.count % 10 == 5) {
			this.createStar();
		}

		if(this.count % 1000 == 0) {
			for(let i = 0; i < 20; i++) {
				this.createStar();
			}
		} else if(this.count % 200 == 0) {
			for(let i = 0; i < 4; i++) {
				this.createMeteors();
			}
		} else if (this.count % 10 == 0) {
			this.createMeteors();
		}
	}

	createMeteors() {
		const randomY = Math.floor(Math.random() * 700);
		var meteor = this.meteors.create(1280, randomY, 'meteor').setScale(0.08);
		meteor.setVelocityX(this.velocity * this.gameSpeed);
		meteor.setBounce(1);
		meteor.checkWorldBounds = true;
		meteor.outOfBoundsKill = true;
	}

	createStar() {
		const randomY = Math.floor(Math.random() * 705);
		var star = this.stars.create(1280, randomY, 'star').setScale(0.03);
		star.setVelocityX(this.velocity * this.gameSpeed);
		star.setBounce(1);
		star.checkWorldBounds = true;
		star.outOfBoundsKill = true;
	}

	getHurt() {
		this.invincible = true;
		setTimeout(() => {
			this.invincible = false;
		}, 2000);
		const timer = this.time.addEvent({
			delay: 100,
			callback: () => {
				this.player.visible = !this.player.visible;
			},

			callbackScope: this,
			loop: true
		});
		setTimeout(() => {
			timer.remove();
			this.player.visible = true;
		}, 2000);
	}

	
}