const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const tauriConfigPath = path.join(root, "src-tauri", "tauri.conf.json");
const releaseDir = path.join(root, "release", "tightlines");
const targetReleaseDir = path.join(root, "src-tauri", "target", "release");

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sanitizeName(input) {
	return String(input || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.trim();
}

function pickExecutable(config) {
	if (!fs.existsSync(targetReleaseDir)) {
		throw new Error(
			"Tauri release output folder was not found. Run a Tauri build first.",
		);
	}

	const productName = sanitizeName(config.productName);
	const preferred = [
		"tightlines.exe",
		"tight-lines-game.exe",
		"app.exe",
		productName ? `${productName}.exe` : null,
	].filter(Boolean);

	for (const name of preferred) {
		const full = path.join(targetReleaseDir, name);
		if (fs.existsSync(full)) {
			return full;
		}
	}

	const exeCandidates = fs
		.readdirSync(targetReleaseDir)
		.filter((name) => name.toLowerCase().endsWith(".exe"))
		.filter((name) => !name.toLowerCase().includes("unins"))
		.map((name) => {
			const full = path.join(targetReleaseDir, name);
			const stats = fs.statSync(full);
			return { full, mtimeMs: stats.mtimeMs };
		})
		.sort((a, b) => b.mtimeMs - a.mtimeMs);

	if (exeCandidates.length === 0) {
		throw new Error(
			"No Windows executable found in src-tauri/target/release. Build on Windows using: npm run tauri:build:bin",
		);
	}

	return exeCandidates[0].full;
}

function writeLauncherBat(outExeName) {
	const launcher = [
		"@echo off",
		"setlocal",
		'set "DIR=%~dp0"',
		`set \"GAME_EXE=%DIR%${outExeName}\"`,
		"",
		'if not exist "%GAME_EXE%" (',
		"  echo Could not find %GAME_EXE%",
		"  pause",
		"  exit /b 1",
		")",
		"",
		'start "" "%GAME_EXE%"',
		"exit /b 0",
		"",
	].join("\r\n");

	fs.writeFileSync(path.join(releaseDir, "tightlines.bat"), launcher, "utf8");
}

function writeReadme() {
	const text = [
		"Tight Lines - Portable Windows Build",
		"",
		"How to run:",
		"1. Double-click tightlines.exe",
		"   or",
		"2. Double-click tightlines.bat",
		"",
		"If Windows SmartScreen appears, choose More info > Run anyway.",
		"",
	].join("\n");

	fs.writeFileSync(path.join(releaseDir, "README-PLAY.txt"), text, "utf8");
}

function main() {
	if (process.platform !== "win32") {
		throw new Error(
			"Windows portable packaging must be run on Windows so a .exe is produced.",
		);
	}

	if (!fs.existsSync(tauriConfigPath)) {
		throw new Error("src-tauri/tauri.conf.json not found.");
	}

	const config = readJson(tauriConfigPath);
	const sourceExe = pickExecutable(config);

	fs.mkdirSync(releaseDir, { recursive: true });

	const outExeName = "tightlines.exe";
	const outExePath = path.join(releaseDir, outExeName);

	fs.copyFileSync(sourceExe, outExePath);
	writeLauncherBat(outExeName);
	writeReadme();

	console.log(`Portable folder ready: ${path.relative(root, releaseDir)}`);
	console.log(`Executable: ${path.relative(root, outExePath)}`);
}

try {
	main();
} catch (error) {
	console.error(error.message || error);
	process.exit(1);
}
