const { app, BrowserWindow, protocol } = require('electron')
const path = require('path')
const url = require('url')
const debug = /--debug/.test(process.argv[2]);
const glob = require("glob");

let mainWindow
if (process.mas) app.setName(process.env.npm_package_name);

function createWindow() {
  makeSingleInstance();

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 640,
    minHeight: 480,
    title: app.getName(),
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F4F3F6',
    movable: true,
    icon: path.join(__dirname, "/electron-app/assets/icon/icon-512.png"),
    webPreferences: {
      nodeIntegration: true,
    }
  })
  loadDemos()
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: './index.html',
      protocol: 'file:',
      slashes: true
    })
  )

  if (debug) {
    mainWindow.webContents.openDevTools()
  }


  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.allowRendererProcessReuse = false;
app.on('ready', () => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7) /* all urls start with 'file://' */

    callback({ path: path.normalize(`${__dirname}/build/release/${url}`) })
  },
    (err) => { if (err) console.error('Failed to register protocol') })
  createWindow() /* callback function */
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
function loadDemos() {
  const files = glob.sync(path.join(__dirname, "electron-app/**/*.js"));
  files.forEach(file => {
    require(file);
  });
}

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
