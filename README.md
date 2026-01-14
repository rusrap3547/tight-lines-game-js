# 🎣 Tight Lines - Fishing Game

A Phaser 3 fishing game featuring a two-stage skill-based catching system: hook timing and DDR-style rhythm minigame. Catch fish, upgrade your equipment, and progress through day/night cycles!

---

## 🎣 How to Play

### Fishing Mechanics

1. **Click anywhere** to start from the title screen
2. **Click again** to cast your bobber into the water
3. The bobber automatically sinks and returns
4. When the bobber touches a fish, **Stage 1: Hook Timing** begins

### Stage 1: Hook Timing (Bar Minigame)

- A popup appears with a timing bar
- A red marker moves back and forth across the bar
- **Click** when the marker is in the **green success zone** (center)
- ✅ **Success**: Proceeds to Stage 2 (Rhythm Minigame)
- ❌ **Failure**: Fish escapes, bobber returns to dock

### Stage 2: Rhythm Minigame (DDR Style)

- **First Time Only**: Tutorial screen explains the game controls with an OK button
- After clicking OK (first time only): 3-2-1 countdown begins
- Right half of screen shows 4 lanes with falling arrows
- **Yellow hit zone** at the bottom shows where to time your hits
- Press **Arrow Keys** (←, ↑, ↓, →) or **WASD** when arrows enter the yellow zone
- Match the arrow direction with your key press
- **Hit Zone**: 51 pixels above and 26 pixels below center for forgiving timing
- Arrows spawn continuously every 0.8 seconds
- **Green progress bar** at the bottom fills as you hit arrows
- **Timer**: 7 seconds base time (upgradeable with Line Strength)
- **Required Hits**: Based on fish health (3-5 arrows typically)
- ✅ **Success**: Catch the fish and earn points
- ❌ **Failure**: Time runs out, fish escapes
- **Tutorial**: Only shows the first time you play - uses localStorage to remember

### Controls

- **Mouse Click**: Cast bobber, hook fish, advance menus
- **Arrow Keys or WASD**: Rhythm minigame controls
- **Left/A**: Hit left arrows
- **Up/W**: Hit up arrows
- **Down/S**: Hit down arrows
- **Right/D**: Hit right arrows

---

## ✨ Features

### Core Fishing Mechanics

- ✅ **Start Scene**: Title screen with click to start
- ✅ **Dock Scene**: Player on dock with animated fisherman
- ✅ **Fisherman Animations**: Idle, fishing, and hooking sprites
- ✅ **Click to Cast**: Cast bobber with mouse click
- ✅ **Auto-Return**: Bobber automatically sinks and returns
- ✅ **Collision Detection**: Bobber triggers minigames on fish contact
- ✅ **Score System**: Points based on fish type and rarity

### Two-Stage Catching System

- ✅ **Hook Timing Minigame**:
  - Popup with moving marker on timing bar
  - Click when marker is in green zone
  - Success proceeds to rhythm game
  - Failure causes fish to escape
  - Marker speed scales with fish speed (faster fish = harder timing)
- ✅ **Rhythm Minigame (DDR Style)**:
  - **Tutorial system**: First-time tutorial with instructions and OK button
  - **Countdown**: 3-2-1 countdown with animations before game starts
  - **localStorage**: Remembers if player has seen tutorial (shows only once)
  - Right half screen layout with 4 lanes
  - Arrows continuously spawn and fall to bottom
  - Yellow highlighted hit zone at bottom for easy visibility
  - Arrow Keys (←, ↑, ↓, →) or WASD controls
  - Forgiving 77px hit zone (51px above, 26px below center)
  - Required arrows based on fish health (3-5 typically)
  - 7-second base timer (no miss penalties)
  - Green horizontal progress bar shows completion
  - Visual feedback for hits/misses
  - Dead arrows cleaned from memory automatically
  - Win = catch fish, Lose = time runs out

### Day/Night Cycle

- Each day = 15 casts
- ✅ **15 Casts Per Day**: Evenly distributed across times
- ✅ **Four Times of Day**:
  - Morning (0-3 casts): Light blue sky
  - Afternoon (4-7 casts): Bright blue sky
  - Evening (8-11 casts): Orange/pink sky
  - Night (12-14 casts): Dark purple sky
