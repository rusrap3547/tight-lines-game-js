import Phaser from "phaser";

// Example Player class
export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, "player");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setCollideWorldBounds(true);
		this.speed = 200;
	}

	update(cursors) {
		// Movement logic
		if (cursors.left.isDown) {
			this.setVelocityX(-this.speed);
		} else if (cursors.right.isDown) {
			this.setVelocityX(this.speed);
		} else {
			this.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			this.setVelocityY(-this.speed);
		} else if (cursors.down.isDown) {
			this.setVelocityY(this.speed);
		} else {
			this.setVelocityY(0);
		}
	}
}

// Add more game objects here as needed

// Simple Fish class for fishing game
export class Fish extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, config = {}) {
		super(scene, x, y, config.texture || "fish");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Fish stats from config
		this.speed = config.speed || 100;
		this.health = config.health || 3;
		this.points = config.points || 10;
		this.size = config.size || 1;
		this.fishType = config.fishType || "generic";

		// Apply scale
		this.setScale(this.size);
		this.setCollideWorldBounds(true);
	}

	// Simple movement
	swim(direction = 1) {
		this.setVelocityX(this.speed * direction);
	}
}

// Fish type definitions - Use these when creating fish
export const FishTypes = {
	Salmon: {
		texture: "salmon",
		speed: 120,
		health: 4,
		points: 15,
		size: 1.2,
		fishType: "salmon",
	},
	Trout: {
		texture: "trout",
		speed: 90,
		health: 3,
		points: 10,
		size: 1.0,
		fishType: "trout",
	},
	Bass: {
		texture: "bass",
		speed: 80,
		health: 5,
		points: 20,
		size: 1.3,
		fishType: "bass",
	},
	Catfish: {
		texture: "catfish",
		speed: 60,
		health: 6,
		points: 25,
		size: 1.5,
		fishType: "catfish",
	},
	Bluegill: {
		texture: "bluegill",
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
