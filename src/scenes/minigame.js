import Phaser from "phaser";

/*
RHYTHM MINIGAME - DDR/Guitar Hero style
- Arrows fall from top to bottom
- Player must press arrow keys when falling arrows reach the hit zones (hollow arrows)
- Number of arrows based on fish health
- Timer starts at 7 seconds, -0.5s penalty for each miss
- Success = catch fish, Failure = fish escapes
*/

// ============================================
// MINIGAME CONFIGURATION
// ============================================
const MINIGAME_CONFIG = {
	// Timing
	INITIAL_TIME: 7,
	MISS_PENALTY: 0.5,

	// Arrow mechanics
	ARROW_SPEED: 100, // pixels per second (slower for larger screen)
	HIT_ZONE_Y: 140, // Y position of hit zones (hollow arrows)
	SPAWN_Y: -50, // Y position where arrows spawn (off-screen top)
	HIT_THRESHOLD: 25, // pixels from hit zone center to count as hit (more forgiving)

	// Arrow lanes (X positions for left, up, down, right) - positioned for right half
	// Will be calculated based on screen width in create()
	LANE_SPACING: 40,
	ARROW_TYPES: ["left", "up", "down", "right"],

	// Visual
	BACKGROUND_COLOR: 0x1a1a3e,
	TIMER_COLOR: "#ffff00",
	SUCCESS_COLOR: "#00ff00",
	FAIL_COLOR: "#ff0000",
};

export default class Minigame extends Phaser.Scene {
	constructor() {
		super({ key: "Minigame" });
	}

	init(data) {
		// Receive data from dockScene
		this.fishData = data.fish || { health: 3, fishType: "generic", points: 10 };
		this.currentScore = data.score || 0;
	}

	preload() {
		// Load arrow images
		this.load.image("leftArrow", "assets/images/minigame/leftArrow.png");
		this.load.image("upArrow", "assets/images/minigame/upArrow.png");
		this.load.image("downArrow", "assets/images/minigame/downArrow.png");
		this.load.image("rightArrow", "assets/images/minigame/rightArrow.png");

		this.load.image(
			"hollowLeftArrow",
			"assets/images/minigame/hollowleftArrow.png"
		);
		this.load.image(
			"hollowUpArrow",
			"assets/images/minigame/hollowUpArrow.png"
		);
		this.load.image(
			"hollowDownArrow",
			"assets/images/minigame/hollowDownArrow.png"
		);
		this.load.image(
			"hollowRightArrow",
			"assets/images/minigame/hollowRightArrow.png"
		);
	}

