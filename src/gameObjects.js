import Phaser from "phaser";

// ============================================
// GAME OBJECT CONFIGURATION
// ============================================
const PLAYER_CONFIG = {
	WIDTH: 20,
	HEIGHT: 40,
	COLOR: 0xff6b6b,
	// Add animation frames, sprite sheet details here later
};

const BOBBER_CONFIG = {
	RADIUS: 8,
	COLOR: 0xff0000,
	CAST_SPEED: 200, // pixels per second
	LINE_COLOR: 0x333333,
	LINE_WIDTH: 2,
};

const FISH_CONFIG = {
	BASE_WIDTH: 30,
	BASE_HEIGHT: 15,
};

// ============================================
// PLAYER CLASS
// ============================================
export class Player {
	constructor(scene, x, y, assetKey = null) {
		this.scene = scene;

		// Use sprite if asset provided, otherwise use placeholder rectangle
		if (assetKey && scene.textures.exists(assetKey)) {
			this.sprite = scene.add.sprite(x, y, assetKey).setOrigin(0.5, 1);
		} else {
			// Placeholder - simple rectangle
			this.sprite = scene.add
				.rectangle(
					x,
					y,
					PLAYER_CONFIG.WIDTH,
					PLAYER_CONFIG.HEIGHT,
					PLAYER_CONFIG.COLOR
				)
				.setOrigin(0.5, 1);
		}
	}

	getX() {
		return this.sprite.x;
	}

	getY() {
		return this.sprite.y;
	}
}

// ============================================
// BOBBER CLASS
// ============================================
export class Bobber {
	constructor(scene, x, y, sandY, assetKey = null) {
		this.scene = scene;
		this.startY = y;
		this.sandY = sandY;
		this.isCasting = false;
		this.isReturning = false;
		this.hasCaught = false;
		this.castSpeed = BOBBER_CONFIG.CAST_SPEED;

		// Use sprite if asset provided, otherwise use placeholder circle
		if (assetKey && scene.textures.exists(assetKey)) {
			this.sprite = scene.add.sprite(x, y, assetKey);
		} else {
			// Placeholder - simple circle
			this.sprite = scene.add.circle(
				x,
				y,
				BOBBER_CONFIG.RADIUS,
				BOBBER_CONFIG.COLOR
			);
		}

		// Create fishing line
		this.line = scene.add
			.line(0, 0, x, y - 20, x, y, BOBBER_CONFIG.LINE_COLOR)
			.setOrigin(0, 0)
			.setLineWidth(BOBBER_CONFIG.LINE_WIDTH);
	}

	cast() {
		console.log(
			"cast() called - isCasting:",
			this.isCasting,
			"isReturning:",
			this.isReturning
		);
		if (!this.isCasting && !this.isReturning) {
			console.log("CASTING BOBBER");
			this.isCasting = true;
			this.hasCaught = false; // Reset catch flag for new cast
			return true; // Cast was successful
		} else {
			console.log("BLOCKED - bobber busy");
			return false; // Cast was blocked
		}
	}

	update(delta) {
		if (this.isCasting) {
			// Move bobber down
			this.sprite.y += (this.castSpeed * delta) / 1000;

			// Check if reached sand
			if (this.sprite.y >= this.sandY) {
				this.sprite.y = this.sandY;
				this.isCasting = false;
				this.isReturning = true;
			}
		} else if (this.isReturning) {
			// Move bobber up
			this.sprite.y -= (this.castSpeed * delta) / 1000;

			// Check if back to start
			if (this.sprite.y <= this.startY) {
				this.sprite.y = this.startY;
				this.isReturning = false;
				this.hasCaught = false; // Reset catch flag when back at start
			}
		}

		// Update fishing line
		this.line.setTo(
			this.sprite.x,
			this.sprite.y - 20,
			this.sprite.x,
			this.sprite.y
		);
	}

	getBounds() {
		// Return bounds for the bobber circle
		const radius = BOBBER_CONFIG.RADIUS;
		return new Phaser.Geom.Rectangle(
			this.sprite.x - radius,
			this.sprite.y - radius,
			radius * 2,
			radius * 2
		);
	}
}

