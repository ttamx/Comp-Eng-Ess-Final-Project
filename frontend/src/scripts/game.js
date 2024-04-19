import { MainScene } from "./scenes/MainScene.js";
import { LeaderBoardScene } from "./scenes/LeaderBoardScene.js";
import { LoginScene } from "./scenes/LoginScene.js";
import { GameScene } from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);

