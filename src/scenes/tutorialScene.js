import Phaser from "phaser";

export default class tutorialScene extends Phaser.Scene {
	constructor() {
		super({ key: "TutorialScene" });
		this.scrollOffset = 0;
		this.maxScroll = 0;
	}

	preload() {
		// Tutorial assets are already loaded from startScene
	}

	create() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Dark blue background for tutorial
		this.add.rectangle(0, 0, width, height, 0x1a2332, 1).setOrigin(0, 0);

		// Tutorial title
		this.add
			.text(width / 2, 30, "🎣 HOW TO PLAY 🎣", {
				fontSize: "24px",
				fill: "#FFD700",
				fontFamily: "Arial",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 4,
			})
			.setOrigin(0.5);

		// Tutorial content
		const tutorialContent = `OBJECTIVE
Catch as many fish as possible each day!
Earn points and convert them to gold at the market.

CASTING
Click anywhere to cast your fishing line.
The bobber will fly out into the water.

HOOKING
When you hit a fish, a timing minigame appears.
Click when the red marker is in the GREEN ZONE.
Success = Start the rhythm minigame!
Miss = Fish escapes!

RHYTHM MINIGAME
Falling arrows will descend from the top.
Press Arrow Keys or WASD when arrows
reach the TARGET ZONE at the bottom.
Match ALL arrows before time runs out!

DAY CYCLE
You get 15 casts per day.
After 15 casts, see your daily stats.
Then visit the MARKET to sell fish and buy upgrades!

MARKET
Sell your fish for GOLD (10% of points).
Buy upgrades: Better Bait, Stronger Line, Better Rod.

FISH TYPES
🐟 Common Fish: Easy to catch, low points
⭐ Rare Fish: Harder to catch, more points
🎉 Legendary Fish: Very rare, huge points!
🗑️ Trash: Worth 0 points
⚠️ Evil Gar: Steals your last caught fish!`;

		// Create scrollable text area with mask
		const textAreaY = 60;
		const textAreaHeight = height - 120;

		// Create text object
		this.tutorialText = this.add
			.text(width / 2, textAreaY, tutorialContent, {
				fontSize: "11px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				align: "center",
				lineSpacing: 5,
				resolution: 2,
			})
			.setOrigin(0.5, 0);

		// Calculate max scroll based on text height
		const textHeight = this.tutorialText.height;
		this.maxScroll = Math.max(0, textHeight - textAreaHeight);

		// Create a mask for the text area
		const maskShape = this.make.graphics();
		maskShape.fillStyle(0xffffff);
		maskShape.fillRect(0, textAreaY, width, textAreaHeight);
		const mask = maskShape.createGeometryMask();
		this.tutorialText.setMask(mask);

		// Up arrow button
		const upArrowBg = this.add
			.triangle(width - 30, 70, 0, 15, 7.5, 0, 15, 15, 0x3d7f3e)
			.setInteractive({ useHandCursor: true });

		// Down arrow button
		const downArrowBg = this.add
			.triangle(width - 30, height - 90, 0, 0, 7.5, 15, 15, 0, 0x3d7f3e)
			.setInteractive({ useHandCursor: true });

		// Arrow button handlers
		upArrowBg.on("pointerover", () => {
			upArrowBg.setFillStyle(0x4d9f4e);
		});

		upArrowBg.on("pointerout", () => {
			upArrowBg.setFillStyle(0x3d7f3e);
		});

		upArrowBg.on("pointerdown", () => {
			this.scrollOffset = Math.max(0, this.scrollOffset - 20);
			this.tutorialText.y = textAreaY - this.scrollOffset;
		});

		downArrowBg.on("pointerover", () => {
			downArrowBg.setFillStyle(0x4d9f4e);
		});

		downArrowBg.on("pointerout", () => {
			downArrowBg.setFillStyle(0x3d7f3e);
		});

		downArrowBg.on("pointerdown", () => {
			this.scrollOffset = Math.min(this.maxScroll, this.scrollOffset + 20);
			this.tutorialText.y = textAreaY - this.scrollOffset;
		});

		// Start Game button
		const startButtonBg = this.add
			.rectangle(width / 2 - 80, height - 40, 120, 35, 0x2c5f2d, 1)
			.setStrokeStyle(3, 0xffffff)
			.setInteractive({ useHandCursor: true });

		const startButtonText = this.add
			.text(width / 2 - 80, height - 40, "START GAME", {
				fontSize: "12px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Back to Menu button
		const backButtonBg = this.add
			.rectangle(width / 2 + 80, height - 40, 120, 35, 0x8b4513, 1)
			.setStrokeStyle(3, 0xffffff)
			.setInteractive({ useHandCursor: true });

		const backButtonText = this.add
			.text(width / 2 + 80, height - 40, "BACK", {
				fontSize: "12px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Start button handlers
		startButtonBg.on("pointerover", () => {
			startButtonBg.setFillStyle(0x3d7f3e);
			this.tweens.add({
				targets: [startButtonBg, startButtonText],
				scaleX: 1.05,
				scaleY: 1.05,
				duration: 100,
			});
		});

		startButtonBg.on("pointerout", () => {
			startButtonBg.setFillStyle(0x2c5f2d);
			this.tweens.add({
				targets: [startButtonBg, startButtonText],
				scaleX: 1.0,
				scaleY: 1.0,
				duration: 100,
			});
		});

		startButtonBg.on("pointerdown", () => {
			this.cameras.main.fadeOut(300, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("DockScene");
			});
		});

		// Back button handlers
		backButtonBg.on("pointerover", () => {
			backButtonBg.setFillStyle(0xa0522d);
			this.tweens.add({
				targets: [backButtonBg, backButtonText],
				scaleX: 1.05,
				scaleY: 1.05,
				duration: 100,
			});
		});

		backButtonBg.on("pointerout", () => {
			backButtonBg.setFillStyle(0x8b4513);
			this.tweens.add({
				targets: [backButtonBg, backButtonText],
				scaleX: 1.0,
				scaleY: 1.0,
				duration: 100,
			});
		});

		backButtonBg.on("pointerdown", () => {
			this.cameras.main.fadeOut(300, 0, 0, 0);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start("startScene");
			});
		});
	}
}