// ============================================
// FISH CLASS
// ============================================
export class Fish {
	constructor(scene, x, y, config = {}) {
		this.scene = scene;

		// Fish stats from config
		this.speed = config.speed || 100;
		this.health = config.health || 3;
		this.points = config.points || 10;
		this.size = config.size || 1;
		this.fishType = config.fishType || "generic";
		this.color = config.color || 0x00ff00;
		this.assetKey = config.assetKey || null;

		// Use sprite if asset provided, otherwise use placeholder rectangle
		const fishWidth = FISH_CONFIG.BASE_WIDTH * this.size;
		const fishHeight = FISH_CONFIG.BASE_HEIGHT * this.size;

		if (this.assetKey && scene.textures.exists(this.assetKey)) {
			this.sprite = scene.add.sprite(x, y, this.assetKey);
			this.sprite.setScale(this.size);
		} else {
			// Placeholder - simple rectangle
			this.sprite = scene.add.rectangle(
				x,
				y,
				fishWidth,
				fishHeight,
				this.color
			);
		}

		// Movement properties
		this.direction = 1; // 1 for right, -1 for left
		this.x = x;
		this.y = y;
	}

	// Update fish position
	update(delta, waterLeft, waterRight) {
		// Move fish
		this.x += (this.speed * this.direction * delta) / 1000;

		// Turn around at water boundaries
		if (this.x <= waterLeft || this.x >= waterRight) {
			this.direction *= -1;
		}

		// Update sprite position
		this.sprite.x = this.x;
		this.sprite.y = this.y;
	}

	destroy() {
		this.sprite.destroy();
	}

	getBounds() {
		// Return bounds for the fish rectangle
		const fishWidth = FISH_CONFIG.BASE_WIDTH * this.size;
		const fishHeight = FISH_CONFIG.BASE_HEIGHT * this.size;
		return new Phaser.Geom.Rectangle(
			this.x - fishWidth / 2,
			this.y - fishHeight / 2,
			fishWidth,
			fishHeight
		);
	}
}

// ============================================
// FISH TYPE DEFINITIONS
// ============================================
export const FishTypes = {
	// Common fish
	Bluegill: {
		color: 0x03a9f4,
		speed: 100,
		health: 2,
		points: 5,
		size: 0.8,
		fishType: "bluegill",
		isTrash: false,
	},
	Trout: {
		color: 0x8bc34a,
		speed: 90,
		health: 3,
		points: 12,
		size: 1.0,
		fishType: "trout",
		isTrash: false,
	},
	Perch: {
		color: 0xffd700,
		speed: 95,
		health: 3,
		points: 10,
		size: 0.9,
		fishType: "perch",
		isTrash: false,
	},
	// Medium fish
	Salmon: {
		color: 0xff6b9d,
		speed: 120,
		health: 4,
		points: 18,
		size: 1.2,
		fishType: "salmon",
		isTrash: false,
	},
	Bass: {
		color: 0x795548,
		speed: 80,
		health: 5,
		points: 22,
		size: 1.3,
		fishType: "bass",
		isTrash: false,
	},
	Pike: {
		color: 0x4caf50,
		speed: 130,
		health: 5,
		points: 25,
		size: 1.4,
		fishType: "pike",
		isTrash: false,
	},
	// Large/Valuable fish
	Catfish: {
		color: 0x607d8b,
		speed: 60,
		health: 6,
		points: 30,
		size: 1.5,
		fishType: "catfish",
		isTrash: false,
	},
	Walleye: {
		color: 0xffeb3b,
		speed: 110,
		health: 5,
		points: 28,
		size: 1.3,
		fishType: "walleye",
		isTrash: false,
	},
	// Legendary/Rare fish
	Gar: {
		color: 0xdc143c,
		speed: 150,
		health: 7,
		points: 50,
		size: 1.8,
		fishType: "gar",
		isTrash: false,
	},
	Sturgeon: {
		color: 0x9c27b0,
		speed: 70,
		health: 8,
		points: 75,
		size: 2.0,
		fishType: "sturgeon",
		isTrash: false,
	},
};

// ============================================
// TRASH ITEMS
// ============================================
export const TrashItems = {
	Boot: {
		color: 0x654321,
		speed: 50,
		health: 1,
		points: 0,
		size: 1.0,
		fishType: "boot",
		isTrash: true,
	},
	TinCan: {
		color: 0xc0c0c0,
		speed: 70,
		health: 1,
		points: 0,
		size: 0.7,
		fishType: "tin can",
		isTrash: true,
	},
	Seaweed: {
		color: 0x2e7d32,
		speed: 40,
		health: 1,
		points: 0,
		size: 0.9,
		fishType: "seaweed",
		isTrash: true,
	},
	PlasticBag: {
		color: 0xe0e0e0,
		speed: 30,
		health: 1,
		points: 0,
		size: 0.8,
		fishType: "plastic bag",
		isTrash: true,
	},
};

/* Usage Example:

Create a salmon
const salmon = new Fish(scene, 100, 200, FishTypes.Salmon);

Create a trout
const trout = new Fish(scene, 300, 200, FishTypes.Trout);

Make them swim
salmon.swim(1);  // swim right
trout.swim(-1);  // swim left

*/
