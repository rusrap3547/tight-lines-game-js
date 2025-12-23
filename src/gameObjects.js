import Phaser from "phaser";

// Player class - stands at end of dock
export class Player {
	constructor(scene, x, y) {
		this.scene = scene;
		// Create a simple rectangle for the player
		this.sprite = scene.add.rectangle(x, y, 20, 40, 0xff6b6b).setOrigin(0.5, 1);
	}

	getX() {
		return this.sprite.x;
	}

	getY() {
		return this.sprite.y;
	}
}

// Bobber class - fishing bobber that goes down and up
export class Bobber {
	constructor(scene, x, y, sandY) {
		this.scene = scene;
		this.startY = y;
		this.sandY = sandY;
		this.isCasting = false;
		this.isReturning = false;
		this.castSpeed = 200; // pixels per second

		// Create bobber as a small circle
		this.sprite = scene.add.circle(x, y, 8, 0xff0000);

		// Create fishing line
		this.line = scene.add
			.line(0, 0, x, y - 20, x, y, 0x333333)
			.setOrigin(0, 0)
			.setLineWidth(2);
	}

	cast() {
		if (!this.isCasting && !this.isReturning) {
			this.isCasting = true;
			this.hasCaught = false; // Reset catch flag for new cast
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
		const radius = 8;
		return new Phaser.Geom.Rectangle(
			this.sprite.x - radius,
			this.sprite.y - radius,
			radius * 2,
			radius * 2
		);
	}
}

// Add more game objects here as needed

// Simple Fish class for fishing game
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

		// Create fish as a rectangle
		const fishWidth = 30 * this.size;
		const fishHeight = 15 * this.size;
		this.sprite = scene.add.rectangle(x, y, fishWidth, fishHeight, this.color);

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
		const fishWidth = 30 * this.size;
		const fishHeight = 15 * this.size;
		return new Phaser.Geom.Rectangle(
			this.x - fishWidth / 2,
			this.y - fishHeight / 2,
			fishWidth,
			fishHeight
		);
	}
}

// Fish type definitions - Use these when creating fish
export const FishTypes = {
	Salmon: {
		color: 0xff6b9d,
		speed: 120,
		health: 4,
		points: 15,
		size: 1.2,
		fishType: "salmon",
	},
	Trout: {
		color: 0x8bc34a,
		speed: 90,
		health: 3,
		points: 10,
		size: 1.0,
		fishType: "trout",
	},
	Bass: {
		color: 0x795548,
		speed: 80,
		health: 5,
		points: 20,
		size: 1.3,
		fishType: "bass",
	},
	Catfish: {
		color: 0x607d8b,
		speed: 60,
		health: 6,
		points: 25,
		size: 1.5,
		fishType: "catfish",
	},
	Bluegill: {
		color: 0x03a9f4,
		speed: 100,
		health: 2,
		points: 5,
		size: 0.8,
		fishType: "bluegill",
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
