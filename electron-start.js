const { app, BrowserWindow, protocol } = require('electron')

const path = require('path')
const url = require('url')
const debug = /--debug/.test(process.argv[2]);

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 640,
    minHeight: 480,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#F4F3F6',
    movable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

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
