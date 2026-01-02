import Phaser from "phaser";
import { Player, Bobber, Fish, FishTypes, TrashItems } from "../gameObjects.js";

// ============================================
// CONFIGURATION CONSTANTS
// ============================================
const GAME_CONFIG = {
	// Scene dimensions
	SKY_HEIGHT_PERCENT: 0.3,
	WATER_HEIGHT_PERCENT: 0.65,
	SAND_HEIGHT_PERCENT: 0.05,

	// Dock settings
	DOCK_WIDTH: 150,
	DOCK_HEIGHT: 30,

	// Fish spawning
	MIN_FISH_COUNT: 3,
	MAX_FISH_COUNT: 12,
	INITIAL_SPAWN_MIN: 5,
	INITIAL_SPAWN_MAX: 8,
	SPAWN_INTERVAL_MIN: 2000,
	SPAWN_INTERVAL_MAX: 5000,
	DESPAWN_INTERVAL_MIN: 3000,
	DESPAWN_INTERVAL_MAX: 7000,
	TRASH_SPAWN_CHANCE: 0.15, // 15% chance to spawn trash instead of fish

	// Colors
	SKY_COLOR: 0x87ceeb,
	WATER_COLOR: 0x4a90e2,
	SAND_COLOR: 0xc2b280,
	DOCK_COLOR: 0x8b4513,
	DOCK_POST_COLOR: 0x654321,
};

// ============================================
// DAY CYCLE CONFIGURATION
// ============================================
const DAY_CYCLE_CONFIG = {
	CASTS_PER_DAY: 15,
	TIMES_OF_DAY: ["morning", "afternoon", "evening", "night"],
	SKY_COLORS: {
		morning: 0x87ceeb, // Light blue
		afternoon: 0x87cefd, // Bright blue
		evening: 0xff8c69, // Orange/pink
		night: 0x1a1a3e, // Dark blue/purple
	},
};

// ============================================
// ASSET PLACEHOLDERS - Replace with actual images later
// ============================================
const ASSETS = {
	player: "fisherman_idle", // Fisherman sprite
	bobber: "worm", // Using worm sprite as bobber/bait
	dock: null, // 'assets/dock.png'
	background: null, // 'assets/background.png'
	// Fish assets
	fish: {
		salmon: null, // 'assets/fish/salmon.png'
		trout: null, // 'assets/fish/trout.png'
		bass: null, // 'assets/fish/bass.png'
		catfish: null, // 'assets/fish/catfish.png'
		bluegill: null, // 'assets/fish/bluegill.png'
	},
	// UI assets
	ui: {
		scoreBoard: null, // 'assets/ui/scoreboard.png'
		timingBar: null, // 'assets/ui/timing_bar.png'
		timingMarker: null, // 'assets/ui/timing_marker.png'
	},
	// Story mode assets
	story: {
		characterPortrait: null, // 'assets/story/character.png'
		dialogBox: null, // 'assets/story/dialog_box.png'
	},
};

export default class dockScene extends Phaser.Scene {
	constructor() {
		super({ key: "DockScene" });

		// Story mode variables (to be implemented)
		this.storyMode = false;
		this.currentLevel = 1;
		this.questProgress = {};

		// Day cycle tracking
		this.castCount = 0;
		this.currentDay = 1;
		this.timeOfDay = "morning";
	}

	init(data) {
		// Handle return from minigame or market
		if (data && data.score !== undefined) {
			this.score = data.score;
			this.registry.set("currentScore", this.score);
		}
	}

