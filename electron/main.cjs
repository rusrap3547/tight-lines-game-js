const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;
const distIndexPath = path.join(__dirname, "..", "dist", "index.html");

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 960,
		minHeight: 540,
		backgroundColor: "#111111",
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	const loadDist = () => win.loadFile(distIndexPath);

	win.webContents.on(
		"did-fail-load",
		(event, errorCode, errorDescription, validatedURL, isMainFrame) => {
			if (!isMainFrame) {
				return;
			}

			console.error(
				`Renderer failed to load (${errorCode}): ${errorDescription} (${validatedURL})`,
			);

			if (isDev && validatedURL.startsWith("http://localhost:5173")) {
				console.log("Falling back to local dist build.");
				loadDist();
			}
		},
	);

	win.webContents.on("render-process-gone", (_event, details) => {
		console.error("Renderer process exited:", details);
	});

	if (isDev) {
		win.loadURL("http://localhost:5173");
		win.webContents.openDevTools({ mode: "detach" });
	} else {
		loadDist();
	}
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
