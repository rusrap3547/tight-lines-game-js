import Phaser from "phaser";
import { Player, Bobber, Fish, FishTypes } from "../gameObjects.js";

export default class boatScene extends Phaser.Scene {
	constructor() {
		super({ key: "BoatScene" });
	}

	create() {
		const { width, height } = this.cameras.main;

		// Sky at top (30% of screen)
		this.add.rectangle(0, 0, width, height * 0.3, 0x87ceeb).setOrigin(0, 0);

		// Water (65% of screen, from 30% to 95%)
		this.add
			.rectangle(0, height * 0.3, width, height * 0.65, 0x4a90e2)
			.setOrigin(0, 0);

		// Sand at bottom (5% of screen)
		this.add
			.rectangle(0, height * 0.95, width, height * 0.05, 0xc2b280)
			.setOrigin(0, 0);

		// Dock on right side, along top edge of water
		const dockWidth = 150;
		const dockHeight = 30;
		const dockX = width - dockWidth;
		// Position at top edge of water (30% mark)
		const dockY = height * 0.3;

		// Dock base (brown)
		this.add
			.rectangle(dockX, dockY, dockWidth, dockHeight, 0x8b4513)
			.setOrigin(0, 0);

		// Dock posts (darker brown)
		const postWidth = 20;
		const postSpacing = 50;
		for (let i = 0; i < 3; i++) {
			this.add
				.rectangle(
					dockX + postSpacing * i + 25,
					dockY,
					postWidth,
					dockHeight,
					0x654321
				)
				.setOrigin(0, 0);
		}

		// Create player at the end of dock (left side, on top)
		const playerX = dockX + 10;
		const playerY = dockY; // Player sits on top of dock
		this.player = new Player(this, playerX, playerY);

		// Create bobber at top of water, to the left of player
		const bobberX = playerX - 30; // 30px to the left
		const bobberY = dockY + dockHeight; // At top edge of water (bottom of dock)
		const sandY = height * 0.95; // Where the sand starts
		this.bobber = new Bobber(this, bobberX, bobberY, sandY);

		// Set up spacebar input
		this.spaceKey = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		);

		// Store water boundaries
		this.waterLeft = 0;
		this.waterRight = width;
		this.waterTop = height * 0.3 + dockHeight; // Below dock
		this.waterBottom = height * 0.95; // Above sand

		// Spawn fish
		this.fish = [];
		this.spawnFish();

		// Set up timers for fish spawning and despawning
		this.nextSpawnTime = 0; // Will be set in first update
		this.nextDespawnTime = 0; // Will be set in first update

		// Initialize score
		this.score = 0;

		// Create score text in top left corner
		this.scoreText = this.add
			.text(10, 10, "Score: 0", {
				fontSize: "16px",
				fill: "#fff",
				fontFamily: "Arial",
				stroke: "#000",
				strokeThickness: 3,
			})
			.setOrigin(0, 0);
	}

	spawnFish() {
		// Get all fish types
		const fishTypeKeys = Object.keys(FishTypes);

		// Spawn 5-8 random fish
		const fishCount = Phaser.Math.Between(5, 8);

		for (let i = 0; i < fishCount; i++) {
			// Random fish type
			const randomType = Phaser.Math.RND.pick(fishTypeKeys);
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
		// Get all fish types
		const fishTypeKeys = Object.keys(FishTypes);

		// Random fish type
		const randomType = Phaser.Math.RND.pick(fishTypeKeys);
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
		// Check for spacebar press
		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.bobber.cast();

			// ============================================
			// TODO: MINI GAME SECTION - Add your mini game logic here
			// This is where the fishing mini game will be triggered
			// ============================================
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
					console.log(`Caught ${fish.fishType}! +${fish.points} points`);

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
		if (time >= this.nextSpawnTime && this.fish.length < 12) {
			this.spawnSingleFish();
			// Set next spawn time (2-5 seconds from now)
			this.nextSpawnTime = time + Phaser.Math.Between(2000, 5000);
		}

		// Remove fish at random intervals
		if (time >= this.nextDespawnTime && this.fish.length > 3) {
			this.removeRandomFish();
			// Set next despawn time (3-7 seconds from now)
			this.nextDespawnTime = time + Phaser.Math.Between(3000, 7000);
		}
	}
}
