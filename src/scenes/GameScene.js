import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "GameScene" });
	}

	preload() {
		// Load game assets here
		// this.load.image('player', 'assets/player.png');
	}

	create() {
		// Set background color
		this.cameras.main.setBackgroundColor("#87CEEB");

		// Add welcome text
		this.add
			.text(400, 300, "Tight Lines Game", {
				fontSize: "32px",
				fill: "#fff",
				fontFamily: "Arial",
			})
			.setOrigin(0.5);

		this.add
			.text(400, 350, "Press SPACE to start", {
				fontSize: "16px",
				fill: "#fff",
				fontFamily: "Arial",
			})
			.setOrigin(0.5);

		// Set up keyboard input
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		);
	}

	update() {
		// Game loop logic here
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			console.log("Game started!");
			// You can transition to a new scene here
		}
	}
}
