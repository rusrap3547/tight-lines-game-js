import Phaser from "phaser";
import startScene from "./scenes/startScene.js";
import tutorialScene from "./scenes/tutorialScene.js";
import encyclopediaScene from "./scenes/encyclopediaScene.js";
import dockScene from "./scenes/dockScene.js";
import marketScene from "./scenes/marketScene.js";
import Minigame from "./scenes/minigame.js";

const GLOBAL_SCALE_MULTIPLIER = 1.5625;

const getScaledGameSize = () => ({
	width: Math.max(320, Math.floor(window.innerWidth / GLOBAL_SCALE_MULTIPLIER)),
	height: Math.max(
		180,
		Math.floor(window.innerHeight / GLOBAL_SCALE_MULTIPLIER),
	),
});

const initialSize = getScaledGameSize();

const config = {
	type: Phaser.AUTO,
	parent: "game_container",
	width: initialSize.width,
	height: initialSize.height,
	pixelArt: true,
	roundPixels: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
			debug: false,
		},
	},
	scene: [
		startScene,
		tutorialScene,
		encyclopediaScene,
		marketScene,
		dockScene,
		Minigame,
	],
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: initialSize.width,
		height: initialSize.height,
		expandParent: true,
	},
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
	const nextSize = getScaledGameSize();
	game.scale.setGameSize(nextSize.width, nextSize.height);
});
