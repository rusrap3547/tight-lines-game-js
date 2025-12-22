import Phaser, { Scale } from "phaser";
import startScene from "./scenes/startScene.js";
import boatScene from "./scenes/boatScene.js";

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
	scene: [startScene, boatScene],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: window.innerWidth * 0.5,
		height: window.innerHeight * 0.5,
	},
};

const game = new Phaser.Game(config);