	preload() {
		// Load fisherman spritesheets (48x48 per frame)
		this.load.spritesheet(
			"fisherman_idle",
			"assets/sprites/1 Fisherman/Fisherman_idle.png",
			{ frameWidth: 48, frameHeight: 48 }
		);
		this.load.spritesheet(
			"fisherman_fish",
			"assets/sprites/1 Fisherman/Fisherman_fish.png",
			{ frameWidth: 48, frameHeight: 48 }
		);
		this.load.spritesheet(
			"fisherman_hook",
			"assets/sprites/1 Fisherman/Fisherman_hook.png",
			{ frameWidth: 48, frameHeight: 48 }
		);

		// Load worm sprite for bobber
		this.load.image("worm", "assets/sprites/Misc/Worm.png");

		// Load freshwater fish sprites
		this.load.image("guppy", "assets/sprites/Fresh Water/Guppy.png");
		this.load.image("neon_tetra", "assets/sprites/Fresh Water/Neon Tetra.png");
		this.load.image(
			"silverjaw_minnow",
			"assets/sprites/Fresh Water/Silverjaw Minnow.png"
		);
		this.load.image("goldfish", "assets/sprites/Fresh Water/Goldfish.png");
		this.load.image("bluegill", "assets/sprites/Fresh Water/Bluegill.png");
		this.load.image(
			"yellow_perch",
			"assets/sprites/Fresh Water/Yellow Perch.png"
		);
		this.load.image("angelfish", "assets/sprites/Fresh Water/Angelfish.png");
		this.load.image("carp", "assets/sprites/Fresh Water/Carp.png");
		this.load.image(
			"rainbow_trout",
			"assets/sprites/Fresh Water/Rainbow Trout.png"
		);
		this.load.image("salmon", "assets/sprites/Fresh Water/Salmon.png");
		this.load.image("bass", "assets/sprites/Fresh Water/Bass.png");
		this.load.image("catfish", "assets/sprites/Fresh Water/Catfish.png");
		this.load.image("arowana", "assets/sprites/Fresh Water/Arowana.png");

		// Load saltwater fish sprites
		this.load.image("anchovy", "assets/sprites/Salt Water/Anchovy.png");
		this.load.image("goby", "assets/sprites/Salt Water/Goby.png");
		this.load.image("clownfish", "assets/sprites/Salt Water/Clownfish.png");
		this.load.image("seahorse", "assets/sprites/Salt Water/Seahorse.png");
		this.load.image(
			"blue_angelfish",
			"assets/sprites/Salt Water/Blue Angelfish.png"
		);
		this.load.image("yellow_tang", "assets/sprites/Salt Water/Yellow Tang.png");
		this.load.image("purple_tang", "assets/sprites/Salt Water/Purple Tang.png");
		this.load.image("surgeonfish", "assets/sprites/Salt Water/Surgeonfish.png");
		this.load.image("pufferfish", "assets/sprites/Salt Water/Pufferfish.png");
		this.load.image("flounder", "assets/sprites/Salt Water/Flounder.png");
		this.load.image("ribbon_eel", "assets/sprites/Salt Water/Ribbon Eel.png");
		this.load.image("moray_eel", "assets/sprites/Salt Water/Moray Eel.png");
		this.load.image("tuna", "assets/sprites/Salt Water/Tuna.png");
		this.load.image("blue_groper", "assets/sprites/Salt Water/Blue Groper.png");
		this.load.image(
			"napoleon_wrasse",
			"assets/sprites/Salt Water/Napoleon Wrasse.png"
		);
		this.load.image("stingray", "assets/sprites/Salt Water/Stingray.png");
		this.load.image("anglerfish", "assets/sprites/Salt Water/Anglerfish.png");
		this.load.image(
			"great_white_shark",
			"assets/sprites/Salt Water/Great White Shark.png"
		);

		// Load crustaceans and other marine life
		this.load.image("crab_blue", "assets/sprites/Salt Water/Crab - Blue.png");
		this.load.image(
			"crab_dungeness",
			"assets/sprites/Salt Water/Crab - Dungeness.png"
		);
		this.load.image("crab_king", "assets/sprites/Salt Water/Crab - King.png");
		this.load.image("shrimp", "assets/sprites/Salt Water/Shrimp.png");
		this.load.image("jellyfish", "assets/sprites/Salt Water/Jellyfish.png");
		this.load.image(
			"upside_down_jellyfish",
			"assets/sprites/Salt Water/Upside Down Jellyfish.png"
		);
		this.load.image("starfish", "assets/sprites/Salt Water/Starfish.png");
		this.load.image("mussel", "assets/sprites/Fresh Water/Mussel.png");
		this.load.image("tadpole", "assets/sprites/Fresh Water/Tadpole.png");
		this.load.image("sand_dollar", "assets/sprites/Misc/Sand Dollar.png");
		this.load.image("seashell", "assets/sprites/Misc/Seashell.png");
		this.load.image("pearl", "assets/sprites/Misc/Pearl.png");

		// Load trash items
		this.load.image("rusty_can", "assets/sprites/Misc/Rusty Can.png");
		this.load.image("bottle", "assets/sprites/Misc/Bottle.png");
		this.load.image("apple_core", "assets/sprites/Misc/Apple Core.png");
		this.load.image("seaweed", "assets/sprites/Misc/Seaweed.png");
	}

