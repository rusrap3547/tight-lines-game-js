# Tight Lines - Fishing Game

A Phaser 3 fishing game where you sit on a dock and catch fish with timing-based mechanics.

---

## 🎣 How to Play

1. **Press SPACE** to start the game from the title screen
2. **Press SPACE again** to cast your bobber into the water
3. The bobber will automatically sink to the bottom and return
4. **Catch fish** by having your bobber collide with them
5. Different fish are worth different points:
   - Small fish (Guppy, Anchovy): 2-5 points
   - Medium fish (Bass, Salmon): 10-22 points
   - Large fish (Catfish, Tuna): 25-40 points
   - Legendary fish (Arowana, Great White Shark): 50-100 points
6. Watch out for trash items - they give 0 points!
7. The game progresses through day/night cycles (every 10 casts)
8. Try to catch as many fish as possible and beat your high score!

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

- ✅ **30+ Fish Types** with unique sprites:
  - **Freshwater Fish**: 13 types (Guppy, Bass, Salmon, Arowana, etc.)
  - **Saltwater Fish**: 18 types (Anchovy, Tuna, Great White Shark, etc.)
  - **Trash Items**: Boot, Tin Can, Seaweed, Plastic Bag (0 points each)
- ✅ **Fish Images**: All fish now display their own unique sprite images
- ✅ **Direction Flipping**: Fish sprites flip horizontally to face their movement direction
- ✅ **Weighted Spawn System**:
  - 15% chance for trash
  - 2% chance for legendary fish
  - 8% chance for rare fish
  - Rest are common/medium fish
- ✅ **Dynamic Population**: 3-12 fish at any time
- ✅ **Auto Spawning**: New fish appear every 2-5 seconds
- ✅ **Auto Despawning**: Fish disappear every 3-7 seconds (from edges)
- ✅ **Unique Behaviors**: Each fish type has different speed, size, points, and visual appearance

### Day/Night Cycle System

- ✅ **Cast Counter**: Tracks number of casts made
- ✅ **Day Progression**: Every 10 casts = 1 day
- ✅ **Times of Day**: Morning (0-2 casts), Afternoon (3-4), Evening (5-7), Night (8-10)
- ✅ **Dynamic Sky Colors**: Sky changes color based on time of day
- ✅ **Day Counter UI**: Displays current day and time of day
- ✅ **Cast Progress UI**: Shows casts made in current day (X/10)

### Market & Upgrade System

- ✅ **Market Scene**: Accessible via button in dock scene
- ✅ **4 Shops**: Bait Shop, Line Shop, Rod Shop, Fish Buyer
- ✅ **Money System**: Fish score converts to cash (5% conversion, $1 per 20 points)
- ✅ **Upgrades**:
  - **Line Strength**: Increases tackle timer (starts 7s, +2s per level, max 10)
  - **Bait Quality**: Increases rare fish chance (starts 1%, +5% per level, max 10)
  - **Rod Power**: Increases fish size multiplier (starts 0.5x, +0.25x per level, max 3.0x)
- ✅ **Progressive Costs**: Upgrade prices increase with each level (base × 1.5^level)
- ✅ **Persistent Progress**: Player data saved across scene transitions

### Hazard Fish

- ✅ **Gar (Evil Fish)**: Small, fast (170 speed), worth 0 points, 5% spawn rate
- ✅ **Future Feature**: Will damage equipment/require new bobber purchase

### Technical Details

- Game size: 300x180 (scales to 50% of window)
- Bobber speed: 200 pixels/second
- All config values at top of files for easy tuning
- **Assets folder structure created** for future sprites/images/sounds

---

## 📁 Project Structure

```
tight-lines-game-js/
├── index.html
├── package.json
├── style.css
├── assets/                 # NEW: Asset folder structure
│   ├── images/            # Backgrounds and UI elements
│   ├── sprites/           # Player, fish, bobber sprites
│   ├── sounds/            # Sound effects
│   └── music/             # Background music
└── src/
    ├── index.js            # Game config & initialization
    ├── gameObjects.js      # Player, Bobber, Fish classes & types
    └── scenes/
        ├── startScene.js   # Title screen
        ├── marketScene.js  # Shop & upgrades
        └── dockScene.js    # Main gameplay (fishing)
```

**Note**: `miniGame.js` and `storyMode.js` were placeholder files and have been removed. We'll build these from scratch when needed.

---

## 🗺️ Development Roadmap

### **PHASE 1: Expand Fish System & Balance** ✅ COMPLETED

**Goal**: Add more fish variety, adjust scoring, and add trash items

**Completed Tasks**:

1. ✅ Reviewed and rebalanced existing fish scores/stats
2. ✅ Added 4 new fish types (Perch, Pike, Walleye, Sturgeon)
3. ✅ Added "trash" category items (boot, tin can, seaweed, plastic bag)
4. ✅ Trash items give 0 points
5. ✅ Updated fish spawn logic to include trash items
6. ✅ Set trash spawn rate at 15% chance
7. ✅ Visual distinction for trash (different colors)
8. ✅ Console messages for trash/legendary/rare catches