- ✅ **Dynamic Sky Colors**: Real-time color transitions
- ✅ **UI Display**: Shows "Day X - Time" and "Casts: X/15"
- ✅ **Auto Market Transition**: After 15 casts, goes to market to start new day

### Market & Upgrade System

- ✅ **Market Scene**: Accessible via button or auto-transition after 15 casts
- ✅ **Custom Background Images**: Market dock and ocean backgrounds
- ✅ **Market Stalls**: 4 randomized shop stalls (from 12 available designs)
- ✅ **4 Shops**: Bait Shop, Line Shop, Rod Shop, Fish Buyer
- ✅ **Money System**: 1 fish point = $1 in cash
- ✅ **Auto Fish Sale**: Fish automatically sold when entering market
- ✅ **Three Upgrade Types**:
  - **Line Strength**: +2s rhythm timer per level (max 10 levels)
  - **Bait Quality**: +5% rare fish chance per level (max 10 levels)
  - **Rod Power**: +0.25x size multiplier per level (max 3 levels)
- ✅ **Progressive Costs**: Base price × 1.5^level
- ✅ **Persistent Data**: Money and upgrades saved in registry
- ✅ **Return to Dock**: Click "Return to Dock" to continue fishing
  - **Bait Quality**: +5% rare fish chance per level (max 10 levels)
  - **Rod Power**: +0.25x size multiplier per level (max 3 levels)
- ✅ **Progressive Costs**: Base price × 1.5^level
- ✅ **Persistent Data**: Money and upgrades saved in registry
- ✅ **Return to Dock**: Click "Return to Dock" to continue fishing
- ✅ **Main Fishing Scene**: Player on dock, bobber in water
- ✅ **Animated Fisherman**: Sprite animations for idle, fishing, and hooking
- ✅ **Casting Mechanic**: Left click to cast bobber down to sand
- ✅ **Auto-Return**: Bobber automatically returns after reaching bottom
- ✅ **Smooth Input**: Mouse click works perfectly without focus issues
- ✅ **Collision Detection**: Bobber catches fish on contact
- ✅ **Score System**: Points awarded based on fish type
  **Game Size**: 300x180 base (scales to 50% of window)
- **Engine**: Phaser 3 with Arcade Physics
- **Input**: Mouse click + Arrow Keys/WASD
- **Scenes**: Start → Dock → Minigame ⟷ Market
- **Assets**:
  - Fisherman sprite animations (idle, fish, hook)
  - 30+ unique fish sprites
  - Arrow images for rhythm minigame
  - Environment objects
- **Data Persistence**: Phaser Registry for score, money, upgradeeir movement direction
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

dockScene.js # Main fishing gameplay
├── minigame.js # Rhythm minigame (DDR style)
└── marketScene.js # Shop & upgradescene

- ✅ **4 Shops**: Bait Shop, Line Shop, Rod Shop, Fish Buyer

---

## 🎯 Game Flow

---

## ⚙️ Configuration

### Hook Timing Settings

Located in `dockScene.js`:

```javascript
// Marker speed calculation
markerSpeed = 150 + (fish.speed × 1.5)
successZoneWidth = 40px
barWidth = 160px
```

### Rhythm Minigame Settings

Located in `minigame.js`:

```javascript
MINIGAME_CONFIG = {
	INITIAL_TIME: 7, // Starting seconds
	MISS_PENALTY: 0.5, // Time lost per miss
	ARROW_SPEED: 100, // Pixels per second
	HIT_THRESHOLD: 25, // Hit detection margin
	LANE_SPACING: 40, // Space between lanes
};
```

### Day Cycle Settings

Located in `dockScene.js`:

```javascript
DAY_CYCLE_CONFIG = {
	CASTS_PER_DAY: 15,
	TIMES_OF_DAY: ["morning", "afternoon", "evening", "night"],
	// Morning: 0-3, Afternoon: 4-7, Evening: 8-11, Night: 12-14
};
```

### Fish Spawn Settings

Located in `dockScene.js`:

```javascript
GAME_CONFIG = {
  MIN_FISH_COUNT: 3,
  MAX_FISH_COUNT: 12,
  SPAWN_INTERVAL: 2000-5000ms,
  TRASH_SPAWN_CHANCE: 0.15,  // 15%
}
```

