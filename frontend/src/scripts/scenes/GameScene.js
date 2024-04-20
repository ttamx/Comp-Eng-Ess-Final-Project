import { sendScore } from "../api.js";

export class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
	}

	preload() {
		this.load.image('background', '../../assets/background.jpg');
		this.load.image('character', '../../assets/spacecraft.png');
		this.load.image('meteor', '../../assets/meteor.png');
		this.load.image('star', '../../assets/star.png');
		this.load.image('heart', '../../assets/heart.png');
		this.load.audio('bgm','../../assets/bgm.mp3');
		this.load.audio('crash','../../audio/crash.mp3');
		this.load.audio('starsfx','../../audio/star.mp3');
		this.load.image('bound', '../../assets/bound.png');
		this.load.spritesheet('boss1', '../../assets/boss1/spritesheet.png', { frameWidth: 2048, frameHeight: 2048 });
		this.load.image('bullet', '../../assets/bullet.png');
		this.load.image('bullet1', '../../assets/boss1/bullet.png');
	}

	create() {
		if(!document.cookie.includes('username=') || document.cookie.split('=')[1] === '') {
			window.location.href = '/';
			return;
		}
		this.bgm =this.sound.add('bgm');
		this.bgm.loop=true;
		this.bgm.play();
		this.crash =this.sound.add('crash',{ loop: false });
		this.starsfx =this.sound.add('starsfx',{ loop: false });
		this.background = this.physics.add.sprite(0, 0, 'background').setScale(0.3515625).setOrigin(0, 0);
		this.background.setVelocityX(0);
		this.background.setDepth(-1);
		this.background2 = this.physics.add.sprite(5625, 0, 'background').setScale(0.3515625).setOrigin(0, 0);
		this.background2.setVelocityX(0);
		this.background2.setDepth(-1);
		this.started = false;
		this.username = document.cookie.split('=')[1];
		this.player = this.physics.add.sprite(100, 450, 'character').setScale(0.17);
		this.player.setDepth(1000);
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true);
		this.player.setVelocityY(0);
		this.isJump = false;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.playerSpeed = 400;
		this.velocity = -500;
		this.gameSpeed = 1;
		this.bullets = this.physics.add.group();
		this.enemiesBullets = this.physics.add.group();
		this.meteors = this.physics.add.group();
		this.lastdistance = 0;
		this.distance = 0;
		this.totalDistance = 0;
		this.gameOver = false;
		this.score = 0;
		this.player.invincible = false;
		this.health = 10;
		this.bosses = this.physics.add.group();
		this.bounds = this.physics.add.staticGroup();
		const bound = this.bounds.create(750, 360, 'bound').setScale(2).refreshBody();
		bound.setVisible(false);
		this.physics.add.collider(this.bosses, this.bounds);
		this.heartGroup = [];
		
		this.physics.add.overlap(this.bullets, this.meteors, (bullet, meteor) => {
			bullet.destroy();
			meteor.health -= 1;
			if (meteor.health <= 0) {
				meteor.destroy();
			}
		});
		this.bossFighting = false;
		this.physics.add.overlap(this.bullets, this.bosses, (bullet, boss) => {
			if(boss.invincible) {
				return;
			}
			console.log('hit');
			bullet.destroy();
			boss.health -= 1;
			boss.updateHealth();
			if (boss.health <= 0) {
				boss.timers.forEach(timer => {
					timer.remove();
				});
				boss.totalHealthBar.destroy();
				boss.helthBar.destroy();
				boss.invincible = true;
				boss.setCollideWorldBounds(false);
				boss.setVelocityX(200);
				const timer = this.time.addEvent({
					delay: 100,
					callback: () => {
						boss.visible = !boss.visible;
					},
					callbackScope: this,
					loop: true
				});
				const timer2 = this.time.addEvent({
					delay: 250,
					callback: () => {
						boss.visible = !boss.visible;
						for(let i = 0; i < 5; i++) {
							this.createStar(-500 - Math.random() * 500);
						}
					},
					callbackScope: this,
					loop: true
				});
				setTimeout(() => {
					this.bossFighting = false;
					boss.destroy();
					this.gameSpeed += 0.25;
					this.gameSpeed = Math.min(2.5, this.gameSpeed);
					this.updateSpeed();
					timer.remove();
					timer2.remove();
				}, 5000);
			}
		});
		this.physics.add.overlap(this.player, this.enemiesBullets, (player, bullet) => {
			if (this.player.invincible) {
				return;
			}
			this.health -= 1;
			this.getHurt();
			this.updateHealth();
		});
		this.physics.add.overlap(this.player, this.meteors, (player, meteor) => {
			if (this.player.invincible) {
				return;
			}
			this.crash.play();
			this.health -= 1;
			this.getHurt();
			this.updateHealth();
			if (this.health < 0) {
				this.health = 0;
			}
			
			if(this.health === 0) {
				this.gameOver = true;
				this.physics.pause();
				this.player.setTint(0xff0000);
				console.log(this.username, this.score, Math.floor(this.totalDistance/1000));
				sendScore(this.username, this.score, Math.floor(this.totalDistance/1000));
			}
		});
		this.stars = this.physics.add.group();
		this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF',fontFamily:'ArcadeClassic'});
		this.distanceText = this.add.text(16, 48, 'Distance: 0', { fontSize: '32px', fill: '#FFFFFF',fontFamily:'ArcadeClassic'});
		this.scoreText.setDepth(1000);
		this.distanceText.setDepth(1000);
		this.physics.add.overlap(this.player, this.stars, (player, star) => {
			this.starsfx.play();
			star.destroy();
			this.score += 1;
			this.scoreText.setText('Score: ' + this.score);
		});
		this.count = 0;
		this.bossCounter = 0;
		this.anims.create({
			key: 'boss1',
			frames: this.anims.generateFrameNumbers('boss1', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1
		});

		this.createHeart();
	}

	update() {
		if (!this.started) {
			if (this.cursors.space.isDown || this.input.activePointer.isDown) {
				this.started = true;
				this.updateCount();
			
				this.background.setVelocityX(-30);
				this.background2.setVelocityX(-30);

				this.bulletTimer = this.time.addEvent({
					delay: 50,
					callback: () => {
						this.fireBullet();
					},
					callbackScope: this,
					loop: true
				});

				this.bossFight();
			} else {
				return;
			}
		}
		if (this.gameOver) {
			this.bgm.stop();
			window.location.href = './gameover.html';
			return;
		}
		this.updateCyclicBackground();
		if(!this.bossFighting) {
			this.distance -= this.velocity * this.gameSpeed;
		}
		this.totalDistance -= this.velocity * this.gameSpeed;
		this.distanceText.setText('Distance: ' + Math.floor(this.totalDistance/1000));

		while (this.distance - this.lastdistance > 1000) {
			this.updateCount();
			this.lastdistance += 1000;
		}

		if (this.cursors.space.isDown || this.input.activePointer.isDown) {
			this.player.setVelocityY(-this.playerSpeed * this.gameSpeed );
		} else {
			this.player.setVelocityY(this.playerSpeed * this.gameSpeed);
		}
		

		this.bosses.children.iterate((boss) => {
			boss.anims.play('boss1', true);
		});
	}

	updateHealth() {
		this.updateHeart();
		if(this.health <= 0) {
			this.gameOver = true;
			this.physics.pause();
			this.player.setTint(0xff0000);
			sendScore(this.username, this.score, Math.floor(this.totalDistance/1000));
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
		this.bossCounter += 1;

		if (this.bossCounter >= this.gameSpeed * 1000) {
			this.bossCounter = 0;
			this.bossFight();
			return;
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

	updateSpeed() {
		this.meteors.children.iterate((child) => {
			child.setVelocityX(this.velocity * this.gameSpeed);
		});
		this.stars.children.iterate((child) => {
			child.setVelocityX(child.baseSpeed * this.gameSpeed);
		});
		this.bullets.children.iterate((child) => {
			child.setVelocityX(800 - this.gameSpeed * this.velocity);
		});
		this.enemiesBullets.children.iterate((child) => {
			child.setVelocityX(this.gameSpeed * this.velocity - 300);
		});
	}

	createMeteors() {
		const randomY = Math.floor(Math.random() * 700);
		var meteor = this.meteors.create(1400, randomY, 'meteor').setScale(0.08);
		meteor.health = 20;
		meteor.setVelocityX(this.velocity * this.gameSpeed);
		meteor.setBounce(1);
		meteor.checkWorldBounds = true;
		meteor.outOfBoundsKill = true;
		meteor.setDepth(800);
	}

	createStar(baseSpeed = this.velocity) {
		const randomY = Math.floor(Math.random() * 705);
		var star = this.stars.create(1400, randomY, 'star').setScale(0.03);
		star.baseSpeed = baseSpeed;
		star.setVelocityX(baseSpeed * this.gameSpeed);
		star.setBounce(1);
		star.checkWorldBounds = true;
		star.outOfBoundsKill = true;
		star.setDepth(700);
	}

	getHurt() {
		this.player.invincible = true;
		setTimeout(() => {
			this.player.invincible = false;
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
	createHeart(){
		for (var i=0; i < this.health ; i++){
			var heart = this.physics.add.sprite(900 + (i*35),40, 'heart').setScale(0.015);
			this.heartGroup.push(heart);
		}
	}
	updateHeart(){
		for (var i = this.heartGroup.length -1; i>=0;i--){
			if(this.health < i+1){
				this.heartGroup[i].setVisible(false);
			}
			else{
				this.heartGroup[i].setVisible(true);
			}
		}
	}
	fireBullet() {
		var bullet = this.bullets.create(this.player.x, this.player.y, 'bullet').setScale(0.02);
		bullet.setVelocityX(800 - this.gameSpeed * this.velocity);
		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = true;
		bullet.setDepth(500);
	}

	fireEnemyBullet(position) {
		var bullet = this.enemiesBullets.create(position.x, position.y, 'bullet1').setScale(0.03);
		bullet.setVelocityX(this.gameSpeed * this.velocity - 300);
		bullet.checkWorldBounds = true;
		bullet.outOfBoundsKill = true;
		bullet.setDepth(400);
	}

	bossFight() {
		this.bossFighting = true;
		const boss = this.bosses.create(1400, 350, 'boss1');
		boss.body.setSize(1200,1800,true);
		boss.invincible = true;
		boss.setScale(0.15);
		boss.health = 300 * this.gameSpeed;
		boss.setCollideWorldBounds(false);
		boss.setDepth(900);
		boss.timers=[];

		setTimeout(() => {
			boss.setVelocityX(-100);
		}, 4000);

		var angle = 0;
		var radius = 150;
		var step = 10;
		var count = 0;

		setTimeout(() => {
			boss.invincible = false;
			boss.setCollideWorldBounds(true);
			boss.setVelocityX(-300 + Math.random() * 600);
			boss.setVelocityY(-300 + Math.random() * 600);
			boss.totalHealthBar = this.add.rectangle(640, 50, 300, 20, 0x000000);
			boss.totalHealthBar.setOrigin(0.5, 0.5);
			boss.totalHealthBar.setDepth(999);
			boss.helthBar = this.add.rectangle(640, 50, 300, 20, 0xff0000);
			boss.helthBar.setOrigin(0.5, 0.5);
			boss.helthBar.setDepth(1000);
			this.physics.world.enable(boss.helthBar);
			boss.updateHealth = () => {
				boss.helthBar.width = 300 * boss.health / (300 * this.gameSpeed);
			};
			boss.timers.push(this.time.addEvent({
				delay: 100,
				callback: () => {
					count += 1;
					if(count >= 14) {
						count = 0;
					}
					if(count < 7) {
						return;
					}
					var position = {x: boss.x + radius * Math.cos(angle), y: boss.y + radius * Math.sin(angle)};
					this.fireEnemyBullet(position);
					angle += Math.PI/8;
					if (radius >= 200 || radius <= 100) {
						step = -step;
					}
					radius += step;
				},
				callbackScope: this,
				loop: true
			}));
			boss.timers.push(this.time.addEvent({
				delay: 1000,
				callback: () => {
					boss.setVelocityX(-300 + Math.random() * 600);
					boss.setVelocityY(-300 + Math.random() * 600);
				},
				callbackScope: this,
				loop: true
			}));
		},7000);
	}
	
}