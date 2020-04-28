import log from "loglevel";
import { app, BrowserWindow, protocol } from "electron";
import * as path from "path";
import * as url from "url";
import ProcessManager from "./src/services/processmanager";
import "./src/index";
log.setDefaultLevel(5);

declare var process: {
  argv: any;
  env: {
    NODE_ENV: string;
    npm_package_name: string;
    [key: string]: string | undefined;
  };
  platform: string;
  mas: boolean;
};

let mainWindow: any;
let allowQuit = false;

if (process.mas) app.setName(process.env.npm_package_name);

const debug = /--debug/.test(process.argv[2]);

function createWindow() {
  makeSingleInstance();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 640,
    minHeight: 480,
    title: app.getName(),
    titleBarStyle: "hiddenInset",
    backgroundColor: "#F4F3F6",
    movable: true,
    icon: path.join(__dirname, "/electron-app/assets/icon/icon-512.png"),
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // loadApp();
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: "./index.html",
        protocol: "file:",
        slashes: true,
      })
  );

  if (debug) {
    mainWindow.webContents.openDevTools();
    log.setLevel(0);
  }

  mainWindow.on("close", async (event: { preventDefault: () => void }) => {
    if (allowQuit) {
      app.quit();
      return (mainWindow = null);
    }
    // Stop all process before quit
    mainWindow.hide();
    event.preventDefault();
    const processManager = new ProcessManager();
    await processManager.stop();
    allowQuit = true;
    return app.quit();
  });
}

app.allowRendererProcessReuse = false;

app.on("ready", () => {
  protocol.interceptFileProtocol(
    "file",
    (request, callback) => {
      const fileUrl = request.url.substr(7); /* all urls start with "file://" */
      if (process.env.NODE_ENV === "development") {
        callback(
          path.normalize(`${__dirname}/../../webapp/build/release/${fileUrl}`)
        );
      } else {
        callback(path.normalize(`${__dirname}/../../webapp/${fileUrl}`));
      }
    },
    (err: any) => {
      if (err) log.error("Failed to register protocol");
    }
  );
  createWindow(); /* callback function */
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// function loadApp() {
//   require(path.join(__dirname, "electron-app/js/index.js"));
// }

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return;

  app.requestSingleInstanceLock();

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