---

```
Start Scene
    ↓ (Click to Start)
Dock Scene (Fishing)
    ↓ (Cast bobber)
Bobber hits fish
    ↓
Hook Timing Popup
    ↓ (Success?)
   YES → Rhythm Minigame
           ↓ (Complete arrows?)
          YES → Fish Caught! (+Points)
          NO → Fish EscapedHook + Rhythm Minigame)** ✅ COMPLETED
    NO → Fish Escaped
    ↓Create two-stage skill-based catching mechanic

**Completed Tasks**:

**Hook Timing Minigame:**
1. ✅ Created hook timing popup overlay
2. ✅ Implemented timing bar with moving marker
3. ✅ Added green success zone in center
4. ✅ Marker speed scales with fish speed (faster fish = harder)
5. ✅ Click detection for hook attempt
6. ✅ Success/failure visual feedback
7. ✅ Transition to rhythm game on success
8. ✅ Fish escapes on failure

**Rhythm Minigame (DDR Style):**
9. ✅ Created dedicated minigame scene
10. ✅ Right half screen layout
11. ✅ 4 vertical lanes with hollow arrow markers
12. ✅ Falling arrow system with sprites
13. ✅ Arrow key detection (←, ↑, ↓, →)
14. ✅ WASD alternative controls (A, W, S, D)
15. ✅ Hit detection with forgiveness threshold
16. ✅ Visual feedback (green flash on hit, red on miss)
17. ✅ Fish health/arrow counter display
18. ✅ Countdown timer with miss penalties
19. ✅ Win condition: Hit all arrows before time expires
20. ✅ Lose condition: Time runs out
21. ✅ Return to dock scene with results
22. ✅ Score updates only on successful catch     ├── startScene.js   # Title screen
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
- **Pond**: Small peaceful fiLocations\*\* ⬅️ NEXT

**Goal**: Add different fishing locations and boat progression, Minnows)

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

### Fishing Screen

- **Left Click**: Cast bobber / Hook timing attempt

### Rhythm Minigame

- **Arrow Keys** (←, ↑, ↓, →): Hit falling arrows
- **WASD** (A, W, S, D): Alternative controls
  - A = Left
  - W = Up
  - S = Down
  - D = Right

### UI Navigation

- **Left Click**: Navigate menus, purchase upgradespawn logic, add trash spawn chance)

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

### Recent Changes (January 2026)

**Rhythm Minigame Improvements:**

- ✅ Added tutorial screen with instructions (shows only on first play)
- ✅ Implemented 3-2-1 countdown before game starts
- ✅ Tutorial state saved in localStorage (one-time display)
- ✅ Improved first-time player experience
- ✅ Two-stage catching system (hook timing + rhythm game)
- ✅ WASD controls alongside arrow keys
- ✅ Right-half screen layout for minigame

**Market Scene Enhancements:**

- ✅ Added custom market dock and ocean background images
- ✅ Integrated 12 unique market stall sprites (128x128 each)
- ✅ Randomized stall selection for 4 shops each visit
- ✅ Updated shop UI to use sprite images
- ⚠️ **Known Issue**: Spritesheet currently displaying full sheet instead of individual frames (debugging in progress)

**Day/Night Cycle:**

- ✅ Updated day cycle to 15 casts per day
- ✅ Auto-transition to market after completing day
- ✅ Marker speed scales with fish speed

### Known Issues

- ⚠️ Market stall sprites showing entire spritesheet instead of individual 128x128 frames
  - Spritesheet loaded correctly (4 rows × 3 columns, 384×512px total)
  - Frame selection logic implemented but not cropping to single frames
  - Shops are fully functional, visual issue only
  - Will be resolved in next session

### Code Organization

- All classes use config constants at top of file
- Asset placeholders ready for when you add images
- Easy to add new fish types in `FishTypes` object
- localStorage used for persistent tutorial state

- None currently

### Upcoming Features

- Different fishing locations (Lake, River, Ocean, Swamp)
- Boat upgrades to unlock new areas
- Weather system affecting fish behavior
- Sound effects and background music
- Particle effects (water splashes, sparkles)
- Enhanced animations