---

### **PHASE 2: Daily Cycle System** ✅ COMPLETED

**Goal**: Add day/night progression based on number of casts

**Completed Tasks**:

1. ✅ Added cast counter to dockScene
2. ✅ Implemented day progression (every 10 casts = 1 day)
3. ✅ Added day number display to UI
4. ✅ Created time-of-day system:
   - Morning (casts 0-2): Light blue sky
   - Afternoon (casts 3-4): Bright sky
   - Evening (casts 5-7): Orange/pink sky
   - Night (casts 8-10): Dark blue/purple sky
5. ✅ Sky color changes dynamically based on time of day
6. ✅ Cast progress UI shows X/10 casts
7. ✅ Day and time displayed on screen

---

### **PHASE 2.5: Market & Upgrade System** ✅ COMPLETED

**Goal**: Add marketplace where players can sell fish and buy upgrades

**Completed Tasks**:

1. ✅ Created market scene with ocean/dock background
2. ✅ Added 4 interactive shops (Bait, Line, Rod, Fish Buyer)
3. ✅ Implemented money system (5% of fish score converts to cash)
4. ✅ Fish automatically sold when entering market
5. ✅ Created upgrade system with 3 upgrade types:
   - Line Strength: +2s tackle timer per level (starts 7s, max 10 levels)
   - Bait Quality: +5% rare fish chance per level (starts 1%, max 10 levels)
   - Rod Power: +0.25x size multiplier per level (starts 0.5x, max 3.0x)
6. ✅ Progressive cost scaling (base × 1.5^level)
7. ✅ Shop UI with purchase confirmation and money tracking
8. ✅ Navigation between market and dock scenes
9. ✅ Added "Gar" hazard fish (fast, 0 points, future damage mechanic)

---

### **PHASE 3: Tackle System (Initial Hook + Arrow Rhythm Game)** ⬅️ NEXT (POSTPONED)

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

### **PHASE 3: Tackle System (Initial Hook + Arrow Rhythm Game)**

**Goal**: Add skill-based fish-catching mechanic after bobber hits a fish

**Part 1: Initial Hook (Timing Bar)**

- When bobber touches fish, game pauses and timing bar appears
- Bar marker moves left-to-right across the bar
- Center zone is the "success zone"
- Player presses SPACE to attempt hook
- **Success**: Marker in center → Proceeds to arrow mini-game
- **Failure**: Marker outside center → Fish escapes, return to fishing

**Part 2: Arrow Rhythm Game** (Only if hook succeeds)

- 4 lanes at top of screen (Left, Down, Up, Right arrows)
- Arrows fall from top, player must press correct key when arrow reaches bottom
- Each successful hit reduces fish health by 1
- Timer counts down (10 seconds for basic bobber, varies by bait type later)
- **Success**: Fish health reaches 0 before timer expires → Catch the fish
- **Failure**: Timer reaches 0 before health depletes → Fish escapes

**Tasks**:

**Initial Hook Tasks:**

1. [ ] Create initial hook timing overlay
2. [ ] Create timing bar with moving marker
3. [ ] Define center "success zone" (green highlight)
4. [ ] Implement marker movement (left-to-right sweep)
5. [ ] Detect SPACE key press
6. [ ] Check if marker is in success zone
7. [ ] Visual feedback (flash green for success, red for miss)
8. [ ] Transition to arrow game on success
9. [ ] Return to fishing on failure

**Arrow Game Tasks:** 10. [ ] Create tackle game scene/overlay 11. [ ] Set up 4 vertical lanes for arrows 12. [ ] Create arrow sprites (or colored rectangles) for each direction 13. [ ] Implement arrow spawning system 14. [ ] Add arrow fall speed and timing 15. [ ] Detect arrow key presses (←, ↓, ↑, →) 16. [ ] Check if key press matches arrow at hit zone 17. [ ] Visual feedback for hits/misses (flash lane green/red) 18. [ ] Fish health bar display 19. [ ] Countdown timer display 20. [ ] Win condition: health = 0 21. [ ] Lose condition: timer = 0 22. [ ] Transition back to fishing scene with result

**Config to add**:

```javascript
// Initial Hook Timing Config
HOOK_CONFIG = {
	BAR_WIDTH: 400,
	BAR_HEIGHT: 40,
	MARKER_SPEED: 300, // pixels per second
	SUCCESS_ZONE_WIDTH: 80, // green center zone
	SUCCESS_ZONE_COLOR: 0x00ff00,
	FAIL_ZONE_COLOR: 0xff0000,
	MARKER_COLOR: 0xffffff,
};

// Arrow Rhythm Game Config
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

**Initial Hook Screen:**

```
        HOOK THE FISH!

    ┌──────────────────────┐
    │░░░░░░░[✓✓✓]░░░░░░░░│  ← Timing bar
    │         ▲           │
    │         │           │
    │       Marker        │
    └──────────────────────┘

    Press SPACE when in center!
