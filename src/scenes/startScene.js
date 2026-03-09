import Phaser from "phaser";
import {
	ensureAudioSettings,
	getMusicVolume,
	getSfxVolume,
	playSceneMusic,
	preloadAllMusic,
	setMusicVolume,
	setSfxVolume,
} from "../audio/audioManager.js";

export default class startScene extends Phaser.Scene {
	constructor() {
		super({ key: "startScene" });
		this.showingOptions = false;
	}

	preload() {
		// Load title screen assets
		this.load.image("sky", "assets/images/Dock/0sky.png");
		this.load.image("clouds", "assets/images/Dock/1clouds.png");
		this.load.image("shadowTrees", "assets/images/Dock/2shadowTrees.png");
		this.load.image(
			"backgroundTrees",
			"assets/images/Dock/3backgroundTrees.png",
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

		preloadAllMusic(this);
	}

	create() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		ensureAudioSettings(this);
		playSceneMusic(this, "startScene");

		// Create parallax background layers - use image instead of tileSprite to fill screen
		this.sky = this.add
			.image(0, 0, "sky")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.clouds = this.add
			.image(0, 0, "clouds")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.shadowTrees = this.add
			.image(0, 0, "shadowTrees")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.backgroundTrees = this.add
			.image(0, 0, "backgroundTrees")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.middleTrees = this.add
			.image(0, 0, "middleTrees")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.frontTrees = this.add
			.image(0, 0, "frontTrees")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.horizonAndSea = this.add
			.image(0, 0, "horizonAndSea")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.oceanFloor = this.add
			.image(0, 0, "oceanFloor")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);
		this.pondWater = this.add
			.image(0, 0, "pondWater")
			.setOrigin(0, 0)
			.setDisplaySize(width, height);

		// Add semi-transparent overlay for text readability
		const overlay = this.add.rectangle(
			width / 2,
			height / 2,
			width,
			height,
			0x000000,
			0.3,
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

		// Menu buttons configuration
		const buttonCount = 5;
		const buttonWidth = Math.min(220, Math.max(150, Math.floor(width * 0.47)));
		const buttonHeight = Math.min(35, Math.max(24, Math.floor(height * 0.12)));
		const gap = Math.max(8, Math.floor(height * 0.03));
		const totalMenuHeight =
			buttonCount * buttonHeight + (buttonCount - 1) * gap;
		const startY = Math.max(
			height * 0.33,
			(height - totalMenuHeight) / 2 + buttonHeight / 2,
		);
		const buttonSpacing = buttonHeight + gap;

		// Create menu buttons
		this.createMenuButton(
			width / 2,
			startY,
			buttonWidth,
			buttonHeight,
			"NEW GAME",
			() => this.startGame(),
		);
		this.createMenuButton(
			width / 2,
			startY + buttonSpacing,
			buttonWidth,
			buttonHeight,
			"TUTORIAL",
			() => this.showTutorial(),
		);
		this.createMenuButton(
			width / 2,
			startY + buttonSpacing * 2,
			buttonWidth,
			buttonHeight,
			"ENCYCLOPEDIA",
			() => this.showEncyclopedia(),
		);
		this.createMenuButton(
			width / 2,
			startY + buttonSpacing * 3,
			buttonWidth,
			buttonHeight,
			"OPTIONS",
			() => this.showOptions(),
		);
		this.createMenuButton(
			width / 2,
			startY + buttonSpacing * 4,
			buttonWidth,
			buttonHeight,
			"EXIT GAME",
			() => this.exitGame(),
		);

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

		// Credits
		this.add
			.text(width / 2, height - 10, "v1.0.0 | Use menu to navigate", {
				fontSize: "8px",
				fill: "#CCCCCC",
				fontFamily: "Arial",
			})
			.setOrigin(0.5);
	}