	create() {
		const { width, height } = this.cameras.main;

		// ============================================
		// CREATE ANIMATIONS
		// ============================================

		// Fisherman idle animation
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("fisherman_idle", {
				start: 0,
				end: -1,
			}),
			frameRate: 8,
			repeat: -1,
		});

		// Fisherman fishing animation
		this.anims.create({
			key: "fish",
			frames: this.anims.generateFrameNumbers("fisherman_fish", {
				start: 0,
				end: -1,
			}),
			frameRate: 8,
			repeat: -1,
		});

		// Fisherman hook animation (catching fish)
		this.anims.create({
			key: "hook",
			frames: this.anims.generateFrameNumbers("fisherman_hook", {
				start: 0,
				end: -1,
			}),
			frameRate: 10,
			repeat: 0,
		});

		// ============================================
		// SCENE SETUP
		// ============================================

		// Sky at top (will change color based on time of day)
		this.skyRectangle = this.add
			.rectangle(
				0,
				0,
				width,
				height * GAME_CONFIG.SKY_HEIGHT_PERCENT,
				DAY_CYCLE_CONFIG.SKY_COLORS.morning
			)
			.setOrigin(0, 0);

		// Water
		this.add
			.rectangle(
				0,
				height * GAME_CONFIG.SKY_HEIGHT_PERCENT,
				width,
				height * GAME_CONFIG.WATER_HEIGHT_PERCENT,
				GAME_CONFIG.WATER_COLOR
			)
			.setOrigin(0, 0);

		// Sand at bottom
		this.add
			.rectangle(
				0,
				height * (1 - GAME_CONFIG.SAND_HEIGHT_PERCENT),
				width,
				height * GAME_CONFIG.SAND_HEIGHT_PERCENT,
				GAME_CONFIG.SAND_COLOR
			)
			.setOrigin(0, 0);

		// Dock on right side, along top edge of water
		const dockWidth = GAME_CONFIG.DOCK_WIDTH;
		const dockHeight = GAME_CONFIG.DOCK_HEIGHT;
		const dockX = width - dockWidth;
		const dockY = height * GAME_CONFIG.SKY_HEIGHT_PERCENT;

		// Dock base
		this.add
			.rectangle(dockX, dockY, dockWidth, dockHeight, GAME_CONFIG.DOCK_COLOR)
			.setOrigin(0, 0);

		// Dock posts
		const postWidth = 20;
		const postSpacing = 50;
		for (let i = 0; i < 3; i++) {
			this.add
				.rectangle(
					dockX + postSpacing * i + 25,
					dockY,
					postWidth,
					dockHeight,
					GAME_CONFIG.DOCK_POST_COLOR
				)
				.setOrigin(0, 0);
		}

		// ============================================
		// GAME OBJECTS
		// ============================================

		// Create player at the end of dock (left side, on top)
		const playerX = dockX + 10;
		const playerY = dockY;
		this.player = new Player(this, playerX, playerY, ASSETS.player);

		// Create bobber at top of water, to the left of player
		const bobberX = playerX - 30;
		const bobberY = dockY + dockHeight;
		const sandY = height * (1 - GAME_CONFIG.SAND_HEIGHT_PERCENT);
		this.bobber = new Bobber(this, bobberX, bobberY, sandY, ASSETS.bobber);

		// Listen for bobber return to play hook animation
		this.events.on("bobberReturned", () => {
			if (this.player && this.player.sprite) {
				this.player.playAnimation("hook");
				// When hook animation completes, return to idle
				this.player.sprite.once("animationcomplete-hook", () => {
					if (this.player && this.player.sprite) {
						this.player.playAnimation("idle");
					}
				});
			}
		});

		// ============================================
		// INPUT SETUP
		// ============================================

		// Mouse click to cast OR interact with minigame
		this.input.on("pointerdown", (pointer) => {
			// Only handle left click
			if (pointer.leftButtonDown()) {
				// If minigame is active, check timing
				if (this.miniGameActive) {
					this.checkMiniGameTiming();
				}
				// Otherwise try to cast
				else if (this.bobber.cast()) {
					// Cast was successful, play fish animation
					this.player.playAnimation("fish");
					// Increment cast counter
					this.castCount++;
					this.updateDayCycle();
				}
			}
		});

		// Store water boundaries
		this.waterLeft = 0;
		this.waterRight = width;
		this.waterTop = height * GAME_CONFIG.SKY_HEIGHT_PERCENT + dockHeight;
		this.waterBottom = height * (1 - GAME_CONFIG.SAND_HEIGHT_PERCENT);

		// Fish management
		this.fish = [];
		this.spawnFish();
		this.nextSpawnTime = 0;
		this.nextDespawnTime = 0;

		// Score tracking - get from registry or start at 0
		if (!this.registry.has("currentScore")) {
			this.registry.set("currentScore", 0);
		}
		this.score = this.registry.get("currentScore");

		// Mini-game state (for future timing game)
		this.miniGameActive = false;
		this.miniGameSuccess = false;
		this.currentFishCaught = null; // Store fish that triggered minigame

		// ============================================
		// UI ELEMENTS
		// ============================================

		this.scoreText = this.add
			.text(10, 10, "Score: " + this.score, {
				fontSize: "16px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0, 0);

		// Day counter UI
		this.dayText = this.add
			.text(10, 30, "Day 1 - Morning", {
				fontSize: "14px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0, 0);

		this.castText = this.add
			.text(10, 50, "Casts: 0/10", {
				fontSize: "12px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 2,
			})
			.setOrigin(0, 0);

		// Market button (top-right corner)
		const marketButton = this.add
			.rectangle(width - 40, 20, 70, 25, 0xffd700)
			.setInteractive({ useHandCursor: true });

		const marketButtonText = this.add
			.text(width - 40, 20, "MARKET", {
				fontSize: "11px",
				fill: "#000",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5, 0.5);

		marketButton.on("pointerdown", () => {
			// Pass current score to market scene
			this.scene.start("MarketScene", { score: this.score });
		});

		marketButton.on("pointerover", () => {
			marketButton.setFillStyle(0xffff00);
		});

		marketButton.on("pointerout", () => {
			marketButton.setFillStyle(0xffd700);
		});

		// Placeholder for mini-game UI (will be created when needed)
		this.miniGameUI = null;
	}

	getWeightedRandomFishType() {
		// Roll for trash first
		const trashRoll = Math.random();
		if (trashRoll < GAME_CONFIG.TRASH_SPAWN_CHANCE) {
			// Spawn trash
			const trashTypes = ["RustyCan", "Bottle", "AppleCore", "Seaweed"];
			return { type: Phaser.Math.RND.pick(trashTypes), isTrash: true };
		}

		// Roll for evil Gar (5% chance)
		const garRoll = Math.random();
		if (garRoll < 0.05) {
			return { type: "Gar", isTrash: false, isHazard: true };
		}

		// Roll for legendary fish (2% chance)
		const legendaryRoll = Math.random();
		if (legendaryRoll < 0.02) {
			const legendaryFish = ["Arowana", "GreatWhiteShark"];
			return { type: Phaser.Math.RND.pick(legendaryFish), isTrash: false };
		}

		// Roll for rare fish (8% chance)
		const rareRoll = Math.random();
		if (rareRoll < 0.08) {
			const rareFish = ["Tuna", "Stingray", "Anglerfish"];
			return { type: Phaser.Math.RND.pick(rareFish), isTrash: false };
		}

		// Otherwise pick from common/medium fish
		const commonFish = [
			"Bluegill",
			"Trout",
			"Perch",
			"Salmon",
			"Bass",
			"Catfish",
			"Guppy",
			"NeonTetra",
			"Goldfish",
			"Angelfish",
			"Carp",
		];
		return { type: Phaser.Math.RND.pick(commonFish), isTrash: false };
	}

	spawnFish() {
		// Spawn random fish
		const fishCount = Phaser.Math.Between(
			GAME_CONFIG.INITIAL_SPAWN_MIN,
			GAME_CONFIG.INITIAL_SPAWN_MAX
		);

		for (let i = 0; i < fishCount; i++) {
			// Get weighted random fish type
			const randomResult = this.getWeightedRandomFishType();
			const fishConfig = randomResult.isTrash
				? TrashItems[randomResult.type]
				: FishTypes[randomResult.type];

			// Random position in water
			const x = Phaser.Math.Between(this.waterLeft + 50, this.waterRight - 50);
			const y = Phaser.Math.Between(this.waterTop + 30, this.waterBottom - 30);

			// Create fish
			const fish = new Fish(this, x, y, fishConfig);

			// Random starting direction
			fish.direction = Phaser.Math.RND.pick([1, -1]);

			this.fish.push(fish);
		}
	}

	spawnSingleFish() {
		// Get weighted random fish type
		const randomResult = this.getWeightedRandomFishType();
		const fishConfig = randomResult.isTrash
			? TrashItems[randomResult.type]
			: FishTypes[randomResult.type];

		// Random position in water
		const x = Phaser.Math.Between(this.waterLeft + 50, this.waterRight - 50);
		const y = Phaser.Math.Between(this.waterTop + 30, this.waterBottom - 30);

		// Create fish
		const fish = new Fish(this, x, y, fishConfig);

		// Random starting direction
		fish.direction = Phaser.Math.RND.pick([1, -1]);

		this.fish.push(fish);
	}

	removeRandomFish() {
		if (this.fish.length > 0) {
			// Find fish near the edges of the screen (within 50px)
			const edgeThreshold = 50;
			const fishNearEdges = this.fish.filter(
				(fish) =>
					fish.x <= this.waterLeft + edgeThreshold ||
					fish.x >= this.waterRight - edgeThreshold
			);

			// If there are fish near edges, remove one of them
			if (fishNearEdges.length > 0) {
				const fish = Phaser.Math.RND.pick(fishNearEdges);
				const index = this.fish.indexOf(fish);

				// Destroy the fish sprite
				fish.destroy();

				// Remove from array
				this.fish.splice(index, 1);
			}
		}
	}

	update(time, delta) {
		// Update minigame marker if active
		if (this.miniGameActive && this.miniGameUI) {
			const marker = this.miniGameUI.marker;
			const barLeft = this.miniGameUI.barX - this.miniGameUI.barWidth / 2;
			const barRight = this.miniGameUI.barX + this.miniGameUI.barWidth / 2;

			// Move marker
			marker.x +=
				this.miniGameUI.markerDirection *
				this.miniGameUI.markerSpeed *
				(delta / 1000);

			// Bounce at edges
			if (marker.x <= barLeft && this.miniGameUI.markerDirection === -1) {
				this.miniGameUI.markerDirection = 1;
				marker.x = barLeft;
			} else if (
				marker.x >= barRight &&
				this.miniGameUI.markerDirection === 1
			) {
				this.miniGameUI.markerDirection = -1;
				marker.x = barRight;
			}
		}

		// Update bobber
		this.bobber.update(delta);

		// Check for fish collision while bobber is moving
		if (
			(this.bobber.isCasting || this.bobber.isReturning) &&
			!this.bobber.hasCaught
		) {
			for (let i = this.fish.length - 1; i >= 0; i--) {
				const fish = this.fish[i];

				// Check if bobber overlaps with fish
				const bobberBounds = this.bobber.getBounds();
				const fishBounds = fish.getBounds();

				if (
					Phaser.Geom.Intersects.RectangleToRectangle(bobberBounds, fishBounds)
				) {
					// Store the fish and trigger minigame
					this.currentFishCaught = fish;

					// Stop the bobber movement
					this.bobber.isCasting = false;
					this.bobber.isReturning = false;

					// Start the hook timing minigame
					this.startMiniGame(fish);

					break; // Only catch one fish per cast
				}
			}
		}

		// Update all fish
		for (let fish of this.fish) {
			fish.update(delta, this.waterLeft, this.waterRight);
		}

		// Initialize timers on first update
		if (this.nextSpawnTime === 0) {
			this.nextSpawnTime = time + Phaser.Math.Between(2000, 5000);
		}
		if (this.nextDespawnTime === 0) {
			this.nextDespawnTime = time + Phaser.Math.Between(3000, 7000);
		}

		// Spawn new fish at random intervals
		if (
			time >= this.nextSpawnTime &&
			this.fish.length < GAME_CONFIG.MAX_FISH_COUNT
		) {
			this.spawnSingleFish();
			this.nextSpawnTime =
				time +
				Phaser.Math.Between(
					GAME_CONFIG.SPAWN_INTERVAL_MIN,
					GAME_CONFIG.SPAWN_INTERVAL_MAX
				);
		}

		// Remove fish at random intervals
		if (
			time >= this.nextDespawnTime &&
			this.fish.length > GAME_CONFIG.MIN_FISH_COUNT
		) {
			this.removeRandomFish();
			this.nextDespawnTime =
				time +
				Phaser.Math.Between(
					GAME_CONFIG.DESPAWN_INTERVAL_MIN,
					GAME_CONFIG.DESPAWN_INTERVAL_MAX
				);
		}
	}

	updateDayCycle() {
		// Update cast counter display
		const castsInDay = this.castCount % DAY_CYCLE_CONFIG.CASTS_PER_DAY;
		this.castText.setText(
			`Casts: ${castsInDay}/${DAY_CYCLE_CONFIG.CASTS_PER_DAY}`
		);

		// Calculate current day
		this.currentDay =
			Math.floor(this.castCount / DAY_CYCLE_CONFIG.CASTS_PER_DAY) + 1;

		// Determine time of day based on casts within the day (15 casts divided evenly)
		// Morning: 0-3 (4 casts), Afternoon: 4-7 (4 casts), Evening: 8-11 (4 casts), Night: 12-14 (3 casts)
		if (castsInDay < 4) {
			this.timeOfDay = "morning";
		} else if (castsInDay < 8) {
			this.timeOfDay = "afternoon";
		} else if (castsInDay < 12) {
			this.timeOfDay = "evening";
		} else {
			this.timeOfDay = "night";
		}

		// Update sky color based on time of day
		const newColor = DAY_CYCLE_CONFIG.SKY_COLORS[this.timeOfDay];
		this.skyRectangle.setFillStyle(newColor);

		// Update day text display
		const timeOfDayCapitalized =
			this.timeOfDay.charAt(0).toUpperCase() + this.timeOfDay.slice(1);
		this.dayText.setText(`Day ${this.currentDay} - ${timeOfDayCapitalized}`);

		// Check if day is complete (reached 15 casts)
		if (castsInDay === 0 && this.castCount > 0) {
			console.log(`🌅 Day ${this.currentDay} begins!`);
			// Go to market scene to start new day
			this.scene.start("MarketScene", { score: this.score });
		}
	}

	// ============================================
	// HOOK TIMING MINIGAME
	// ============================================

	startMiniGame(fish) {
		const { width, height } = this.cameras.main;

		// Set minigame active
		this.miniGameActive = true;
		this.miniGameSuccess = false;

		// Create semi-transparent overlay
		const overlay = this.add
			.rectangle(0, 0, width, height, 0x000000, 0.5)
			.setOrigin(0, 0)
			.setDepth(100);

		// Create popup container in center of screen
		const popupWidth = 200;
		const popupHeight = 80;
		const popupX = width / 2;
		const popupY = height / 2;

		// Popup background
		const popup = this.add
			.rectangle(popupX, popupY, popupWidth, popupHeight, 0x333333)
			.setStrokeStyle(3, 0xffffff)
			.setDepth(101);

		// Title text
		const titleText = this.add
			.text(popupX, popupY - 25, "HOOK IT!", {
				fontSize: "14px",
				fill: "#ffff00",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(102);

		// Timing bar background (container for the marker)
		const barWidth = 160;
		const barHeight = 20;
		const barX = popupX;
		const barY = popupY + 5;

		const barBackground = this.add
			.rectangle(barX, barY, barWidth, barHeight, 0x555555)
			.setStrokeStyle(2, 0xffffff)
			.setDepth(102);

		// Success zone (middle of bar) - green zone
		const successZoneWidth = 40;
		const successZone = this.add
			.rectangle(barX, barY, successZoneWidth, barHeight, 0x00ff00, 0.5)
			.setDepth(103);

		// Moving marker (red circle)
		const markerRadius = 8;
		const marker = this.add
			.circle(barX - barWidth / 2 + markerRadius, barY, markerRadius, 0xff0000)
			.setDepth(104);

		// Calculate marker speed based on fish speed
		// Base speed is 150, but scales with fish speed (multiplier of 1.5 for challenge)
		const baseMarkerSpeed = 150;
		const fishSpeedMultiplier = 1.5;
		const markerSpeed = baseMarkerSpeed + fish.speed * fishSpeedMultiplier;

		// Store minigame UI references
		this.miniGameUI = {
			overlay,
			popup,
			titleText,
			barBackground,
			successZone,
			marker,
			barWidth,
			barX,
			barY,
			successZoneWidth,
			markerDirection: 1, // 1 = moving right, -1 = moving left
			markerSpeed: markerSpeed, // pixels per second (scales with fish speed)
		};
	}

	checkMiniGameTiming() {
		if (!this.miniGameUI || !this.currentFishCaught) return;

		const marker = this.miniGameUI.marker;
		const successZone = this.miniGameUI.successZone;
		const fish = this.currentFishCaught;

		// Get bounds
		const markerX = marker.x;
		const successLeft = successZone.x - this.miniGameUI.successZoneWidth / 2;
		const successRight = successZone.x + this.miniGameUI.successZoneWidth / 2;

		// Check if marker is within success zone
		const success = markerX >= successLeft && markerX <= successRight;

		if (success) {
			// SUCCESS! Hook the fish
			this.miniGameSuccess = true;

			// Show success feedback
			this.miniGameUI.titleText.setText("SUCCESS!");
			this.miniGameUI.titleText.setColor("#00ff00");

			// Prepare fish data for minigame
			const fishData = {
				health: fish.health,
				fishType: fish.fishType,
				points: fish.points,
				size: fish.size,
			};

			// Remove the fish from this scene
			const fishIndex = this.fish.indexOf(fish);
			if (fishIndex >= 0) {
				fish.destroy();
				this.fish.splice(fishIndex, 1);
			}

			// Mark that a fish has been caught this cast
			this.bobber.hasCaught = true;

			// Close minigame popup and transition to rhythm minigame
			this.time.delayedCall(800, () => {
				this.closeMiniGame();

				// Launch rhythm minigame scene
				this.scene.launch("Minigame", {
					fish: fishData,
					score: this.score,
				});

				// Pause dock scene while minigame is active
				this.scene.pause();
			});

			// Early return - don't close minigame immediately
			return;
		} else {
			// FAIL! Fish got away
			console.log("❌ Fish got away! Missed the timing!");

			this.miniGameUI.titleText.setText("MISSED!");
			this.miniGameUI.titleText.setColor("#ff0000");
		}

		// Close minigame after short delay
		this.time.delayedCall(500, () => {
			this.closeMiniGame();

			// Resume bobber return to dock
			this.bobber.isReturning = true;
		});
	}

	closeMiniGame() {
		if (this.miniGameUI) {
			// Destroy all UI elements
			this.miniGameUI.overlay.destroy();
			this.miniGameUI.popup.destroy();
			this.miniGameUI.titleText.destroy();
			this.miniGameUI.barBackground.destroy();
			this.miniGameUI.successZone.destroy();
			this.miniGameUI.marker.destroy();

			this.miniGameUI = null;
		}

		// Reset minigame state
		this.miniGameActive = false;
		this.currentFishCaught = null;
	}
}
