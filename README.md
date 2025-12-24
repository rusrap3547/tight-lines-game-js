# Tight Lines - Fishing Game

A Phaser 3 fishing game where you sit on a dock and catch fish with timing-based mechanics.

---

## 🎮 Current State (Working)

### Core Mechanics

- ✅ **Start Scene**: Title screen with "Press SPACE to Start"
- ✅ **Main Fishing Scene**: Player on dock, bobber in water
- ✅ **Casting Mechanic**: Press SPACE to cast bobber down to sand
- ✅ **Auto-Return**: Bobber automatically returns after reaching bottom
- ✅ **Repeated Casts**: Spacebar works multiple times without needing to refocus window
- ✅ **Collision Detection**: Bobber catches fish on contact
- ✅ **Score System**: Points awarded based on fish type

### Fish System

- ✅ **5 Fish Types**: Salmon (15pts), Trout (10pts), Bass (20pts), Catfish (25pts), Bluegill (5pts)
- ✅ **Dynamic Population**: 3-12 fish at any time
- ✅ **Auto Spawning**: New fish appear every 2-5 seconds
- ✅ **Auto Despawning**: Fish disappear every 3-7 seconds (from edges)
- ✅ **Unique Behaviors**: Each fish type has different speed, size, and color

### Technical Details

- Game size: 300x180 (scales to 50% of window)
- Bobber speed: 200 pixels/second
- All config values at top of files for easy tuning

---

## 📁 Project Structure

```
tight-lines-game-js/
├── index.html
├── package.json
├── style.css
└── src/
    ├── index.js            # Game config & initialization
    ├── gameObjects.js      # Player, Bobber, Fish classes & types
    └── scenes/
        ├── startScene.js   # Title screen
        └── boatScene.js    # Main gameplay (fishing)
```

**Note**: `miniGame.js` and `storyMode.js` were placeholder files and have been removed. We'll build these from scratch when needed.

---

## 🗺️ Development Roadmap

### **PHASE 1: Expand Fish System & Balance** ⬅️ NEXT

**Goal**: Add more fish variety, adjust scoring, and add trash items

**Tasks**:

1. [ ] Review and rebalance existing fish scores/stats
2. [ ] Add 3-5 new fish types to FishTypes object
3. [ ] Add "trash" category items (boot, tin can, seaweed, etc.)
4. [ ] Trash items give 0 points (or negative points?)
5. [ ] Update fish spawn logic to include trash items
6. [ ] Adjust trash spawn rate (maybe 10-15% chance)
7. [ ] Visual distinction for trash (different colors/shapes)
8. [ ] Update UI to show "Trash caught!" message

**New Fish Ideas**:

- Legendary/rare fish (very fast, high points)
- More common fish varieties
- Seasonal fish (for future day/season system)

**Trash Items**:

- Boot: 0 points, slow moving
- Tin Can: 0 points, medium speed
- Seaweed: 0 points, floats around
- Plastic Bag: 0 points, very slow

**Config to add**:

```javascript
// Add to FishTypes in gameObjects.js
TrashItems: {
  Boot: {
    color: 0x654321,
    speed: 50,
    points: 0,
    size: 1.0,
    isTrash: true
  },
  TinCan: {
    color: 0xc0c0c0,
    speed: 70,
    points: 0,
    size: 0.7,
    isTrash: true
  },
  // etc...
}

SPAWN_CONFIG = {
  TRASH_SPAWN_CHANCE: 0.15 // 15% chance
}
```

---

### **PHASE 2: Daily Cycle System**

**Goal**: Add day/night progression based on number of casts

**Tasks**:

1. [ ] Add cast counter to boatScene
2. [ ] Implement day progression (every 10 casts = 1 day)
3. [ ] Add day number display to UI
4. [ ] Create time-of-day system:
   - Morning (casts 0-2): Light blue sky
   - Afternoon (casts 3-5): Bright sky
   - Evening (casts 6-8): Orange/pink sky
   - Night (casts 9-10): Dark blue/purple sky
5. [ ] Change sky color based on time of day
6. [ ] (Optional) Adjust fish spawn rates by time
7. [ ] (Optional) Different fish appear at different times

**Config to add**:

```javascript
DAY_CYCLE_CONFIG = {
	CASTS_PER_DAY: 10,
	TIMES_OF_DAY: ["morning", "afternoon", "evening", "night"],
	SKY_COLORS: {
		morning: 0x87ceeb,
		afternoon: 0x87cefd,
		evening: 0xff8c69,
		night: 0x1a1a3e,
	},
};
```

---

### **PHASE 3: Tackle System (Arrow Rhythm Game)**

**Goal**: Add skill-based fish-catching mechanic after bobber hits a fish

**Mechanics**:

- 4 lanes at top of screen (Left, Down, Up, Right arrows)
- Arrows fall from top, player must press correct key when arrow reaches bottom
- Each successful hit reduces fish health by 1
- Timer counts down (10 seconds for basic bobber, varies by bait type later)
- **Success**: Fish health reaches 0 before timer expires → Catch the fish
- **Failure**: Timer reaches 0 before health depletes → Fish escapes

**Tasks**:

1. [ ] Create tackle game scene/overlay
2. [ ] Set up 4 vertical lanes for arrows
3. [ ] Create arrow sprites (or colored rectangles) for each direction
4. [ ] Implement arrow spawning system
5. [ ] Add arrow fall speed and timing
6. [ ] Detect arrow key presses (←, ↓, ↑, →)
7. [ ] Check if key press matches arrow at hit zone
8. [ ] Visual feedback for hits/misses (flash lane green/red)
9. [ ] Fish health bar display
10. [ ] Countdown timer display
11. [ ] Win condition: health = 0
12. [ ] Lose condition: timer = 0
13. [ ] Transition back to fishing scene with result

