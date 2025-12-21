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
