import Phaser from "phaser";

export default class boatScene extends Phaser.Scene {
	constructor() {
		super({ key: "BoatScene" });
	}

	create() {
		const { width, height } = this.cameras.main;

		// Water (light blue background)
		this.add.rectangle(0, 0, width, height * 0.95, 0x87ceeb).setOrigin(0, 0);

		// Sand at bottom (5% of screen)
		this.add
			.rectangle(0, height * 0.95, width, height * 0.05, 0xc2b280)
			.setOrigin(0, 0);

		// Dock on right side, halfway down the screen
		const dockWidth = 150;
		const dockHeight = 300;
		const dockX = width - dockWidth;
		const dockY = height * 0.5 - dockHeight / 2;

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
	}
}
