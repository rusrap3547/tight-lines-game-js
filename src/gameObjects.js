import Phaser from "phaser";

// ============================================
// GAME OBJECT CONFIGURATION
// ============================================
const PLAYER_CONFIG = {
	WIDTH: 26,
	HEIGHT: 51,
	COLOR: 0xff6b6b,
	// Add animation frames, sprite sheet details here later
};

const BOBBER_CONFIG = {
	RADIUS: 10,
	COLOR: 0xff0000,
	CAST_SPEED: 256, // pixels per second
	LINE_COLOR: 0x333333,
	LINE_WIDTH: 3,
};

const FISH_CONFIG = {
	BASE_WIDTH: 38,
	BASE_HEIGHT: 19,
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
			// Flip to face left
			this.sprite.setFlipX(true);
			// Play idle animation if it exists
			if (scene.anims.exists("idle")) {
				this.sprite.play("idle");
			}
		} else {
			// Placeholder - simple rectangle
			this.sprite = scene.add
				.rectangle(
					x,
					y,
					PLAYER_CONFIG.WIDTH,
					PLAYER_CONFIG.HEIGHT,
					PLAYER_CONFIG.COLOR,
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

	// Play animation
	playAnimation(animKey) {
		if (this.scene.anims.exists(animKey)) {
			this.sprite.play(animKey);
		}
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
				BOBBER_CONFIG.COLOR,
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
			this.isReturning,
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

				// Trigger hook animation event
				if (this.scene.events) {
					this.scene.events.emit("bobberReturned");
				}
			}
		}

		// Update fishing line
		this.line.setTo(
			this.sprite.x,
			this.sprite.y - 20,
			this.sprite.x,
			this.sprite.y,
		);
	}

	getBounds() {
		// Return bounds for the bobber circle
		const radius = BOBBER_CONFIG.RADIUS;
		return new Phaser.Geom.Rectangle(
			this.sprite.x - radius,
			this.sprite.y - radius,
			radius * 2,
			radius * 2,
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
				this.color,
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

		// Flip sprite to face direction of movement
		// direction = 1 (right) -> no flip (flipX = false)
		// direction = -1 (left) -> flip (flipX = true)
		// Special case: Gar sprite faces left by default, so invert the flip logic
		if (this.fishType === "gar") {
			this.sprite.flipX = this.direction > 0; // Inverted for Gar
		} else {
			this.sprite.flipX = this.direction < 0;
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
			fishHeight,
		);
	}
}

