import log from 'loglevel';
import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, Menu, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';

import DefiProcessManager from './services/defiprocessmanager';
import AppMenu from './menus';
import { Options, parseOptions } from './clioptions';
import { initiateIpcEvents } from './ipc-events/index';
import {
  ICON,
  DARWIN,
  TITLE_BAR_STYLE,
  BACKGROUND_COLOR,
  READY,
  WINDOW_ALL_CLOSED,
  ACTIVATE,
  CLOSE,
  SECOND_INSTANCE,
  STOP_BINARY_AND_QUEUE,
} from './constants';
import initiateElectronUpdateManager from './ipc-events/electronupdatemanager';
import ElectronLogger from './services/electronLogger';
import initiateBackupImportWalletManager from './ipc-events/backupAndImportWallet';
import { createMnemonicAction } from './ipc-events/createMnemonic';

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

export default class App {
  mainWindow: Electron.BrowserWindow;
  allowQuit: boolean;
  parseOptions: Options;

  constructor() {
    this.parseOptions = parseOptions();
    log.setDefaultLevel(this.parseOptions.logLevel);
    if (process.mas) app.setName(process.env.npm_package_name);
    this.allowQuit = false;
    autoUpdater.autoDownload = false;
    autoUpdater.logger = ElectronLogger;
    /* For future purpose */
  }

  run() {
    app.allowRendererProcessReuse = false;
    app.on(READY, this.onAppReady);
    app.on(WINDOW_ALL_CLOSED, this.onAllAppWindowClose);
    app.on(ACTIVATE, this.onAppActivate);
    this.makeSingleInstance();
  }

  onAppReady = () => {
    this.initiateInterceptFileProtocol();
    this.createWindow();
    this.createMenu();
    // initiate ipcMain events
    initiateIpcEvents(autoUpdater);

    /* For future purpose */
    autoUpdater.checkForUpdatesAndNotify().catch((e) => {
      log.error(e);
    });
    initiateElectronUpdateManager(autoUpdater, this.mainWindow);
    initiateBackupImportWalletManager(this.mainWindow);
    createMnemonicAction();
  };

  initiateInterceptFileProtocol() {
    protocol.interceptFileProtocol('file', (request, callback) => {
      /* all urls start with 'file://' */
      const fileUrl = request.url.substr(7);
      const basePath = path.normalize(`${__dirname}/../../../webapp`);
      if (process.env.NODE_ENV === 'development') {
        callback(path.normalize(`${basePath}/build/release/${fileUrl}`));
      } else {
        callback(path.normalize(`${basePath}/${fileUrl}`));
      }
    });
  }

  createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      minWidth: 640,
      minHeight: 480,
      title: app.name,
      titleBarStyle: TITLE_BAR_STYLE,
      backgroundColor: BACKGROUND_COLOR,
      movable: true,
      icon: ICON,
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
      },
    });

    const loadUrl =
      process.env.ELECTRON_START_URL ||
      url.format({
        pathname: './index.html',
        protocol: 'file:',
        slashes: true,
      });

    this.mainWindow.loadURL(loadUrl);

    if (this.parseOptions.debug) {
      this.mainWindow.webContents.openDevTools();
    }

    /* Only for alpha and beta releases
       Remove this disclaimer dialog later
    */

    this.mainWindow.on(CLOSE, this.onMainWindowClose);
  }

  // Create menu
  createMenu() {
    const appMenu = new AppMenu();
    const template = appMenu.getTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  // When app will close
  onAllAppWindowClose = () => {
    if (process.platform !== DARWIN) {
      app.quit();
    }
  };

  onAppActivate = () => {
    if (this.mainWindow === null) {
      this.createWindow();
    }
  };

  makeSingleInstance() {
    if (process.mas) return;
    app.requestSingleInstanceLock();
    app.on(SECOND_INSTANCE, () => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.focus();
      }
    });
  }

  onMainWindowClose = async (event: Electron.Event) => {
    if (this.allowQuit) {
      app.quit();
      return (this.mainWindow = null);
    }
    // Stop all process before quit
    this.mainWindow.webContents.send(STOP_BINARY_AND_QUEUE);

    this.mainWindow.hide();
    event.preventDefault();
    await DefiProcessManager.stop();
    this.allowQuit = true;
    return app.quit();
  };
}