	create() {
		const { width, height } = this.cameras.main;

		// Calculate right half starting position
		const rightHalfStart = width / 2;
		const minigameWidth = width / 2;
		const minigameCenter = rightHalfStart + minigameWidth / 2;

		// Background - only right half
		this.add
			.rectangle(
				rightHalfStart,
				0,
				minigameWidth,
				height,
				MINIGAME_CONFIG.BACKGROUND_COLOR
			)
			.setOrigin(0, 0);

		// Title
		this.add
			.text(minigameCenter, 15, "REEL IT IN!", {
				fontSize: "16px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Calculate lane positions centered in right half
		const totalLaneWidth = MINIGAME_CONFIG.LANE_SPACING * 3; // spacing between 4 lanes
		const laneStartX = minigameCenter - totalLaneWidth / 2;
		this.lanePositions = [];
		for (let i = 0; i < 4; i++) {
			this.lanePositions.push(laneStartX + i * MINIGAME_CONFIG.LANE_SPACING);
		}

		// Timer display
		this.timeRemaining = MINIGAME_CONFIG.INITIAL_TIME;
		this.timerText = this.add.text(
			rightHalfStart + 10,
			10,
			`Time: ${this.timeRemaining.toFixed(1)}s`,
			{
				fontSize: "12px",
				fill: MINIGAME_CONFIG.TIMER_COLOR,
				fontFamily: "Arial",
				fontStyle: "bold",
			}
		);

		// Arrows hit counter
		this.arrowsHit = 0;
		this.arrowsToHit = this.fishData.health || 3;
		this.counterText = this.add.text(
			rightHalfStart + 10,
			30,
			`Arrows: ${this.arrowsHit}/${this.arrowsToHit}`,
			{
				fontSize: "12px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			}
		);

		// Create hit zones (hollow arrows at bottom)
		this.hitZones = [];
		const arrowTypes = MINIGAME_CONFIG.ARROW_TYPES;
		for (let i = 0; i < 4; i++) {
			const x = this.lanePositions[i];
			const y = MINIGAME_CONFIG.HIT_ZONE_Y;
			const hollowArrow = this.add.sprite(
				x,
				y,
				`hollow${
					arrowTypes[i].charAt(0).toUpperCase() + arrowTypes[i].slice(1)
				}Arrow`
			);
			this.hitZones.push({ x, y, type: arrowTypes[i], sprite: hollowArrow });
		}

		// Generate falling arrows based on fish health
		this.fallingArrows = [];
		this.generateArrowSequence();

		// Setup keyboard input - arrow keys and WASD
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasdKeys = this.input.keyboard.addKeys({
			left: Phaser.Input.Keyboard.KeyCodes.A,
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		// Track which keys were just pressed (to prevent holding)
		this.keyStates = {
			left: false,
			up: false,
			down: false,
			right: false,
		};

		// Game state
		this.gameOver = false;
		this.gameResult = null;

		// Feedback text (for hits/misses) - centered in right half
		this.feedbackText = this.add
			.text(minigameCenter, 50, "", {
				fontSize: "14px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);
	}

	generateArrowSequence() {
		const arrowTypes = MINIGAME_CONFIG.ARROW_TYPES;
		const spacing = 100; // pixels between arrows (more space for slower speed)

		for (let i = 0; i < this.arrowsToHit; i++) {
			// Random arrow type
			const randomType = Phaser.Math.RND.pick(arrowTypes);
			const laneIndex = arrowTypes.indexOf(randomType);
			const x = this.lanePositions[laneIndex];

			// Spawn with spacing
			const y = MINIGAME_CONFIG.SPAWN_Y - i * spacing;

			// Create arrow sprite
			const arrow = this.add.sprite(x, y, `${randomType}Arrow`);

			this.fallingArrows.push({
				sprite: arrow,
				type: randomType,
				x: x,
				y: y,
				hit: false,
				missed: false,
			});
		}
	}

	update(time, delta) {
		if (this.gameOver) return;

		// Update timer
		this.timeRemaining -= delta / 1000;
		this.timerText.setText(
			`Time: ${Math.max(0, this.timeRemaining).toFixed(1)}s`
		);

		// Check if time ran out
		if (this.timeRemaining <= 0) {
			this.endGame(false);
			return;
		}

		// Update falling arrows
		for (let arrow of this.fallingArrows) {
			if (!arrow.hit && !arrow.missed) {
				// Move arrow down
				arrow.y += MINIGAME_CONFIG.ARROW_SPEED * (delta / 1000);
				arrow.sprite.y = arrow.y;

				// Check if arrow passed the hit zone (missed)
				if (
					arrow.y >
					MINIGAME_CONFIG.HIT_ZONE_Y + MINIGAME_CONFIG.HIT_THRESHOLD + 30
				) {
					this.missArrow(arrow);
				}
			}
		}

		// Check for arrow key presses
		this.checkInput();

		// Check if all arrows hit
		if (this.arrowsHit >= this.arrowsToHit) {
			this.endGame(true);
		}
	}

	checkInput() {
		// Check arrow keys
		if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
			this.tryHitArrow("left");
		}
		if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
			this.tryHitArrow("up");
		}
		if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
			this.tryHitArrow("down");
		}
		if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
			this.tryHitArrow("right");
		}

		// Check WASD keys
		if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.left)) {
			this.tryHitArrow("left");
		}
		if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.up)) {
			this.tryHitArrow("up");
		}
		if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.down)) {
			this.tryHitArrow("down");
		}
		if (Phaser.Input.Keyboard.JustDown(this.wasdKeys.right)) {
			this.tryHitArrow("right");
		}
	}

	tryHitArrow(keyType) {
		// Find the closest arrow of matching type in the hit zone
		let closestArrow = null;
		let closestDistance = MINIGAME_CONFIG.HIT_THRESHOLD;

		for (let arrow of this.fallingArrows) {
			if (arrow.type === keyType && !arrow.hit && !arrow.missed) {
				const distance = Math.abs(arrow.y - MINIGAME_CONFIG.HIT_ZONE_Y);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestArrow = arrow;
				}
			}
		}

		if (closestArrow) {
			// HIT!
			this.hitArrow(closestArrow);
		} else {
			// Wrong timing or no arrow - show miss feedback
			this.showFeedback("MISS!", MINIGAME_CONFIG.FAIL_COLOR);
		}
	}

	hitArrow(arrow) {
		arrow.hit = true;
		this.arrowsHit++;

		// Update counter
		this.counterText.setText(`Arrows: ${this.arrowsHit}/${this.arrowsToHit}`);

		// Visual feedback
		arrow.sprite.setTint(0x00ff00);
		this.tweens.add({
			targets: arrow.sprite,
			alpha: 0,
			scale: 1.5,
			duration: 200,
			onComplete: () => {
				arrow.sprite.destroy();
			},
		});

		this.showFeedback("HIT!", MINIGAME_CONFIG.SUCCESS_COLOR);
	}

	missArrow(arrow) {
		arrow.missed = true;

		// Apply time penalty
		this.timeRemaining -= MINIGAME_CONFIG.MISS_PENALTY;

		// Visual feedback
		arrow.sprite.setTint(0xff0000);
		this.tweens.add({
			targets: arrow.sprite,
			alpha: 0,
			duration: 300,
			onComplete: () => {
				arrow.sprite.destroy();
			},
		});

		this.showFeedback(
			`MISSED! -${MINIGAME_CONFIG.MISS_PENALTY}s`,
			MINIGAME_CONFIG.FAIL_COLOR
		);
	}

	showFeedback(text, color) {
		this.feedbackText.setText(text);
		this.feedbackText.setColor(color);

		// Fade out after brief display
		this.tweens.add({
			targets: this.feedbackText,
			alpha: 0,
			duration: 500,
			onComplete: () => {
				this.feedbackText.setAlpha(1);
			},
		});
	}

	endGame(success) {
		this.gameOver = true;
		this.gameResult = success;

		const { width, height } = this.cameras.main;

		// Create result overlay
		const overlay = this.add
			.rectangle(0, 0, width, height, 0x000000, 0.7)
			.setOrigin(0, 0);

		let resultText, resultColor;
		if (success) {
			resultText = `SUCCESS!\nCaught ${this.fishData.fishType}!\n+${this.fishData.points} points`;
			resultColor = MINIGAME_CONFIG.SUCCESS_COLOR;
		} else {
			resultText = `FAILED!\n${this.fishData.fishType} got away!`;
			resultColor = MINIGAME_CONFIG.FAIL_COLOR;
		}

		const result = this.add
			.text(width / 2, height / 2 - 20, resultText, {
				fontSize: "18px",
				fill: resultColor,
				fontFamily: "Arial",
				fontStyle: "bold",
				align: "center",
			})
			.setOrigin(0.5);

		const continueText = this.add
			.text(width / 2, height / 2 + 30, "Click to continue", {
				fontSize: "12px",
				fill: "#ffffff",
				fontFamily: "Arial",
			})
			.setOrigin(0.5);

		// Return to dock scene on click
		this.input.once("pointerdown", () => {
			const updatedScore = success
				? this.currentScore + this.fishData.points
				: this.currentScore;

			// Log catch for console feedback
			if (success) {
				if (this.fishData.fishType === "gar") {
					console.log(
						`⚠️ EVIL GAR! Watch out! +${this.fishData.points} points`
					);
				} else if (this.fishData.points === 0) {
					console.log(`🗑️ Caught trash: ${this.fishData.fishType}!`);
				} else if (
					this.fishData.fishType === "arowana" ||
					this.fishData.fishType === "great white shark"
				) {
					console.log(
						`🎉 LEGENDARY CATCH! ${this.fishData.fishType}! +${this.fishData.points} points`
					);
				} else if (
					this.fishData.fishType === "tuna" ||
					this.fishData.fishType === "stingray" ||
					this.fishData.fishType === "anglerfish"
				) {
					console.log(
						`⭐ RARE CATCH! ${this.fishData.fishType}! +${this.fishData.points} points`
					);
				} else {
					console.log(
						`Caught ${this.fishData.fishType}! +${this.fishData.points} points`
					);
				}
			} else {
				console.log(`❌ ${this.fishData.fishType} got away!`);
			}

			// Stop minigame scene and resume dock scene
			this.scene.stop();
			this.scene.resume("DockScene");

			// Update dock scene score
			const dockScene = this.scene.get("DockScene");
			if (dockScene) {
				dockScene.score = updatedScore;
				dockScene.registry.set("currentScore", updatedScore);
				if (dockScene.scoreText) {
					dockScene.scoreText.setText("Score: " + updatedScore);
				}
				// Resume bobber return
				if (dockScene.bobber) {
					dockScene.bobber.isReturning = true;
				}
			}
		});
	}
}
