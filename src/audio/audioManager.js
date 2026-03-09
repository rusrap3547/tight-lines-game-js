import Phaser from "phaser";

const AUDIO_SETTINGS_STORAGE_KEY = "tight-lines-audio-settings";
const DEFAULT_MUSIC_VOLUME = 0.35;
const DEFAULT_SFX_VOLUME = 1;

export const ALL_MUSIC_TRACKS = Array.from({ length: 11 }, (_, index) => {
	const paddedIndex = String(index).padStart(2, "0");
	return {
		key: `music_freshwater_${paddedIndex}`,
		path: `assets/Music/freshwater${paddedIndex}.wav`,
	};
});

const MUSIC_KEYS = new Set(ALL_MUSIC_TRACKS.map((track) => track.key));

const SCENE_PLAYLISTS = {
	startScene: [0, 1, 2],
	DockScene: [3, 4, 5, 6],
	MarketScene: [7, 8],
	Minigame: [9, 10],
	TutorialScene: [0, 1, 2],
	EncyclopediaScene: [7, 8],
};

const clampVolume = (value) => Phaser.Math.Clamp(Number(value) || 0, 0, 1);

const readStoredSettings = () => {
	try {
		const raw = window.localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
		if (!raw) {
			return null;
		}

		const parsed = JSON.parse(raw);
		if (
			typeof parsed !== "object" ||
			parsed === null ||
			Array.isArray(parsed)
		) {
			return null;
		}

		return {
			musicVolume: clampVolume(parsed.musicVolume),
			sfxVolume: clampVolume(parsed.sfxVolume),
		};
	} catch {
		return null;
	}
};

const writeStoredSettings = (settings) => {
	try {
		window.localStorage.setItem(
			AUDIO_SETTINGS_STORAGE_KEY,
			JSON.stringify(settings),
		);
	} catch {
		// Ignore storage failures (private mode, blocked storage, etc.)
	}
};

export const ensureAudioSettings = (scene) => {
	if (scene.registry.has("musicVolume") && scene.registry.has("sfxVolume")) {
		return;
	}

	const stored = readStoredSettings();
	const musicVolume = stored ? stored.musicVolume : DEFAULT_MUSIC_VOLUME;
	const sfxVolume = stored ? stored.sfxVolume : DEFAULT_SFX_VOLUME;

	scene.registry.set("musicVolume", musicVolume);
	scene.registry.set("sfxVolume", sfxVolume);
};

export const preloadAllMusic = (scene) => {
	ALL_MUSIC_TRACKS.forEach((track) => {
		if (!scene.cache.audio.exists(track.key)) {
			scene.load.audio(track.key, track.path);
		}
	});
};

const getScenePlaylistKeys = (sceneKey) => {
	const playlistIndexes =
		SCENE_PLAYLISTS[sceneKey] || SCENE_PLAYLISTS.startScene;
	return playlistIndexes.map((index) => ALL_MUSIC_TRACKS[index].key);
};

const getCurrentMusic = (scene) => {
	return scene.sound
		.getAll()
		.find((sound) => sound.isPlaying && MUSIC_KEYS.has(sound.key));
};

const setMusicVolumeForActiveTracks = (scene, musicVolume) => {
	scene.sound.getAll().forEach((sound) => {
		if (MUSIC_KEYS.has(sound.key)) {
			sound.setVolume(musicVolume);
		}
	});
};

const setSfxVolumeForActiveSounds = (scene, sfxVolume) => {
	scene.sound.getAll().forEach((sound) => {
		if (!MUSIC_KEYS.has(sound.key)) {
			sound.setVolume(sfxVolume);
		}
	});
};

const persistAudioSettings = (scene) => {
	const settings = {
		musicVolume: getMusicVolume(scene),
		sfxVolume: getSfxVolume(scene),
	};
	writeStoredSettings(settings);
};

export const getMusicVolume = (scene) => {
	ensureAudioSettings(scene);
	return clampVolume(scene.registry.get("musicVolume"));
};

export const getSfxVolume = (scene) => {
	ensureAudioSettings(scene);
	return clampVolume(scene.registry.get("sfxVolume"));
};

export const setMusicVolume = (scene, value) => {
	const nextVolume = clampVolume(value);
	scene.registry.set("musicVolume", nextVolume);
	setMusicVolumeForActiveTracks(scene, nextVolume);
	persistAudioSettings(scene);
};

export const setSfxVolume = (scene, value) => {
	const nextVolume = clampVolume(value);
	scene.registry.set("sfxVolume", nextVolume);
	setSfxVolumeForActiveSounds(scene, nextVolume);
	persistAudioSettings(scene);
};

export const playSceneMusic = (scene, sceneKey) => {
	ensureAudioSettings(scene);
	const musicVolume = getMusicVolume(scene);
	const playlist = getScenePlaylistKeys(sceneKey);
	const currentMusic = getCurrentMusic(scene);

	if (currentMusic && playlist.includes(currentMusic.key)) {
		currentMusic.setVolume(musicVolume);
		return;
	}

	scene.sound.getAll().forEach((sound) => {
		if (MUSIC_KEYS.has(sound.key)) {
			sound.stop();
		}
	});

	const selectedKey = Phaser.Utils.Array.GetRandom(playlist);
	const music = scene.sound.add(selectedKey, {
		loop: true,
		volume: musicVolume,
	});

	music.play();
};
