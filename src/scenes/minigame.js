import Phaser from "phaser";

/*
RHYTHM MINIGAME - DDR/Guitar Hero style
- Arrows fall from top to bottom
- Player must press arrow keys when falling arrows reach the hit zones (hollow arrows)
- Number of arrows based on fish health
- Timer starts at 7 seconds
- Success = catch fish, Failure = fish escapes
*/

// ============================================
// MINIGAME CONFIGURATION
// ============================================
const MINIGAME_CONFIG = {
	// Timing
	INITIAL_TIME: 7,

	// Arrow mechanics
	ARROW_SPEED: 192, // pixels per second (slower for larger screen)
	HIT_ZONE_Y: 179, // Y position of hit zones (will be calculated at bottom)
	SPAWN_Y: -64, // Y position where arrows spawn (off-screen top)
	HIT_THRESHOLD_ABOVE: 51, // pixels above hit zone center
	HIT_THRESHOLD_BELOW: 26, // pixels below hit zone center
	ARROW_SPAWN_INTERVAL: 800, // milliseconds between spawning new arrows

	// Arrow lanes (X positions for left, up, down, right) - positioned for right half
	// Will be calculated based on screen width in create()
	LANE_SPACING: 51,
	ARROW_TYPES: ["left", "up", "down", "right"],

	// Visual
	BACKGROUND_COLOR: 0x1a1a3e,
	TIMER_COLOR: "#ffff00",
	SUCCESS_COLOR: "#00ff00",
	FAIL_COLOR: "#ff0000",

	// Success bar (horizontal at bottom)
	SUCCESS_BAR_HEIGHT: 38,
	SUCCESS_BAR_PADDING: 19, // padding from edges and bottom
};

export default class Minigame extends Phaser.Scene {
	constructor() {
		super({ key: "Minigame" });
	}

	init(data) {
		// Receive data from dockScene
		this.fishData = data.fish || { health: 3, fishType: "generic", points: 10 };
		this.currentScore = data.score || 0;

		// Check if player has seen the tutorial before
		const hasSeenTutorial =
			localStorage.getItem("rhythmGameTutorialSeen") === "true";

		// State management for instructions and countdown
		this.showingInstructions = !hasSeenTutorial; // Only show if not seen before
		this.showingCountdown = false;
		this.gameStarted = hasSeenTutorial; // Skip straight to game if tutorial already seen
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

		// Load fishing rod sprite sheet (12 frames across, 8 rows down, 64x64 per frame)
		this.load.spritesheet(
			"fishingRod",
			"assets/images/Upgrades/FISHING ROD/fishingRodSprites.png",
			{
				frameWidth: 64,
				frameHeight: 64,
			}
		);
	}

	create() {
		const { width, height } = this.cameras.main;

		// Calculate right half starting position
		const rightHalfStart = width / 2;
		const minigameWidth = width / 2;
		const minigameCenter = rightHalfStart + minigameWidth / 2;

		// Left half background (light blue for fishing rod area)
		this.add.rectangle(0, 0, width / 2, height, 0x87ceeb).setOrigin(0, 0);

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

		// Create fishing rod sprite centered in left half
		const leftHalfCenter = width / 4;
		this.fishingRod = this.add.sprite(leftHalfCenter, height / 2, "fishingRod");
		this.fishingRod.setScale(2);

		// Create fishing rod animations (8 rows, 12 frames each)
		for (let row = 0; row < 8; row++) {
			const startFrame = row * 12;
			const endFrame = startFrame + 11;
			this.anims.create({
				key: `rod_anim_${row + 1}`,
				frames: this.anims.generateFrameNumbers("fishingRod", {
					start: startFrame,
					end: endFrame,
				}),
				frameRate: 10,
				repeat: -1,
			});
		}

		// Play first animation by default
		this.fishingRod.play("rod_anim_1");

		// Show instruction screen first (only first time)
		if (this.showingInstructions) {
			this.createInstructionScreen();
			return; // Don't create game elements yet
		}

		// If tutorial already seen, start game directly
		if (this.gameStarted) {
			this.startGame();
		}
	}