	createMenuButton(x, y, width, height, text, callback) {
		// Button background
		const buttonBg = this.add
			.rectangle(x, y, width, height, 0x2c5f2d, 1)
			.setStrokeStyle(3, 0xffffff)
			.setInteractive({ useHandCursor: true });

		// Button text
		const buttonText = this.add
			.text(x, y, text, {
				fontSize: "14px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Hover effects
		buttonBg.on("pointerover", () => {
			buttonBg.setFillStyle(0x3d7f3e);
			this.tweens.add({
				targets: [buttonBg, buttonText],
				scaleX: 1.05,
				scaleY: 1.05,
				duration: 100,
			});
		});

		buttonBg.on("pointerout", () => {
			buttonBg.setFillStyle(0x2c5f2d);
			this.tweens.add({
				targets: [buttonBg, buttonText],
				scaleX: 1.0,
				scaleY: 1.0,
				duration: 100,
			});
		});

		// Click handler
		buttonBg.on("pointerdown", callback);

		return { bg: buttonBg, text: buttonText };
	}

	createVolumeSlider(x, y, initialValue, onChange, depth = 101) {
		const sliderWidth = 160;
		const sliderHeight = 8;
		const minX = x - sliderWidth / 2;

		const trackBg = this.add
			.rectangle(x, y, sliderWidth, sliderHeight, 0x333333, 1)
			.setDepth(depth)
			.setInteractive({ useHandCursor: true });

		const trackFill = this.add
			.rectangle(minX, y, 1, sliderHeight, 0xffd700, 1)
			.setOrigin(0, 0.5)
			.setDepth(depth + 1);

		const knob = this.add
			.circle(minX + sliderWidth * initialValue, y, 9, 0xffffff, 1)
			.setStrokeStyle(2, 0x000000)
			.setDepth(depth + 2)
			.setInteractive({ draggable: true, useHandCursor: true });

		const updateSlider = (value) => {
			const clamped = Phaser.Math.Clamp(value, 0, 1);
			trackFill.width = Math.max(1, sliderWidth * clamped);
			knob.x = minX + sliderWidth * clamped;
			onChange(clamped);
		};

		const getValueFromX = (pointerX) => (pointerX - minX) / sliderWidth;

		this.input.setDraggable(knob);

		knob.on("drag", (_, dragX) => {
			updateSlider(getValueFromX(dragX));
		});

		trackBg.on("pointerdown", (pointer) => {
			updateSlider(getValueFromX(pointer.x));
		});

		updateSlider(initialValue);

		return [trackBg, trackFill, knob];
	}

	showOptions() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		const currentMusicVolume = getMusicVolume(this);
		const currentSfxVolume = getSfxVolume(this);

		this.showingOptions = true;

		// Dark green overlay
		const optionsOverlay = this.add
			.rectangle(0, 0, width, height, 0x0a4d0a, 1)
			.setOrigin(0, 0)
			.setDepth(100);

		// Options title
		const optionsTitle = this.add
			.text(width / 2, 40, "OPTIONS", {
				fontSize: "24px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(101);

		const musicLabel = this.add
			.text(
				width / 2,
				height / 2 - 65,
				`Music Volume: ${Math.round(currentMusicVolume * 100)}%`,
				{
					fontSize: "14px",
					fill: "#FFFFFF",
					fontFamily: "Arial",
					fontStyle: "bold",
				},
			)
			.setOrigin(0.5)
			.setDepth(101);

		const musicSliderObjects = this.createVolumeSlider(
			width / 2,
			height / 2 - 40,
			currentMusicVolume,
			(value) => {
				setMusicVolume(this, value);
				musicLabel.setText(`Music Volume: ${Math.round(value * 100)}%`);
			},
		);

		const sfxLabel = this.add
			.text(
				width / 2,
				height / 2 + 5,
				`SFX Volume: ${Math.round(currentSfxVolume * 100)}%`,
				{
					fontSize: "14px",
					fill: "#FFFFFF",
					fontFamily: "Arial",
					fontStyle: "bold",
				},
			)
			.setOrigin(0.5)
			.setDepth(101);

		const sfxSliderObjects = this.createVolumeSlider(
			width / 2,
			height / 2 + 30,
			currentSfxVolume,
			(value) => {
				setSfxVolume(this, value);
				sfxLabel.setText(`SFX Volume: ${Math.round(value * 100)}%`);
			},
		);

		const controlsText = this.add
			.text(
				width / 2,
				height / 2 + 72,
				"Controls\nMouse: Cast & Navigate\nArrow Keys/WASD: Minigame",
				{
					fontSize: "11px",
					fill: "#FFFFFF",
					fontFamily: "Arial",
					align: "center",
					lineSpacing: 6,
				},
			)
			.setOrigin(0.5)
			.setDepth(101);

		// Back button
		const backButtonBg = this.add
			.rectangle(width / 2, height - 50, 120, 35, 0x2c5f2d, 1)
			.setStrokeStyle(3, 0xffffff)
			.setInteractive({ useHandCursor: true })
			.setDepth(101);

		const backButtonText = this.add
			.text(width / 2, height - 50, "BACK", {
				fontSize: "14px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(102);

		// Back button handlers
		backButtonBg.on("pointerover", () => {
			backButtonBg.setFillStyle(0x3d7f3e);
		});

		backButtonBg.on("pointerout", () => {
			backButtonBg.setFillStyle(0x2c5f2d);
		});

		backButtonBg.on("pointerdown", () => {
			optionsOverlay.destroy();
			optionsTitle.destroy();
			musicLabel.destroy();
			sfxLabel.destroy();
			controlsText.destroy();
			musicSliderObjects.forEach((obj) => obj.destroy());
			sfxSliderObjects.forEach((obj) => obj.destroy());
			backButtonBg.destroy();
			backButtonText.destroy();
			this.showingOptions = false;
		});
	}

	showTutorial() {
		// Launch the tutorial scene
		this.cameras.main.fadeOut(300, 0, 0, 0);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start("TutorialScene");
		});
	}

	showEncyclopedia() {
		// Launch the encyclopedia scene
		this.cameras.main.fadeOut(300, 0, 0, 0);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start("EncyclopediaScene");
		});
	}

	exitGame() {
		// Close the game window (only works in certain environments)
		if (window.close) {
			window.close();
		} else {
			console.log(
				"Exit game - window.close() not available in this environment",
			);
		}
	}

	startGame() {
		// Fade out effect
		this.cameras.main.fadeOut(500, 0, 0, 0);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start("DockScene");
		});
	}

	update() {
		// Fish swimming animations continue
		// (No parallax scrolling since we're using static images now)
	}
}
