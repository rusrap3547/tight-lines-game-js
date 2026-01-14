import Phaser from "phaser";

// ============================================
// CONFIGURATION CONSTANTS
// ============================================
const MARKET_CONFIG = {
	// Scene colors
	SKY_COLOR: 0x87ceeb,
	OCEAN_COLOR: 0x4a90e2,
	DOCK_COLOR: 0x8b4513,

	// Shop layout
	SHOP_WIDTH: 77,
	SHOP_HEIGHT: 64,
	SHOP_SPACING: 19,
	SHOP_Y: 102,

	// Colors for shops
	BAIT_SHOP_COLOR: 0xffb6c1,
	LINE_SHOP_COLOR: 0x90ee90,
	ROD_SHOP_COLOR: 0xffd700,
	BUYER_SHOP_COLOR: 0x87ceeb,

	// Arrow navigation
	ARROW_SIZE: 26,
	ARROW_COLOR: 0x00ff00,
	ARROW_X: 26,
};

// ============================================
// UPGRADE SYSTEM
// ============================================
const UPGRADE_CONFIG = {
	LINE: {
		name: "Line Strength",
		startValue: 7, // seconds
		increment: 2, // seconds per upgrade
		maxLevel: 10,
		baseCost: 50,
		costMultiplier: 1.5,
	},
	BAIT: {
		name: "Bait Quality",
		startValue: 0.01, // 1% rare fish chance
		increment: 0.05, // 5% per upgrade
		maxLevel: 10,
		baseCost: 75,
		costMultiplier: 1.5,
	},
	ROD: {
		name: "Rod Power",
		startValue: 0.5,
		increment: 0.25,
		maxValue: 3.0,
		maxLevel: 10,
		baseCost: 100,
		costMultiplier: 1.5,
	},
};

// ============================================
// MARKET SCENE
// ============================================
export default class marketScene extends Phaser.Scene {
	constructor() {
		super({ key: "MarketScene" });
	}

	init(data) {
		// Receive score from dock scene
		this.fishScore = data.score || 0;
	}

	preload() {
		// Load market stalls sprite sheet (12 stalls, 4 rows x 3 columns, 128x128 each)
		this.load.spritesheet("marketStalls", "assets/images/Market/sprite.png", {
			frameWidth: 128,
			frameHeight: 128,
		});

		// Load market background images
		this.load.image("marketDock", "assets/images/Market/marketDock.png");
		this.load.image("marketOcean", "assets/images/Market/marketOcean.png");
	}