// ============================================
// FISH TYPE DEFINITIONS
// ============================================
export const FishTypes = {
	// ========== FRESHWATER FISH ==========
	// Small/Common
	Guppy: {
		assetKey: "guppy",
		color: 0xff6b6b,
		speed: 120,
		health: 1,
		points: 1,
		size: 0.2,
		fishType: "guppy",
		habitat: "freshwater",
		isTrash: false,
	},
	NeonTetra: {
		assetKey: "neon_tetra",
		color: 0x00d4ff,
		speed: 110,
		health: 1,
		points: 1,
		size: 0.2,
		fishType: "neon tetra",
		habitat: "freshwater",
		isTrash: false,
	},
	SilverjawMinnow: {
		assetKey: "silverjaw_minnow",
		color: 0xc0c0c0,
		speed: 130,
		health: 1,
		points: 1,
		size: 0.2,
		fishType: "silverjaw minnow",
		habitat: "freshwater",
		isTrash: false,
	},
	Goldfish: {
		assetKey: "goldfish",
		color: 0xffa500,
		speed: 85,
		health: 2,
		points: 2,
		size: 0.4,
		fishType: "goldfish",
		habitat: "freshwater",
		isTrash: false,
	},
	Bluegill: {
		assetKey: "bluegill",
		color: 0x03a9f4,
		speed: 100,
		health: 2,
		points: 2,
		size: 0.5,
		fishType: "bluegill",
		habitat: "freshwater",
		isTrash: false,
	},
	Perch: {
		assetKey: "yellow_perch",
		color: 0xffd700,
		speed: 95,
		health: 6,
		points: 3,
		size: 0.9,
		fishType: "yellow perch",
		habitat: "freshwater",
		isTrash: false,
	},
	// Medium
	Angelfish: {
		assetKey: "angelfish",
		color: 0xffb6c1,
		speed: 75,
		health: 6,
		points: 4,
		size: 1.0,
		fishType: "angelfish",
		habitat: "freshwater",
		isTrash: false,
	},
	Carp: {
		assetKey: "carp",
		color: 0xcd853f,
		speed: 70,
		health: 10,
		points: 3,
		size: 1.2,
		fishType: "carp",
		habitat: "freshwater",
		isTrash: false,
	},
	Trout: {
		assetKey: "rainbow_trout",
		color: 0x8bc34a,
		speed: 90,
		health: 6,
		points: 3,
		size: 1.0,
		fishType: "rainbow trout",
		habitat: "freshwater",
		isTrash: false,
	},
	Salmon: {
		assetKey: "salmon",
		color: 0xff6b9d,
		speed: 120,
		health: 10,
		points: 5,
		size: 1.2,
		fishType: "salmon",
		habitat: "freshwater",
		isTrash: false,
	},
	Bass: {
		assetKey: "bass",
		color: 0x795548,
		speed: 80,
		health: 12,
		points: 6,
		size: 1.3,
		fishType: "bass",
		habitat: "freshwater",
		isTrash: false,
	},
	// Large/Valuable
	Catfish: {
		assetKey: "catfish",
		color: 0x607d8b,
		speed: 60,
		health: 15,
		points: 8,
		size: 1.5,
		fishType: "catfish",
		habitat: "freshwater",
		isTrash: false,
	},
	// Legendary/Rare
	Arowana: {
		assetKey: "arowana",
		color: 0xffd700,
		speed: 140,
		health: 18,
		points: 15,
		size: 1.7,
		fishType: "arowana",
		habitat: "freshwater",
		isTrash: false,
	},
	// Hazard/Evil Fish
	Gar: {
		assetKey: "gar",
		color: 0xff0000,
		speed: 170,
		health: 6,
		points: 0,
		size: 0.9,
		fishType: "gar",
		habitat: "freshwater",
		isTrash: false,
		isHazard: true,
	},

	// ========== SALTWATER FISH ==========
	// Small/Common
	Anchovy: {
		assetKey: "anchovy",
		color: 0xb0c4de,
		speed: 140,
		health: 3,
		points: 1,
		size: 0.5,
		fishType: "anchovy",
		habitat: "saltwater",
		isTrash: false,
	},
	Goby: {
		assetKey: "goby",
		color: 0x87ceeb,
		speed: 100,
		health: 4,
		points: 2,
		size: 0.6,
		fishType: "goby",
		habitat: "saltwater",
		isTrash: false,
	},
	Clownfish: {
		assetKey: "clownfish",
		color: 0xff8c00,
		speed: 90,
		health: 5,
		points: 2,
		size: 0.7,
		fishType: "clownfish",
		habitat: "saltwater",
		isTrash: false,
	},
	Seahorse: {
		assetKey: "seahorse",
		color: 0xffdab9,
		speed: 50,
		health: 5,
		points: 3,
		size: 0.8,
		fishType: "seahorse",
		habitat: "saltwater",
		isTrash: false,
	},
	// Medium
	BlueAngelfish: {
		assetKey: "blue_angelfish",
		color: 0x1e90ff,
		speed: 80,
		health: 6,
		points: 4,
		size: 1.0,
		fishType: "blue angelfish",
		habitat: "saltwater",
		isTrash: false,
	},
	YellowTang: {
		assetKey: "yellow_tang",
		color: 0xffff00,
		speed: 95,
		health: 6,
		points: 4,
		size: 0.9,
		fishType: "yellow tang",
		habitat: "saltwater",
		isTrash: false,
	},
	PurpleTang: {
		assetKey: "purple_tang",
		color: 0x9370db,
		speed: 95,
		health: 6,
		points: 4,
		size: 0.9,
		fishType: "purple tang",
		habitat: "saltwater",
		isTrash: false,
	},
	Surgeonfish: {
		assetKey: "surgeonfish",
		color: 0x4682b4,
		speed: 100,
		health: 6,
		points: 3,
		size: 1.0,
		fishType: "surgeonfish",
		habitat: "saltwater",
		isTrash: false,
	},
	Pufferfish: {
		assetKey: "pufferfish",
		color: 0xffa07a,
		speed: 70,
		health: 9,
		points: 5,
		size: 1.1,
		fishType: "pufferfish",
		habitat: "saltwater",
		isTrash: false,
	},
	Flounder: {
		assetKey: "flounder",
		color: 0xd2b48c,
		speed: 60,
		health: 10,
		points: 5,
		size: 1.2,
		fishType: "flounder",
		habitat: "saltwater",
		isTrash: false,
	},
	RibbonEel: {
		assetKey: "ribbon_eel",
		color: 0x4169e1,
		speed: 110,
		health: 12,
		points: 6,
		size: 1.3,
		fishType: "ribbon eel",
		habitat: "saltwater",
		isTrash: false,
	},
	MorayEel: {
		assetKey: "moray_eel",
		color: 0x2f4f4f,
		speed: 90,
		health: 13,
		points: 7,
		size: 1.4,
		fishType: "moray eel",
		habitat: "saltwater",
		isTrash: false,
	},
	// Large/Valuable
	BlueGroper: {
		assetKey: "blue_groper",
		color: 0x0000cd,
		speed: 75,
		health: 15,
		points: 7,
		size: 1.5,
		fishType: "blue groper",
		habitat: "saltwater",
		isTrash: false,
	},
	NapoleonWrasse: {
		assetKey: "napoleon_wrasse",
		color: 0x20b2aa,
		speed: 70,
		health: 17,
		points: 9,
		size: 1.6,
		fishType: "napoleon wrasse",
		habitat: "saltwater",
		isTrash: false,
	},
	Tuna: {
		assetKey: "tuna",
		color: 0x191970,
		speed: 150,
		health: 13,
		points: 10,
		size: 1.4,
		fishType: "tuna",
		habitat: "saltwater",
		isTrash: false,
	},
	Stingray: {
		assetKey: "stingray",
		color: 0x696969,
		speed: 80,
		health: 18,
		points: 12,
		size: 1.7,
		fishType: "stingray",
		habitat: "saltwater",
		isTrash: false,
	},
	// Legendary/Rare
	Anglerfish: {
		assetKey: "anglerfish",
		color: 0x4b0082,
		speed: 50,
		health: 15,
		points: 14,
		size: 1.5,
		fishType: "anglerfish",
		habitat: "saltwater",
		isTrash: false,
	},
	GreatWhiteShark: {
		assetKey: "great_white_shark",
		color: 0x778899,
		speed: 160,
		health: 35,
		points: 25,
		size: 2.5,
		fishType: "great white shark",
		habitat: "saltwater",
		isTrash: false,
	},
};

