import Phaser from "phaser";
import { Player, Bobber, Fish, FishTypes } from "../gameObjects.js";

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

	// Colors
	SKY_COLOR: 0x87ceeb,
	WATER_COLOR: 0x4a90e2,
	SAND_COLOR: 0xc2b280,
	DOCK_COLOR: 0x8b4513,
	DOCK_POST_COLOR: 0x654321,
};

// ============================================
// ASSET PLACEHOLDERS - Replace with actual images later
// ============================================
const ASSETS = {
	player: null, // 'assets/player.png'
	bobber: null, // 'assets/bobber.png'
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

export default class boatScene extends Phaser.Scene {
	constructor() {
		super({ key: "BoatScene" });

		// Story mode variables (to be implemented)
		this.storyMode = false;
		this.currentLevel = 1;
		this.questProgress = {};
	}

	create() {
		const { width, height } = this.cameras.main;

		// ============================================
		// SCENE SETUP
		// ============================================

		// Sky at top
		this.add
			.rectangle(
				0,
				0,
				width,
				height * GAME_CONFIG.SKY_HEIGHT_PERCENT,
				GAME_CONFIG.SKY_COLOR
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

		// ============================================
		// INPUT SETUP
		// ============================================

		// Use cursors which includes space
		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceBar = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		);
		this.spaceWasDown = false;

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

		// Score tracking
		this.score = 0;

		// Mini-game state (for future timing game)
		this.miniGameActive = false;
		this.miniGameSuccess = false;

		// ============================================
		// UI ELEMENTS
		// ============================================

		this.scoreText = this.add
			.text(10, 10, "Score: 0", {
				fontSize: "16px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0, 0);

		// Placeholder for mini-game UI (will be created when needed)
		this.miniGameUI = null;
	}

	getWeightedRandomFishType() {
		// Roll for rare fish first (1% chance for Gar)
		const rareRoll = Math.random();
		if (rareRoll < 0.01) {
			return "Gar";
		}

		// Otherwise pick from common fish
		const commonFish = ["Salmon", "Trout", "Bass", "Catfish", "Bluegill"];
		return Phaser.Math.RND.pick(commonFish);
	}

	spawnFish() {
		// Spawn random fish
		const fishCount = Phaser.Math.Between(
			GAME_CONFIG.INITIAL_SPAWN_MIN,
			GAME_CONFIG.INITIAL_SPAWN_MAX
		);

		for (let i = 0; i < fishCount; i++) {
			// Get weighted random fish type
			const randomType = this.getWeightedRandomFishType();
			const fishConfig = FishTypes[randomType];

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
		const randomType = this.getWeightedRandomFishType();
		const fishConfig = FishTypes[randomType];

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
		// Check spacebar with proper state tracking
		if (this.spaceBar.isDown) {
			if (!this.spaceWasDown) {
				this.spaceWasDown = true;
				this.bobber.cast();
			}
		} else {
			this.spaceWasDown = false;
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
					// Add fish points to score
					this.score += fish.points;
					this.scoreText.setText("Score: " + this.score);

					// Special message for rare fish
					if (fish.fishType === "gar") {
						console.log(`🎉 LEGENDARY CATCH! Gar! +${fish.points} points`);
					} else {
						console.log(`Caught ${fish.fishType}! +${fish.points} points`);
					}

					// Remove the fish
					fish.destroy();
					this.fish.splice(i, 1);

					// Mark that a fish has been caught this cast
					this.bobber.hasCaught = true;

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
}