**Config to add**:

```javascript
TACKLE_CONFIG = {
	LANE_COUNT: 4,
	ARROW_KEYS: ["LEFT", "DOWN", "UP", "RIGHT"],
	FALL_SPEED: 200, // pixels per second
	HIT_ZONE_Y: 550, // y position where player must hit
	HIT_TOLERANCE: 30, // pixels margin for "good" hit

	// Bait types (for later)
	BAIT_TIMERS: {
		basic: 10, // 10 seconds
		worm: 12, // 12 seconds
		lure: 15, // 15 seconds
		premium: 20, // 20 seconds
	},
};
```

**Visual Design**:

```
   ←     ↓     ↑     →
   │     │     │     │
   ▼     ▼     ▼     ▼
  [█]   [█]   [ ]   [ ]  ← Falling arrows
   │     │     │     │
   │     │     │     │
  [█]   [ ]   [█]   [ ]
   │     │     │     │
  ═══   ═══   ═══   ═══  ← Hit zone (press key here)
   ◀     ◀     ◀     ◀   ← Key indicators

Fish Health: ████░░░░░░ (4/10)    Time: 7s
```

---

### **PHASE 4: Story Mode Foundation**

**Goal**: Add basic quest and progression system

**Tasks**:

1. [ ] Create quest data structure
2. [ ] Add NPC character (text/portrait)
3. [ ] Simple dialog system
4. [ ] Quest objectives (catch X fish, catch specific type)
5. [ ] Quest completion detection
6. [ ] Reward system (unlock new areas, equipment)
7. [ ] 3-5 starter quests

**Example Quests**:

- "Catch your first fish" (any fish)
- "Catch 5 Bluegill" (quantity goal)
- "Catch a Bass" (specific type)
- "Score 100 points" (points goal)
- "Complete a perfect catch" (timing goal)

---

### **PHASE 5: Progression & Upgrades**

**Goal**: Give players something to work toward

**Tasks**:

1. [ ] Currency system (gold from fish)
2. [ ] Shop/upgrade menu
3. [ ] Fishing rod upgrades (cast speed, catch rate)
4. [ ] Bait system (attracts certain fish)
5. [ ] Player level/experience
6. [ ] Achievement system
7. [ ] Fish encyclopedia (collection tracker)

---

### **PHASE 6: Polish & Content**

**Goal**: Make it look and sound good

**Tasks**:

1. [ ] Replace placeholder graphics:
   - Player sprite
   - Bobber sprite
   - Dock/water background
   - Fish sprites
   - UI elements
2. [ ] Add sound effects:
   - Splash (bobber hits water)
   - Catch (fish caught)
   - UI sounds (button clicks, quest complete)
3. [ ] Background music (changes with time of day)
4. [ ] Particle effects:
   - Water ripples around bobber
   - Sparkles on successful catch
5. [ ] Animations:
   - Fish swimming (not just moving rectangles)
   - Bobber bob animation
   - Player casting animation
6. [ ] Additional locations (lake, river, ocean)
7. [ ] Weather system (rain affects fish)

---

## 🎯 Next Session TODO

**Start here when you pick this up again:**

### Phase 1: Expand Fish System

1. Open `src/gameObjects.js`
2. Review existing fish stats in `FishTypes` object
3. Decide on new point values for existing fish
4. Add 3-5 new fish types with unique stats
5. Create `TrashItems` object with boot, can, seaweed, bag
6. Update fish spawning logic in `boatScene.js` to include trash (15% chance)
7. Test catching both fish and trash items
8. Update score display to handle 0-point catches

**Files to modify**:

- `src/gameObjects.js` (add fish types, trash items)
- `src/scenes/boatScene.js` (update spawn logic, add trash spawn chance)

---

## 🛠️ Configuration & Customization

### Where to Find Settings

All game values are at the top of files for easy tweaking:

**`src/scenes/boatScene.js`**:

- `GAME_CONFIG`: Scene layout, dock size, fish spawn rates, colors
- `ASSETS`: Placeholder for future image paths

**`src/gameObjects.js`**:

- `PLAYER_CONFIG`: Player size and color
- `BOBBER_CONFIG`: Bobber size, speed, line appearance
- `FISH_CONFIG`: Base fish dimensions
- `FishTypes`: Each fish's speed, points, size, color

### Current Fish Stats

| Fish     | Speed | Points | Size | Color |
| -------- | ----- | ------ | ---- | ----- |
| Salmon   | 120   | 15     | 1.2  | Pink  |
| Trout    | 90    | 10     | 1.0  | Green |
| Bass     | 80    | 20     | 1.3  | Brown |
| Catfish  | 60    | 25     | 1.5  | Gray  |
| Bluegill | 100   | 5      | 0.8  | Blue  |

---

## 🚀 Running the Game

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## 🎮 Controls

- **SPACE**: Cast bobber / Start game

---

## 📝 Development Notes

### Recent Changes

- Fixed spacebar input (works repeatedly without refocusing)
- Simplified input to use `isDown` with state tracking
- Removed placeholder miniGame.js and storyMode.js files

### Known Issues

- None currently

### Code Organization

- All classes use config constants at top of file
- Asset placeholders ready for when you add images
- Easy to add new fish types in `FishTypes` object