	spawnArrow() {
		// Spawn a single random arrow
		const arrowTypes = MINIGAME_CONFIG.ARROW_TYPES;
		const randomType = Phaser.Math.RND.pick(arrowTypes);
		const laneIndex = arrowTypes.indexOf(randomType);
		const x = this.lanePositions[laneIndex];
		const y = MINIGAME_CONFIG.SPAWN_Y;

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

	update(time, delta) {
		// Don't update game logic until game has started
		if (!this.gameStarted || this.gameOver) return;

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

		// Spawn new arrows continuously
		this.lastArrowSpawnTime += delta;
		if (this.lastArrowSpawnTime >= MINIGAME_CONFIG.ARROW_SPAWN_INTERVAL) {
			this.spawnArrow();
			this.lastArrowSpawnTime = 0;
		}

		// Update falling arrows
		for (let i = this.fallingArrows.length - 1; i >= 0; i--) {
			const arrow = this.fallingArrows[i];

			if (!arrow.hit && !arrow.missed) {
				// Move arrow down
				arrow.y += MINIGAME_CONFIG.ARROW_SPEED * (delta / 1000);
				arrow.sprite.y = arrow.y;

				// Check if arrow passed the hit zone (missed)
				if (
					arrow.y >
					this.hitZoneY + MINIGAME_CONFIG.HIT_THRESHOLD_BELOW + 30
				) {
					this.missArrow(arrow);
				}
			} else {
				// Remove arrows that are hit or missed and have been destroyed
				if (!arrow.sprite || !arrow.sprite.active) {
					this.fallingArrows.splice(i, 1);
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
		let closestDistance = Infinity;

		for (let arrow of this.fallingArrows) {
			if (arrow.type === keyType && !arrow.hit && !arrow.missed) {
				const distance = arrow.y - this.hitZoneY;
				// Check if arrow is within the asymmetric hit zone (30px above, 10px below)
				if (
					distance >= -MINIGAME_CONFIG.HIT_THRESHOLD_ABOVE &&
					distance <= MINIGAME_CONFIG.HIT_THRESHOLD_BELOW
				) {
					const absDistance = Math.abs(distance);
					if (absDistance < closestDistance) {
						closestDistance = absDistance;
						closestArrow = arrow;
					}
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

		// Update success bar (horizontal - grow width left to right)
		const progress = this.arrowsHit / this.arrowsToHit;
		const newWidth = this.successBarMaxWidth * progress;
		this.tweens.add({
			targets: this.successBar,
			width: newWidth,
			duration: 200,
			ease: "Power2",
		});

		// Visual feedback
		arrow.sprite.setTint(0x00ff00);
		this.tweens.add({
			targets: arrow.sprite,
			alpha: 0,
			scale: 1.5,
			duration: 150, // Reduced from 200 for faster feedback
			onComplete: () => {
				arrow.sprite.destroy();
			},
		});

		this.showFeedback("HIT!", MINIGAME_CONFIG.SUCCESS_COLOR);
	}

	missArrow(arrow) {
		arrow.missed = true;

		// Visual feedback (faster fadeout)
		arrow.sprite.setTint(0xff0000);
		this.tweens.add({
			targets: arrow.sprite,
			alpha: 0,
			duration: 200, // Reduced from 300
			onComplete: () => {
				arrow.sprite.destroy();
			},
		});

		this.showFeedback("MISSED!", MINIGAME_CONFIG.FAIL_COLOR);
	}

	showFeedback(text, color) {
		// Cancel any existing feedback tween to allow immediate new feedback
		this.tweens.killTweensOf(this.feedbackText);

		this.feedbackText.setText(text);
		this.feedbackText.setColor(color);
		this.feedbackText.setAlpha(1); // Reset alpha immediately

		// Fade out after brief display (shorter duration for faster feedback)
		this.tweens.add({
			targets: this.feedbackText,
			alpha: 0,
			duration: 300, // Reduced from 500
			delay: 100, // Small delay so it's visible
		});
	}

	createInstructionScreen() {
		const { width, height } = this.cameras.main;
		const rightHalfStart = width / 2;
		const minigameWidth = width / 2;
		const minigameCenter = rightHalfStart + minigameWidth / 2;

		// Create instruction overlay
		const instructionOverlay = this.add
			.rectangle(rightHalfStart, 0, minigameWidth, height, 0x000000, 0.8)
			.setOrigin(0, 0)
			.setDepth(200);

		// Instruction title
		const titleText = this.add
			.text(minigameCenter, height / 2 - 60, "RHYTHM GAME", {
				fontSize: "22px",
				fill: "#ffff00",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(201);

		// Instruction description
		const descText = this.add
			.text(
				minigameCenter,
				height / 2 - 20,
				"Match the falling arrows by\npressing the arrow keys when they\nreach the target zone!\n\nUse Arrow Keys or WASD",
				{
					fontSize: "14px",
					fill: "#ffffff",
					fontFamily: "Arial",
					align: "center",
					lineSpacing: 5,
				}
			)
			.setOrigin(0.5)
			.setDepth(201);

		// OK button background
		const buttonWidth = 100;
		const buttonHeight = 35;
		const buttonY = height / 2 + 60;

		const okButton = this.add
			.rectangle(minigameCenter, buttonY, buttonWidth, buttonHeight, 0x4caf50)
			.setStrokeStyle(2, 0xffffff)
			.setOrigin(0.5)
			.setDepth(201)
			.setInteractive({ useHandCursor: true });

		// OK button text
		const okButtonText = this.add
			.text(minigameCenter, buttonY, "OK", {
				fontSize: "16px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(202);

		// Button hover effects
		okButton.on("pointerover", () => {
			okButton.setFillStyle(0x66bb6a);
		});

		okButton.on("pointerout", () => {
			okButton.setFillStyle(0x4caf50);
		});

		// OK button click handler
		okButton.on("pointerdown", () => {
			// Mark tutorial as seen in localStorage
			localStorage.setItem("rhythmGameTutorialSeen", "true");

			// Destroy instruction screen
			instructionOverlay.destroy();
			titleText.destroy();
			descText.destroy();
			okButton.destroy();
			okButtonText.destroy();

			// Show countdown
			this.showingInstructions = false;
			this.showingCountdown = true;
			this.startCountdown();
		});

		// Store references for cleanup if needed
		this.instructionUI = {
			overlay: instructionOverlay,
			title: titleText,
			desc: descText,
			button: okButton,
			buttonText: okButtonText,
		};
	}

	startCountdown() {
		const { width, height } = this.cameras.main;
		const rightHalfStart = width / 2;
		const minigameWidth = width / 2;
		const minigameCenter = rightHalfStart + minigameWidth / 2;

		let count = 3;

		// Create countdown text
		const countdownText = this.add
			.text(minigameCenter, height / 2, count.toString(), {
				fontSize: "64px",
				fill: "#ffff00",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5)
			.setDepth(200);

		// Countdown timer
		const countdownTimer = this.time.addEvent({
			delay: 1000,
			callback: () => {
				count--;
				if (count > 0) {
					countdownText.setText(count.toString());
					// Add scale animation
					countdownText.setScale(1);
					this.tweens.add({
						targets: countdownText,
						scale: 1.2,
						duration: 200,
						yoyo: true,
					});
				} else {
					// Countdown finished
					countdownText.destroy();
					this.showingCountdown = false;
					this.gameStarted = true;
					this.startGame();
				}
			},
			repeat: 2,
		});

		// Initial scale animation
		this.tweens.add({
			targets: countdownText,
			scale: 1.2,
			duration: 200,
			yoyo: true,
		});
	}

	startGame() {
		const { width, height } = this.cameras.main;
		const rightHalfStart = width / 2;
		const minigameWidth = width / 2;
		const minigameCenter = rightHalfStart + minigameWidth / 2;

		// Now create all the game elements
		// Title
		this.add
			.text(minigameCenter, 19, "REEL IT IN!", {
				fontSize: "20px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			})
			.setOrigin(0.5);

		// Calculate lane positions centered in right half
		const totalLaneWidth = MINIGAME_CONFIG.LANE_SPACING * 3;
		const laneStartX = minigameCenter - totalLaneWidth / 2;
		this.lanePositions = [];
		for (let i = 0; i < 4; i++) {
			this.lanePositions.push(laneStartX + i * MINIGAME_CONFIG.LANE_SPACING);
		}

		// Timer display
		this.timeRemaining = MINIGAME_CONFIG.INITIAL_TIME;
		this.timerText = this.add.text(
			rightHalfStart + 13,
			13,
			`Time: ${this.timeRemaining.toFixed(1)}s`,
			{
				fontSize: "15px",
				fill: MINIGAME_CONFIG.TIMER_COLOR,
				fontFamily: "Arial",
				fontStyle: "bold",
			}
		);

		// Arrows hit counter
		this.arrowsHit = 0;
		this.arrowsToHit = this.fishData.health || 3;
		this.counterText = this.add.text(
			rightHalfStart + 13,
			38,
			`Arrows: ${this.arrowsHit}/${this.arrowsToHit}`,
			{
				fontSize: "15px",
				fill: "#ffffff",
				fontFamily: "Arial",
				fontStyle: "bold",
			}
		);

		// Create horizontal success bar at the bottom of right half
		const successBarWidth =
			minigameWidth - MINIGAME_CONFIG.SUCCESS_BAR_PADDING * 2;
		const successBarY =
			height -
			MINIGAME_CONFIG.SUCCESS_BAR_PADDING -
			MINIGAME_CONFIG.SUCCESS_BAR_HEIGHT / 2;
		const successBarX = minigameCenter;

		// White box background
		this.successBoxBg = this.add
			.rectangle(
				successBarX,
				successBarY,
				successBarWidth + 10,
				MINIGAME_CONFIG.SUCCESS_BAR_HEIGHT + 10,
				0xffffff
			)
			.setOrigin(0.5);

		// Dark background bar inside white box
		this.successBarBg = this.add
			.rectangle(
				successBarX,
				successBarY,
				successBarWidth,
				MINIGAME_CONFIG.SUCCESS_BAR_HEIGHT,
				0x333333
			)
			.setOrigin(0.5);

		// Progress bar (green) - starts at 0 width, grows from left to right
		this.successBar = this.add
			.rectangle(
				successBarX - successBarWidth / 2,
				successBarY,
				0,
				MINIGAME_CONFIG.SUCCESS_BAR_HEIGHT,
				0x00ff00
			)
			.setOrigin(0, 0.5);

		// Store success bar dimensions for updates
		this.successBarMaxWidth = successBarWidth;
		this.successBarY = successBarY;

		// Calculate hit zone Y position (just above the success bar)
		const successBarTopEdge =
			successBarY - (MINIGAME_CONFIG.SUCCESS_BAR_HEIGHT + 10) / 2;
		const hitZoneHeight =
			MINIGAME_CONFIG.HIT_THRESHOLD_ABOVE + MINIGAME_CONFIG.HIT_THRESHOLD_BELOW;
		const hitZoneY = successBarTopEdge - hitZoneHeight / 2 - 5;

		// Create hit zone highlight background
		const hitZoneWidth = MINIGAME_CONFIG.LANE_SPACING * 3 + 50;

		// Semi-transparent colored background for hit zone
		this.hitZoneHighlight = this.add
			.rectangle(
				minigameCenter,
				hitZoneY,
				hitZoneWidth,
				hitZoneHeight,
				0xffff00,
				0.15
			)
			.setOrigin(0.5);

		// Border around hit zone
		this.hitZoneBorder = this.add
			.rectangle(minigameCenter, hitZoneY, hitZoneWidth, hitZoneHeight)
			.setOrigin(0.5)
			.setStrokeStyle(3, 0xffff00, 0.8);
		this.hitZoneBorder.setFillStyle();

		// Create hit zones (hollow arrows at bottom near success bar)
		this.hitZones = [];
		const arrowTypes = MINIGAME_CONFIG.ARROW_TYPES;
		for (let i = 0; i < 4; i++) {
			const x = this.lanePositions[i];
			const y = hitZoneY;
			const hollowArrow = this.add.sprite(
				x,
				y,
				`hollow${
					arrowTypes[i].charAt(0).toUpperCase() + arrowTypes[i].slice(1)
				}Arrow`
			);
			this.hitZones.push({ x, y, type: arrowTypes[i], sprite: hollowArrow });
		}

		// Store hit zone Y for arrow checking
		this.hitZoneY = hitZoneY;

		// Initialize arrow spawning
		this.fallingArrows = [];
		this.lastArrowSpawnTime = 0;
		this.spawnArrow();

		// Setup keyboard input - arrow keys and WASD
		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasdKeys = this.input.keyboard.addKeys({
			left: Phaser.Input.Keyboard.KeyCodes.A,
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		// Track which keys were just pressed
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