	create() {
		const { width, height } = this.cameras.main;

		// Initialize or retrieve player data from registry
		if (!this.registry.has("playerMoney")) {
			this.registry.set("playerMoney", 0);
		}
		if (!this.registry.has("lineLevel")) {
			this.registry.set("lineLevel", 0);
		}
		if (!this.registry.has("baitLevel")) {
			this.registry.set("baitLevel", 0);
		}
		if (!this.registry.has("rodLevel")) {
			this.registry.set("rodLevel", 0);
		}

		// ============================================
		// BACKGROUND
		// ============================================
		// Sky
		this.add
			.rectangle(0, 0, width, height * 0.3, MARKET_CONFIG.SKY_COLOR)
			.setOrigin(0, 0);

		// Ocean
		const ocean = this.add
			.image(0, height * 0.3, "marketOcean")
			.setOrigin(0, 0)
			.setDisplaySize(width, height * 0.2);

		// Dock/Boardwalk (bottom half)
		const dock = this.add
			.image(0, height * 0.5, "marketDock")
			.setOrigin(0, 0)
			.setDisplaySize(width, height * 0.5);

		// ============================================
		// TITLE
		// ============================================
		this.add
			.text(width / 2, 19, "MARKET", {
				fontSize: "26px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 4,
				fontStyle: "bold",
			})
			.setOrigin(0.5, 0);

		// ============================================
		// MONEY DISPLAY
		// ============================================
		this.moneyText = this.add
			.text(width / 2, 45, `Gold: ${this.registry.get("playerMoney")}`, {
				fontSize: "18px",
				fill: "#ffd700",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0.5, 0);

		// ============================================
		// CREATE SHOPS
		// ============================================
		// Randomly select 4 different stall frames from 0-11
		const availableFrames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		const selectedFrames = [];
		for (let i = 0; i < 4; i++) {
			const randomIndex = Phaser.Math.Between(0, availableFrames.length - 1);
			selectedFrames.push(availableFrames[randomIndex]);
			availableFrames.splice(randomIndex, 1);
		}

		// Position shops on the dock (bottom half)
		const stallSize = 64; // Scale down from 128 to 64
		const shopSpacing = MARKET_CONFIG.SHOP_SPACING;
		const totalShopWidth = stallSize * 4 + shopSpacing * 3;
		const startX = (width - totalShopWidth) / 2;
		const shopY = height * 0.5 + 20; // Position on dock (starts at 50% + some padding)

		// Bait Shop
		this.createShop(
			startX,
			shopY,
			"BAIT\nSHOP",
			MARKET_CONFIG.BAIT_SHOP_COLOR,
			"bait",
			selectedFrames[0]
		);

		// Line Shop
		this.createShop(
			startX + stallSize + shopSpacing,
			shopY,
			"LINE\nSHOP",
			MARKET_CONFIG.LINE_SHOP_COLOR,
			"line",
			selectedFrames[1]
		);

		// Rod Shop
		this.createShop(
			startX + (stallSize + shopSpacing) * 2,
			shopY,
			"ROD\nSHOP",
			MARKET_CONFIG.ROD_SHOP_COLOR,
			"rod",
			selectedFrames[2]
		);

		// Fish Buyer
		this.createShop(
			startX + (stallSize + shopSpacing) * 3,
			shopY,
			"FISH\nBUYER",
			MARKET_CONFIG.BUYER_SHOP_COLOR,
			"buyer",
			selectedFrames[3]
		);

		// ============================================
		// BACK ARROW TO DOCK
		// ============================================
		const arrow = this.add
			.triangle(
				MARKET_CONFIG.ARROW_X,
				height / 2,
				0,
				0,
				MARKET_CONFIG.ARROW_SIZE,
				MARKET_CONFIG.ARROW_SIZE / 2,
				MARKET_CONFIG.ARROW_SIZE,
				-MARKET_CONFIG.ARROW_SIZE / 2,
				MARKET_CONFIG.ARROW_COLOR
			)
			.setInteractive({ useHandCursor: true });

		arrow.on("pointerdown", () => {
			this.scene.start("DockScene");
		});

		// Arrow hover effect
		arrow.on("pointerover", () => {
			arrow.setFillStyle(0x00ff00);
		});
		arrow.on("pointerout", () => {
			arrow.setFillStyle(MARKET_CONFIG.ARROW_COLOR);
		});

		// Arrow label
		this.add
			.text(MARKET_CONFIG.ARROW_X + 25, height / 2, "Back to Dock", {
				fontSize: "10px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0, 0.5);
	}

	createShop(x, y, label, color, shopType, frameIndex) {
		const stallSize = 64;

		// Create a sprite and set the specific frame
		const shop = this.add.sprite(
			x + stallSize / 2,
			y + stallSize / 2,
			"marketStalls"
		);

		// Set the frame name - spritesheet frames are indexed starting from __BASE for frame 0
		shop.setFrame(frameIndex);
		shop.setDisplaySize(stallSize, stallSize); // Use setDisplaySize instead of setScale
		shop.setInteractive({ useHandCursor: true });
		shop.setDepth(0);

		// Shop label
		this.add
			.text(x + stallSize / 2, y + stallSize / 2, label, {
				fontSize: "10px",
				fill: "#fff",
				fontFamily: "Arial",
				fontStyle: "bold",
				align: "center",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0.5, 0.5)
			.setDepth(1);

		// Click handler
		shop.on("pointerdown", () => {
			this.openShop(shopType);
		});

		// Hover effect (tint)
		shop.on("pointerover", () => {
			shop.setTint(0xcccccc);
		});
		shop.on("pointerout", () => {
			shop.clearTint();
		});
	}

	openShop(shopType) {
		const { width, height } = this.cameras.main;

		// Create dark overlay
		const overlay = this.add
			.rectangle(0, 0, width, height, 0x000000, 0.7)
			.setOrigin(0, 0)
			.setInteractive();

		// Create shop window
		const shopWindow = this.add
			.rectangle(width / 2, height / 2, 200, 120, 0xffffff)
			.setOrigin(0.5, 0.5);

		const shopBorder = this.add
			.rectangle(width / 2, height / 2, 200, 120, 0x000000)
			.setOrigin(0.5, 0.5)
			.setStrokeStyle(3, 0x000000);

		let shopTitle = "";
		let currentLevel = 0;
		let upgradeName = "";
		let currentValue = 0;
		let nextValue = 0;
		let cost = 0;
		let maxLevel = 10;
		let valueUnit = "";

		if (shopType === "line") {
			shopTitle = "Line Shop";
			currentLevel = this.registry.get("lineLevel");
			upgradeName = UPGRADE_CONFIG.LINE.name;
			currentValue =
				UPGRADE_CONFIG.LINE.startValue +
				currentLevel * UPGRADE_CONFIG.LINE.increment;
			nextValue = currentValue + UPGRADE_CONFIG.LINE.increment;
			cost = Math.floor(
				UPGRADE_CONFIG.LINE.baseCost *
					Math.pow(UPGRADE_CONFIG.LINE.costMultiplier, currentLevel)
			);
			maxLevel = UPGRADE_CONFIG.LINE.maxLevel;
			valueUnit = "s";
		} else if (shopType === "bait") {
			shopTitle = "Bait Shop";
			currentLevel = this.registry.get("baitLevel");
			upgradeName = UPGRADE_CONFIG.BAIT.name;
			currentValue =
				(UPGRADE_CONFIG.BAIT.startValue +
					currentLevel * UPGRADE_CONFIG.BAIT.increment) *
				100;
			nextValue = currentValue + UPGRADE_CONFIG.BAIT.increment * 100;
			cost = Math.floor(
				UPGRADE_CONFIG.BAIT.baseCost *
					Math.pow(UPGRADE_CONFIG.BAIT.costMultiplier, currentLevel)
			);
			maxLevel = UPGRADE_CONFIG.BAIT.maxLevel;
			valueUnit = "%";
		} else if (shopType === "rod") {
			shopTitle = "Rod Shop";
			currentLevel = this.registry.get("rodLevel");
			upgradeName = UPGRADE_CONFIG.ROD.name;
			currentValue =
				UPGRADE_CONFIG.ROD.startValue +
				currentLevel * UPGRADE_CONFIG.ROD.increment;
			nextValue = currentValue + UPGRADE_CONFIG.ROD.increment;
			cost = Math.floor(
				UPGRADE_CONFIG.ROD.baseCost *
					Math.pow(UPGRADE_CONFIG.ROD.costMultiplier, currentLevel)
			);
			maxLevel = UPGRADE_CONFIG.ROD.maxLevel;
			valueUnit = "x";
		} else if (shopType === "buyer") {
			shopTitle = "Fish Buyer";
			// Fish buyer just shows info, no upgrades
		}

		// Shop title
		const titleText = this.add
			.text(width / 2, height / 2 - 50, shopTitle, {
				fontSize: "16px",
				fill: "#000",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5, 0.5);

		let infoText, buyButton, buyButtonText;

		if (shopType === "buyer") {
			// Fish Buyer - Show current score and sell button
			const currentScore = this.registry.get("currentScore") || 0;
			const moneyValue = Math.floor(currentScore * 0.05);

			infoText = this.add
				.text(
					width / 2,
					height / 2 - 20,
					`Sell fish for gold!\n\nCurrent Fish: ${currentScore} points\nValue: ${moneyValue} gold\n\n1 gold for every 20 points`,
					{
						fontSize: "9px",
						fill: "#000",
						fontFamily: "Arial",
						align: "center",
					}
				)
				.setOrigin(0.5, 0.5);

			// Sell All Fish button
			if (currentScore > 0) {
				buyButton = this.add
					.rectangle(width / 2, height / 2 + 25, 100, 20, 0x00ff00)
					.setOrigin(0.5, 0.5)
					.setInteractive({ useHandCursor: true });

				buyButtonText = this.add
					.text(width / 2, height / 2 + 25, "SELL ALL FISH", {
						fontSize: "10px",
						fill: "#000",
						fontFamily: "Arial",
						fontStyle: "bold",
					})
					.setOrigin(0.5, 0.5);

				buyButton.on("pointerdown", () => {
					// Sell fish for money
					const score = this.registry.get("currentScore") || 0;
					if (score > 0) {
						const moneyEarned = Math.floor(score * 0.05);
						const currentMoney = this.registry.get("playerMoney");
						this.registry.set("playerMoney", currentMoney + moneyEarned);
						this.registry.set("currentScore", 0);
						this.moneyText.setText(`Gold: ${this.registry.get("playerMoney")}`);

						// Close and reopen shop to show updated values
						overlay.destroy();
						shopWindow.destroy();
						shopBorder.destroy();
						titleText.destroy();
						infoText.destroy();
						buyButton.destroy();
						buyButtonText.destroy();
						closeButton.destroy();
						closeButtonText.destroy();
						this.openShop(shopType);
					}
				});
			}
		} else {
			// Other shops - Coming Soon
			infoText = this.add
				.text(
					width / 2,
					height / 2 - 10,
					`Upgrades coming soon!\n\nThis shop will offer\n${
						shopTitle === "Bait Shop"
							? "better bait"
							: shopTitle === "Line Shop"
							? "stronger lines"
							: "upgraded rods"
					}\nto improve your fishing.`,
					{
						fontSize: "10px",
						fill: "#000",
						fontFamily: "Arial",
						align: "center",
					}
				)
				.setOrigin(0.5, 0.5);

			// Coming Soon button
			buyButton = this.add
				.rectangle(width / 2, height / 2 + 25, 100, 20, 0x888888)
				.setOrigin(0.5, 0.5);

			buyButtonText = this.add
				.text(width / 2, height / 2 + 25, "COMING SOON", {
					fontSize: "10px",
					fill: "#fff",
					fontFamily: "Arial",
					fontStyle: "bold",
				})
				.setOrigin(0.5, 0.5);
		}

		// Close button
		const closeButton = this.add
			.rectangle(width / 2, height / 2 + 50, 60, 18, 0xff0000)
			.setOrigin(0.5, 0.5)
			.setInteractive({ useHandCursor: true });

		const closeButtonText = this.add
			.text(width / 2, height / 2 + 50, "CLOSE", {
				fontSize: "10px",
				fill: "#fff",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5, 0.5);

		closeButton.on("pointerdown", () => {
			overlay.destroy();
			shopWindow.destroy();
			shopBorder.destroy();
			titleText.destroy();
			infoText.destroy();
			closeButton.destroy();
			closeButtonText.destroy();
			if (buyButton) buyButton.destroy();
			if (buyButtonText) buyButtonText.destroy();
		});
	}
}
