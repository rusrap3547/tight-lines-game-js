import Phaser, { Scale } from "phaser";
import GameScene from "./scenes/GameScene.js";

const config = {
	type: Phaser.AUTO,
	parent: "game_container",
	width: 300,
	height: 180,
	pixelArt: true,
	roundPixels: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	scene: [GameScene],
	Scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
};

const game = new Phaser.Game(config);
