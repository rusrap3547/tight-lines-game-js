# Tight Lines - Phaser Fishing Game

Tight Lines is a Phaser 3 fishing game with a two-stage catch flow:

1. Hook timing check in the dock scene.
2. Rhythm minigame to reel fish in.

## Project Status

- Branch: `main`
- Working tree: clean
- Last synced with remote: yes
- Last completed commit: `9ec9a02` - "Added music"

### What Was Last Done

The latest completed work was a full background music/audio settings pass:

- Added shared audio manager: `src/audio/audioManager.js`
- Added 11 music tracks: `assets/Music/freshwater00.wav` to `assets/Music/freshwater10.wav`
- Wired scene music playback into:
  - `startScene`
  - `DockScene`
  - `MarketScene`
  - `Minigame`
- Added options menu sliders in the start screen for:
  - Music volume
  - SFX volume
- Persisted audio settings in `localStorage`

### Previous Milestone

The commit before music was `abd8ef4` - "Updated the shop area and fixed a few visual bugs".

## Current Gameplay Flow

1. Start screen menu (`startScene`)
2. Enter dock fishing (`DockScene`)
3. Cast bobber and collide with fish/trash
4. Hook timing popup check
5. On success -> rhythm minigame (`Minigame`)
6. Catch success adds points/fish value
7. Day progresses by cast count
8. After day casts are complete, move to market (`MarketScene`)
9. Sell fish / buy upgrades / return to dock

## Implemented Systems

- Scene-based game architecture (Phaser)
- Start menu with New Game, Tutorial, Encyclopedia, Options, Exit
- Dock fishing with cast cycle and bobber behavior
- Hook timing challenge before minigame
- Rhythm minigame with arrow lanes and timing window
- Day/time progression in dock scene
- Market scene with upgrade economy
- Shared music manager and per-scene playlists
- Persistent audio settings (music + SFX)

## Controls

- Mouse: menu navigation, casting, popup interaction
- Arrow keys or WASD: rhythm minigame inputs

## Tech Stack

- Phaser `^3.90.0`
- Vite `^7.3.0`

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Key Source Files

- `src/index.js` - Phaser config and scene registration
- `src/gameObjects.js` - core game object classes/data
- `src/audio/audioManager.js` - music loading/playback + volume persistence
- `src/scenes/startScene.js` - main menu + options UI
- `src/scenes/dockScene.js` - fishing gameplay loop
- `src/scenes/minigame.js` - rhythm catch minigame
- `src/scenes/marketScene.js` - shops/upgrades/economy
- `src/scenes/tutorialScene.js` - tutorial flow
- `src/scenes/encyclopediaScene.js` - fish/collection information UI

## Suggested Next Work

The tackle system and minigame are already implemented, so focus next on polish and progression:

1. Add/standardize SFX calls (cast, hook success/fail, catch, buy upgrade, UI click).
2. Document and tune fish rarity/point economy in one centralized table.
3. Add lightweight automated checks (lint/format) to keep scene files maintainable.
4. Improve README asset section with screenshots/GIFs for menu, dock, minigame, and market.
5. Optional: add weather/location progression as the next major feature set.
