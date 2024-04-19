export class LoginScene extends Phaser.Scene {
    constructor() {
    super({ key: 'LoginScene' });
    }

    create() {
        this.add.text(100, 100, 'Login Scene', { fill: '#0f0' });
        // login form
        
        // back button
        this.backButton = this.add.text(100, 300, 'Back', { fill: '#0f0' });
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('MainScene');
            this.scene.stop('LoginScene');
        });
    }

    update() {
        if (document.cookie.includes('username=') && document.cookie.split('=')[1] !== '') {
            this.scene.start('GameScene');
            this.scene.stop('LoginScene');
        }
    }
}