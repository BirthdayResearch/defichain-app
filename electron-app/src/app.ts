import log from 'loglevel'
import * as path from 'path'
import * as url from 'url'
import { app, BrowserWindow, Menu, protocol } from 'electron'
import DefiProcessManager from './services/defiprocessmanager'
import ApplicationMenu from './menus/application'
import { Options, parseOptions } from './clioptions'
import { initiateIpcEvents } from './ipc-events/index'

declare var process: {
  argv: any
  env: {
    NODE_ENV: string
    npm_package_name: string
    [key: string]: string | undefined
  }
  platform: string
  mas: boolean
}

export default class App {
  mainWindow: Electron.BrowserWindow
  allowQuit: boolean
  parseOptions: Options

  constructor() {
    this.parseOptions = parseOptions()
    log.setDefaultLevel(this.parseOptions.logLevel)
    if (process.mas) app.setName(process.env.npm_package_name)
    this.allowQuit = false
  }

  // REMOVE MAGIC STRING
  run() {
    app.allowRendererProcessReuse = false
    app.on('ready', this.handleAppReady)
    app.on('window-all-closed', this.handleAllAppWindowClose)
    app.on('activate', this.handleAppActivate)
    this.makeSingleInstance()
  }

  handleAppReady = () => {
    this.interceptFileProtocol()
    this.createWindow()
    this.createMenu()
    // initiate ipcMain events
    initiateIpcEvents()
  }

  interceptFileProtocol() {
    protocol.interceptFileProtocol('file', (request, callback) => {
      /* all urls start with 'file://' */
      const fileUrl = request.url.substr(7)
      if (process.env.NODE_ENV === 'development') {
        callback(
          path.normalize(
            `${__dirname}/../../../webapp/build/release/${fileUrl}`
          )
        )
      } else {
        callback(path.normalize(`${__dirname}/../../../webapp/${fileUrl}`))
      }
    })
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      minWidth: 640,
      minHeight: 480,
      title: app.name,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#F4F3F6',
      movable: true,
      icon: path.join(__dirname, '/electron-app/assets/icon/icon-512.png'),
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    })

    const loadUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: './index.html',
        protocol: 'file:',
        slashes: true,
      })

    this.mainWindow.loadURL(loadUrl)

    if (this.parseOptions.debug) {
      this.mainWindow.webContents.openDevTools()
    }

    this.mainWindow.on('close', this.handleMainWindowClose)
  }

  // Create menu
  createMenu() {
    const applicationMenu = new ApplicationMenu()
    const template = applicationMenu.getTemplate()
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  // When app will close
  handleAllAppWindowClose = () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  handleAppActivate = () => {
    if (this.mainWindow === null) {
      this.createWindow()
    }
  }

  makeSingleInstance() {
    if (process.mas) return
    app.requestSingleInstanceLock()
    app.on('second-instance', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore()
        this.mainWindow.focus()
      }
    })
  }

  handleMainWindowClose = async (event: Electron.Event) => {
    if (this.allowQuit) {
      app.quit()
      return (this.mainWindow = null)
    }
    // Stop all process before quit
    this.mainWindow.hide()
    event.preventDefault()
    const defiProcessManager = new DefiProcessManager()
    await defiProcessManager.stop()
    this.allowQuit = true
    return app.quit()
  }
}
