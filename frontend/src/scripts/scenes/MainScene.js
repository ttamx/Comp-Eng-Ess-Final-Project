export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.add.text(100, 100, 'Main Scene', { fill: '#0f0' });
        // enter game button
        this.enterGameButton = this.add.text(100, 200, 'Enter Game', { fill: '#0f0' });
        this.enterGameButton.setInteractive();
        this.enterGameButton.on('pointerdown', () => {
            if (document.cookie.includes('username=') && document.cookie.split('=')[1] !== '') {
                this.scene.start('GameScene');
            } else {
                this.scene.start('LoginScene');
            }
            this.scene.stop('MainScene');
        });
        // enter leaderboard button
        this.enterLeaderboardButton = this.add.text(100, 250, 'Leaderboard', { fill: '#0f0' });
        this.enterLeaderboardButton.setInteractive();
        this.enterLeaderboardButton.on('pointerdown', () => {
            this.scene.start('LeaderBoardScene');
            this.scene.stop('MainScene');
        });
    }
}