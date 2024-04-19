import { getLeaderboard } from "../api.js";

export class LeaderBoardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderBoardScene' });
    }

    async create() {
        this.add.text(100, 100, 'Leaderboard Scene', { fill: '#0f0' });
        // leaderboard
        const users = await getLeaderboard();
        console.log(users);
        users.forEach((user, index) => {
            this.add.text(100, 150 + 50 * index, `${index + 1}. ${user.username} - ${user.maxScore} - ${user.maxDistance}`, { fill: '#0f0' });
        });
        // back button
        this.backButton = this.add.text(100, 400, 'Back', { fill: '#0f0' });
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', () => {
            this.scene.start('MainScene');
            this.scene.stop('LeaderBoardScene');
        });
    }
}