```

**Arrow Rhythm Game:**

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

### **PHASE 4: Boats, Maps & Upgrades System**

**Goal**: Add progression with different boats, maps, and upgradeable equipment

**Boats & Maps**:

- Multiple boats with different capabilities
- Each boat can access different fishing locations/maps
- Different maps have unique fish species
- Upgrade boats to unlock new areas

**Tasks**:

1. [ ] Create boat selection system
2. [ ] Design map/location system (Lake, River, Ocean, Swamp, etc.)
3. [ ] Add unique fish species for each location
4. [ ] Boat upgrade system:
   - Speed (faster casting/reeling)
   - Capacity (can catch more fish per trip)
   - Range (unlocks new maps)
   - Durability (longer fishing sessions)
5. [ ] Map unlock progression
6. [ ] Location-specific visuals (different water colors, backgrounds)
7. [ ] Travel menu to select location
8. [ ] Boat garage/selection UI

**Boat Types**:

- **Rowboat**: Starting boat, access to Dock/Lake only
- **Motorboat**: Medium upgrade, unlocks River and Pond
- **Fishing Trawler**: High-end, unlocks Ocean and Deep Sea
- **Swamp Skiff**: Specialty boat for Swamp/Bayou (rare fish like Gar)

**Map Examples**:

- **Dock/Lake**: Common fish (Bluegill, Trout, Bass)
- **River**: Fast-moving fish (Salmon, Rainbow Trout)
- **Ocean**: Large saltwater fish (Tuna, Marlin, Swordfish)
- **Swamp**: Rare/legendary fish (Gar, Alligator Gar, Snakehead)
- **Deep Sea**: Exotic deep water fish (Anglerfish, Viperfish)
- **Pond**: Small peaceful fish (Goldfish, Koi, Minnows)

**Upgrade Shop Items**:

- Better fishing rods
- Enhanced bobbers
- Special bait types (attracts specific fish)
- Net upgrades
- Sonar equipment (shows fish locations)

**Config to add**:

```javascript
BOAT_TYPES = {
	rowboat: {
		name: "Rowboat",
		cost: 0,
		speed: 1.0,
		capacity: 10,
		unlockedMaps: ["dock", "lake"],
	},
	motorboat: {
		name: "Motorboat",
		cost: 500,
		speed: 1.5,
		capacity: 20,
		unlockedMaps: ["dock", "lake", "river", "pond"],
	},
	// etc...
};

MAPS = {
	dock: {
		name: "Peaceful Dock",
		background: 0x4a90e2,
		fishTypes: ["Bluegill", "Trout", "Bass", "Catfish"],
		rareTypes: [],
	},
	swamp: {
		name: "Murky Swamp",
		background: 0x3d5c3a,
		fishTypes: ["Catfish", "Bass"],
		rareTypes: ["Gar", "AlligatorGar", "Snakehead"],
	},
	// etc...
};
```

---

### **PHASE 5: Story Mode Foundation**

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
- "Unlock the Swamp" (buy motorboat & travel to swamp to find rare Gar)

---

### **PHASE 6: Progression & Upgrades**

**Goal**: Give players something to work toward

**Tasks**:

1. [ ] Currency system (gold from fish)
2. [ ] Sho3: Tackle System (Hook + Arrow Mini-Game)

**Current Progress**: Phases 1 & 2 complete! Fish expanded, trash added, day/night cycle working.

**Next Up**: Implement the tackle mini-game system

1. Create initial hook timing overlay (timing bar with moving marker)
2. Implement SPACE key timing check (success = center zone)
3. On success, transition to arrow rhythm game
4. Create arrow game scene with 4 lanes
5. Implement arrow spawning and falling mechanic
6. Detect arrow key presses and check timing
7. Add fish health bar and countdown timer
8. Win/lose conditions and transition back to fishing

**Files to create/modify**:

- Create new scene: `src/scenes/tackleScene.js`
- Modify: `src/scenes/dockScene.js` (trigger tackle game on fish catch)
- Modify: `src/index.js` (add tackleScene to game config

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

## 🎯 Next Session TODO | Rarity |

| -------- | ----- | ------ | ---- | ------ | ---------- |
| Bluegill | 100 | 5 | 0.8 | Blue | Common |
| Perch | 95 | 10 | 0.9 | Gold | Common |
| Trout | 90 | 12 | 1.0 | Green | Common |
| Salmon | 120 | 18 | 1.2 | Pink | Medium |
| Bass | 80 | 22 | 1.3 | Brown | Medium |
| Pike | 130 | 25 | 1.4 | Green | Rare |
| Walleye | 110 | 28 | 1.3 | Yellow | Rare |
| Catfish | 60 | 30 | 1.5 | Gray | Large |
| Gar | 150 | 50 | 1.8 | Red | Legendary |
| Sturgeon | 70 | 75 | 2.0 | Purple | Legendary |

### Trash Items

| Item        | Speed | Points | Size | Color |
| ----------- | ----- | ------ | ---- | ----- |
| Boot        | 50    | 0      | 1.0  | Brown |
| Tin Can     | 70    | 0      | 0.7  | Gray  |
| Seaweed     | 40    | 0      | 0.9  | Green |
| Plastic Bag | 30    | 0      | 0.8  | Gray  |

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