// ============================================
// TRASH ITEMS
// ============================================
export const TrashItems = {
	RustyCan: {
		assetKey: "rusty_can",
		color: 0xc0c0c0,
		speed: 70,
		health: 1,
		points: 0,
		size: 0.7,
		fishType: "rusty can",
		habitat: "both",
		isTrash: true,
	},
	Bottle: {
		assetKey: "bottle",
		color: 0x654321,
		speed: 50,
		health: 1,
		points: 0,
		size: 0.8,
		fishType: "bottle",
		habitat: "both",
		isTrash: true,
	},
	AppleCore: {
		assetKey: "apple_core",
		color: 0x8b4513,
		speed: 40,
		health: 1,
		points: 0,
		size: 0.6,
		fishType: "apple core",
		habitat: "both",
		isTrash: true,
	},
	Seaweed: {
		assetKey: "seaweed",
		color: 0x2e8b57,
		speed: 35,
		health: 1,
		points: 0,
		size: 0.9,
		fishType: "seaweed",
		habitat: "both",
		isTrash: true,
	},
};

// ============================================
// OTHER CATCHABLE ITEMS
// ============================================
export const OtherItems = {
	// Crustaceans
	BlueCrab: {
		assetKey: "crab_blue",
		color: 0x1e90ff,
		speed: 65,
		health: 6,
		points: 4,
		size: 0.9,
		fishType: "blue crab",
		habitat: "saltwater",
		isTrash: false,
	},
	DungenessCrab: {
		assetKey: "crab_dungeness",
		color: 0xcd853f,
		speed: 60,
		health: 6,
		points: 5,
		size: 1.0,
		fishType: "dungeness crab",
		habitat: "saltwater",
		isTrash: false,
	},
	KingCrab: {
		assetKey: "crab_king",
		color: 0xdc143c,
		speed: 55,
		health: 12,
		points: 9,
		size: 1.3,
		fishType: "king crab",
		habitat: "saltwater",
		isTrash: false,
	},
	Shrimp: {
		assetKey: "shrimp",
		color: 0xffa07a,
		speed: 100,
		health: 1,
		points: 2,
		size: 0.5,
		fishType: "shrimp",
		habitat: "saltwater",
		isTrash: false,
	},
	// Jellyfish
	Jellyfish: {
		assetKey: "jellyfish",
		color: 0xffc0cb,
		speed: 45,
		health: 2,
		points: 3,
		size: 1.0,
		fishType: "jellyfish",
		habitat: "saltwater",
		isTrash: false,
	},
	UpsideDownJellyfish: {
		assetKey: "upside_down_jellyfish",
		color: 0xdda0dd,
		speed: 40,
		health: 2,
		points: 3,
		size: 0.9,
		fishType: "upside down jellyfish",
		habitat: "saltwater",
		isTrash: false,
	},
	// Other Marine Life
	Starfish: {
		assetKey: "starfish",
		color: 0xff6347,
		speed: 30,
		health: 2,
		points: 3,
		size: 0.8,
		fishType: "starfish",
		habitat: "saltwater",
		isTrash: false,
	},
	Mussel: {
		assetKey: "mussel",
		color: 0x483d8b,
		speed: 20,
		health: 1,
		points: 1,
		size: 0.6,
		fishType: "mussel",
		habitat: "freshwater",
		isTrash: false,
	},
	Tadpole: {
		assetKey: "tadpole",
		color: 0x556b2f,
		speed: 80,
		health: 1,
		points: 1,
		size: 0.4,
		fishType: "tadpole",
		habitat: "freshwater",
		isTrash: false,
	},
	SandDollar: {
		assetKey: "sand_dollar",
		color: 0xf5f5dc,
		speed: 25,
		health: 1,
		points: 2,
		size: 0.7,
		fishType: "sand dollar",
		habitat: "saltwater",
		isTrash: false,
	},
	Seashell: {
		assetKey: "seashell",
		color: 0xfff5ee,
		speed: 20,
		health: 1,
		points: 2,
		size: 0.6,
		fishType: "seashell",
		habitat: "saltwater",
		isTrash: false,
	},
	Pearl: {
		assetKey: "pearl",
		color: 0xffffff,
		speed: 15,
		health: 1,
		points: 15,
		size: 0.5,
		fishType: "pearl",
		habitat: "saltwater",
		isTrash: false,
	},
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get all fish by habitat
export function getFishByHabitat(habitat) {
	const allFish = { ...FishTypes, ...OtherItems };
	return Object.entries(allFish)
		.filter(
			([_, config]) => config.habitat === habitat || config.habitat === "both",
		)
		.reduce((obj, [key, value]) => {
			obj[key] = value;
			return obj;
		}, {});
}

// Get random fish from habitat
export function getRandomFish(habitat) {
	const fishInHabitat = getFishByHabitat(habitat);
	const fishKeys = Object.keys(fishInHabitat);
	const randomKey = fishKeys[Math.floor(Math.random() * fishKeys.length)];
	return fishInHabitat[randomKey];
}

/* Usage Example:

// Get all freshwater fish
const freshwaterFish = getFishByHabitat('freshwater');

// Get random freshwater fish
const randomFish = getRandomFish('freshwater');
const fish = new Fish(scene, 100, 200, randomFish);

// Create specific fish
const salmon = new Fish(scene, 100, 200, FishTypes.Salmon);
const clownfish = new Fish(scene, 300, 200, FishTypes.Clownfish);
const blueCrab = new Fish(scene, 400, 200, OtherItems.BlueCrab);

// In dockScene.js:
const freshwaterFish = getFishByHabitat('freshwater');

// In oceanScene.js:
const saltwaterFish = getFishByHabitat('saltwater');

*/
