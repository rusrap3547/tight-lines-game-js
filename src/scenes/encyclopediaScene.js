import Phaser from "phaser";

export default class encyclopediaScene extends Phaser.Scene {
	constructor() {
		super({ key: "EncyclopediaScene" });
		this.scrollOffset = 0;
		this.maxScroll = 0;
	}

	preload() {
		// Assets already loaded
	}

	create() {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Warm brown background for encyclopedia
		this.add.rectangle(0, 0, width, height, 0x4a3b2a, 1).setOrigin(0, 0);

		// Encyclopedia title
		this.add
			.text(width / 2, 25, "📖 FISH ENCYCLOPEDIA 📖", {
				fontSize: "20px",
				fill: "#FFD700",
				fontFamily: "Arial",
				fontStyle: "bold",
				stroke: "#000000",
				strokeThickness: 3,
			})
			.setOrigin(0.5);

		// Encyclopedia content
		const encyclopediaContent = `═══════════════════════════════════
COMMON FISH (Easy to Catch)
═══════════════════════════════════

GUPPY - 5 points
Small freshwater fish. Perfect for beginners.

NEON TETRA - 7 points
Colorful tropical fish with bright stripes.

SILVERJAW MINNOW - 8 points
Quick little fish found in streams.

GOLDFISH - 10 points
Popular ornamental fish with golden scales.

BLUEGILL - 12 points
Common panfish with distinctive blue coloring.

YELLOW PERCH - 15 points
Striped fish popular with anglers.

═══════════════════════════════════
MEDIUM FISH (Moderate Difficulty)
═══════════════════════════════════

ANGELFISH - 18 points
Elegant freshwater fish with long fins.

CARP - 20 points
Large bottom-feeding fish.

RAINBOW TROUT - 25 points
Beautiful spotted fish found in cold waters.

SALMON - 30 points
Strong migratory fish, highly prized.

BASS - 35 points
Popular sport fish with aggressive behavior.

CATFISH - 40 points
Bottom dweller with distinctive whiskers.

═══════════════════════════════════
RARE FISH (Challenging)
═══════════════════════════════════

TUNA - 60 points ⭐
Fast-swimming ocean predator.

STINGRAY - 70 points ⭐
Flat-bodied fish with venomous tail.

ANGLERFISH - 80 points ⭐
Deep sea fish with bioluminescent lure.

═══════════════════════════════════
LEGENDARY FISH (Very Rare!)
═══════════════════════════════════

AROWANA - 100 points 🎉
Ancient dragon fish, symbol of prosperity.

GREAT WHITE SHARK - 150 points 🎉
Apex predator of the ocean!

═══════════════════════════════════
SPECIAL CATCHES
═══════════════════════════════════

RUSTY CAN - 0 points 🗑️
Someone's trash. Clean up the water!

BOTTLE - 0 points 🍾
Mysterious message bottle (super rare!).

APPLE CORE - 0 points 🗑️
Littered fruit core.

SEAWEED - 0 points 🗑️
Just some tangled seaweed.

GAR - 10 points ⚠️
EVIL FISH! Steals your last caught fish!
Gives points but takes away your previous catch.

═══════════════════════════════════
TIPS
═══════════════════════════════════

• Upgrade your bait to attract rarer fish
• Stronger line gives more time in minigames
• Better rods make hooking easier
• Fish at different times for variety
• Complete 15 casts to end the day
• Sell fish at market for gold (10% of points)`;

		// Create scrollable text area with mask
		const textAreaY = 50;
		const textAreaHeight = height - 100;

		// Create text object
		this.encyclopediaText = this.add
			.text(20, textAreaY, encyclopediaContent, {
				fontSize: "9px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				align: "left",
				lineSpacing: 4,
				resolution: 2,
			})
			.setOrigin(0, 0);

		// Calculate max scroll based on text height
		const textHeight = this.encyclopediaText.height;
		this.maxScroll = Math.max(0, textHeight - textAreaHeight);

		// Create a mask for the text area
		const maskShape = this.make.graphics();
		maskShape.fillStyle(0xffffff);
		maskShape.fillRect(0, textAreaY, width, textAreaHeight);
		const mask = maskShape.createGeometryMask();
		this.encyclopediaText.setMask(mask);

		// Up arrow button
		const upArrowBg = this.add
			.triangle(width - 20, 60, 0, 12, 6, 0, 12, 12, 0xffd700)
			.setInteractive({ useHandCursor: true });

		// Down arrow button
		const downArrowBg = this.add
			.triangle(width - 20, height - 60, 0, 0, 6, 12, 12, 0, 0xffd700)
			.setInteractive({ useHandCursor: true });

		// Arrow button handlers
		upArrowBg.on("pointerover", () => {
			upArrowBg.setFillStyle(0xffe44d);
		});

		upArrowBg.on("pointerout", () => {
			upArrowBg.setFillStyle(0xffd700);
		});

		upArrowBg.on("pointerdown", () => {
			this.scrollOffset = Math.max(0, this.scrollOffset - 15);
			this.encyclopediaText.y = textAreaY - this.scrollOffset;
		});

		downArrowBg.on("pointerover", () => {
			downArrowBg.setFillStyle(0xffe44d);
		});

		downArrowBg.on("pointerout", () => {
			downArrowBg.setFillStyle(0xffd700);
		});

		downArrowBg.on("pointerdown", () => {
			this.scrollOffset = Math.min(this.maxScroll, this.scrollOffset + 15);
			this.encyclopediaText.y = textAreaY - this.scrollOffset;
		});

		// Back button
		const backButtonBg = this.add
			.rectangle(width / 2, height - 25, 100, 30, 0x8b4513, 1)
			.setStrokeStyle(2, 0xffffff)
			.setInteractive({ useHandCursor: true });

		const backButtonText = this.add
			.text(width / 2, height - 25, "BACK", {
				fontSize: "12px",
				fill: "#FFFFFF",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

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
