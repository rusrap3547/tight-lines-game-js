import Phaser from "phaser";

export default class startScene extends Phaser.Scene {
	constructor() {
		super({ key: "startScene" });
	}

	preload() {
		// Load title screen assets
		this.load.image("sky", "assets/images/Dock/0sky.png");
		this.load.image("clouds", "assets/images/Dock/1clouds.png");
		this.load.image("shadowTrees", "assets/images/Dock/2shadowTrees.png");
		this.load.image(
			"backgroundTrees",
			"assets/images/Dock/3backgroundTrees.png"
		);
		this.load.image("middleTrees", "assets/images/Dock/4middleTrees.png");
		this.load.image("frontTrees", "assets/images/Dock/5frontTrees.png");
		this.load.image("horizonAndSea", "assets/images/Dock/6horizonAndSea.png");
		this.load.image("oceanFloor", "assets/images/Dock/7oceanFloor.png");
		this.load.image("pondWater", "assets/images/Dock/8pondWater.png");
		this.load.image("boat", "assets/images/Dock/Boat.png");

		// Load fish sprites for title screen animation
		this.load.image("bass", "assets/sprites/Fresh Water/Bass.png");
		this.load.image("goldfish", "assets/sprites/Fresh Water/Goldfish.png");
		this.load.image("salmon", "assets/sprites/Fresh Water/Salmon.png");
	}

	create() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Create parallax background layers
		this.sky = this.add.tileSprite(0, 0, width, height, "sky").setOrigin(0, 0);
		this.clouds = this.add
			.tileSprite(0, 0, width, height, "clouds")
			.setOrigin(0, 0);
		this.shadowTrees = this.add
			.tileSprite(0, 0, width, height, "shadowTrees")
			.setOrigin(0, 0);
		this.backgroundTrees = this.add
			.tileSprite(0, 0, width, height, "backgroundTrees")
			.setOrigin(0, 0);
		this.middleTrees = this.add
			.tileSprite(0, 0, width, height, "middleTrees")
			.setOrigin(0, 0);
		this.frontTrees = this.add
			.tileSprite(0, 0, width, height, "frontTrees")
			.setOrigin(0, 0);
		this.horizonAndSea = this.add
			.tileSprite(0, 0, width, height, "horizonAndSea")
			.setOrigin(0, 0);
		this.oceanFloor = this.add
			.tileSprite(0, 0, width, height, "oceanFloor")
			.setOrigin(0, 0);
		this.pondWater = this.add
			.tileSprite(0, 0, width, height, "pondWater")
			.setOrigin(0, 0);

		// Add semi-transparent overlay for text readability
		const overlay = this.add.rectangle(
			width / 2,
			height / 2,
			width,
			height,
			0x000000,
			0.3
		);

		// Title text with shadow effect
		const titleShadow = this.add
			.text(width / 2 + 2, 50 + 2, "🎣 TIGHT LINES 🎣", {
				fontSize: "32px",
				fill: "#000000",
				fontFamily: "Impact, Arial Black, sans-serif",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		const title = this.add
			.text(width / 2, 50, "🎣 TIGHT LINES 🎣", {
				fontSize: "32px",
				fill: "#FFD700",
				fontFamily: "Impact, Arial Black, sans-serif",
				fontStyle: "bold",
				stroke: "#FF6B00",
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		// Subtitle
		this.add
			.text(width / 2, 85, "A Fishing Adventure", {
				fontSize: "12px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "italic",
			})
			.setOrigin(0.5);

		// Animated fish decorations
		this.fish1 = this.add.sprite(50, 120, "bass").setScale(0.5).setAlpha(0.7);
		this.fish2 = this.add
			.sprite(width - 50, 140, "goldfish")
			.setScale(0.5)
			.setAlpha(0.7)
			.setFlipX(true);
		this.fish3 = this.add
			.sprite(width / 2, 110, "salmon")
			.setScale(0.4)
			.setAlpha(0.6);

		// Start button background
		const buttonBg = this.add
			.rectangle(width / 2, height - 50, 180, 35, 0x2c5f2d, 1)
			.setStrokeStyle(3, 0xffffff);

		// Start button text
		const startText = this.add
			.text(width / 2, height - 50, "CLICK TO START", {
				fontSize: "14px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Make button interactive
		buttonBg.setInteractive({ useHandCursor: true });
		startText.setInteractive({ useHandCursor: true });

		// Pulsing animation for start button
		this.tweens.add({
			targets: [buttonBg, startText],
			scaleX: 1.05,
			scaleY: 1.05,
			duration: 800,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Title bounce animation
		this.tweens.add({
			targets: title,
			y: 55,
			duration: 1500,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Fish swimming animations
		this.tweens.add({
			targets: this.fish1,
			x: width - 50,
			duration: 8000,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		this.tweens.add({
			targets: this.fish2,
			x: 50,
			duration: 10000,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		this.tweens.add({
			targets: this.fish3,
			y: 140,
			duration: 3000,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Click handlers
		buttonBg.on("pointerdown", () => this.startGame());
		startText.on("pointerdown", () => this.startGame());

		// Also allow clicking anywhere or pressing space
		this.input.on("pointerdown", (pointer) => {
			if (!buttonBg.getBounds().contains(pointer.x, pointer.y)) {
				this.startGame();
			}
		});

		this.spaceKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		);

		// Credits
		this.add
			.text(width / 2, height - 10, "v1.0.0 | Press SPACE or CLICK to start", {
				fontSize: "8px",
				fill: "#CCCCCC",
				fontFamily: "Arial",
			})
			.setOrigin(0.5);
	}

	startGame() {
		// Fade out effect
		this.cameras.main.fadeOut(500, 0, 0, 0);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start("DockScene");
		});
	}

	update() {
		// Parallax scrolling effect
		this.clouds.tilePositionX += 0.05;
		this.pondWater.tilePositionX += 0.1;

		// Space key to start
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.startGame();
		}
	}
}
