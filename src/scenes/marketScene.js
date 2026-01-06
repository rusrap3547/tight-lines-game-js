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
		this.add
			.rectangle(
				0,
				height * 0.3,
				width,
				height * 0.2,
				MARKET_CONFIG.OCEAN_COLOR
			)
			.setOrigin(0, 0);

		// Dock/Boardwalk (bottom half)
		this.add
			.rectangle(0, height * 0.5, width, height * 0.5, MARKET_CONFIG.DOCK_COLOR)
			.setOrigin(0, 0);

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
		const shopY = MARKET_CONFIG.SHOP_Y;
		const shopWidth = MARKET_CONFIG.SHOP_WIDTH;
		const shopSpacing = MARKET_CONFIG.SHOP_SPACING;
		const totalShopWidth = shopWidth * 4 + shopSpacing * 3;
		const startX = (width - totalShopWidth) / 2;

		// Bait Shop
		this.createShop(
			startX,
			shopY,
			"BAIT\nSHOP",
			MARKET_CONFIG.BAIT_SHOP_COLOR,
			"bait"
		);

		// Line Shop
		this.createShop(
			startX + shopWidth + shopSpacing,
			shopY,
			"LINE\nSHOP",
			MARKET_CONFIG.LINE_SHOP_COLOR,
			"line"
		);

		// Rod Shop
		this.createShop(
			startX + (shopWidth + shopSpacing) * 2,
			shopY,
			"ROD\nSHOP",
			MARKET_CONFIG.ROD_SHOP_COLOR,
			"rod"
		);

		// Fish Buyer
		this.createShop(
			startX + (shopWidth + shopSpacing) * 3,
			shopY,
			"FISH\nBUYER",
			MARKET_CONFIG.BUYER_SHOP_COLOR,
			"buyer"
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

	createShop(x, y, label, color, shopType) {
		const shopWidth = MARKET_CONFIG.SHOP_WIDTH;
		const shopHeight = MARKET_CONFIG.SHOP_HEIGHT;

		// Shop building
		const shop = this.add
			.rectangle(x, y, shopWidth, shopHeight, color)
			.setOrigin(0, 0)
			.setInteractive({ useHandCursor: true });

		// Shop label
		this.add
			.text(x + shopWidth / 2, y + shopHeight / 2, label, {
				fontSize: "10px",
				fill: "#000",
				fontFamily: "Arial",
				fontStyle: "bold",
				align: "center",
			})
			.setOrigin(0.5, 0.5);

		// Click handler
		shop.on("pointerdown", () => {
			this.openShop(shopType);
		});

		// Hover effect
		shop.on("pointerover", () => {
			shop.setFillStyle(Phaser.Display.Color.GetColor(255, 255, 255));
		});
		shop.on("pointerout", () => {
			shop.setFillStyle(color);
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
