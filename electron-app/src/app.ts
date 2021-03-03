import log from 'loglevel';
import * as path from 'path';
import * as os from 'os';
import osName from 'os-name';
import * as url from 'url';
import { app, BrowserWindow, ipcMain, Menu, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';

import DefiProcessManager from './services/defiprocessmanager';
import AppMenu from './menus';
import { Options, parseOptions } from './clioptions';
import { initiateIpcEvents } from './ipc-events/index';
import {
  ICON,
  TITLE_BAR_STYLE,
  BACKGROUND_COLOR,
  READY,
  ACTIVATE,
  CLOSE,
  SECOND_INSTANCE,
  APP_SHUTDOWN_TIMEOUT,
} from './constants';
import initiateElectronUpdateManager from './ipc-events/electronupdatemanager';
import ElectronLogger from './services/electronLogger';
import initiateBackupImportWalletManager from './ipc-events/backupAndImportWallet';
import { createMnemonicAction } from './ipc-events/createMnemonic';
import {
  CLOSE_APP,
  ON_CLOSE_RPC_CLIENT,
  STOP_BINARY_AND_QUEUE,
  APP_INIT,
} from '@defi_types/ipcEvents';
import { LOGGING_SHUT_DOWN } from '@defi_types/loggingMethodSource';
import { checkWalletConfig, initializeWalletMap } from './controllers/wallets';
import Uiconfig from './services/uiconfig';

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
  isAppInitialized: boolean;
  parseOptions: Options;
  isDevMode: boolean;

  constructor() {
    this.isDevMode = process.env.NODE_ENV === 'development';
    this.parseOptions = parseOptions();
    log.setDefaultLevel(this.parseOptions.logLevel);
    if (process.mas) app.setName(process.env.npm_package_name);
    this.allowQuit = false;
    this.isAppInitialized = false;
    autoUpdater.autoDownload = false;
    autoUpdater.logger = ElectronLogger;
    /* For future purpose */
  }

  async run() {
    /* Create config file if not existing */
    const uiConfig = new Uiconfig();
    await uiConfig.get();
    app.allowRendererProcessReuse = false;
    app.on(READY, this.onAppReady);
    app.on(ACTIVATE, this.onAppActivate);
    this.makeSingleInstance();
    this.setNodeEvents();
    checkWalletConfig();
  }

  onAppReady = async () => {
    this.initiateInterceptFileProtocol();
    await this.createWindow();
    this.createMenu();
    // initiate ipcMain events
    initiateIpcEvents(autoUpdater);

    /* For future purpose */
    autoUpdater.checkForUpdatesAndNotify().catch((e) => {
      ElectronLogger.error(e);
    });
    initiateElectronUpdateManager(autoUpdater, this.mainWindow);
    initiateBackupImportWalletManager(
      this.mainWindow,
      this.createMenu.bind(this)
    );
    createMnemonicAction();
    initializeWalletMap();
  };

  initiateInterceptFileProtocol() {
    protocol.interceptFileProtocol('file', (request, callback) => {
      /* all urls start with 'file://' */
      const fileUrl = request.url.substr(7);
      const basePath = path.normalize(`${__dirname}/../../../../webapp`);
      if (this.isDevMode) {
        callback(path.normalize(`${basePath}/build/release/${fileUrl}`));
      } else {
        callback(path.normalize(`${basePath}/${fileUrl}`));
      }
    });
  }

  installDevelopmentTools = async () => {
    require('electron-debug')();
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS',
      'REACT_PERF',
    ];

    return (
      installer
        .default(
          extensions.map((name) => installer[name]),
          forceDownload
        )
        // tslint:disable-next-line:no-console
        .catch(console.log)
    );
  };

  createWindow = async () => {
    if (this.isDevMode) {
      await this.installDevelopmentTools();
    }
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
        enableRemoteModule: true,
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

    this.mainWindow.on(CLOSE, this.onMainWindowClose);
    ElectronLogger.info(
      `[Starting Electron App] OS ${osName()} - ${os.release()}`
    );
  };

  // Create menu
  createMenu(isWalletLoaded?: boolean) {
    const appMenu = new AppMenu();
    const template = appMenu.getTemplate(isWalletLoaded);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

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

  closeWindowAndQuitApp = () => {
    ElectronLogger.info(`[${LOGGING_SHUT_DOWN}] Closing app...`);
    this.mainWindow.hide();
    this.allowQuit = true;
    return app.quit();
  };

  setNodeEvents = async (): Promise<any> => {
    ipcMain.on(ON_CLOSE_RPC_CLIENT, async () => {
      try {
        ElectronLogger.info(
          `[${LOGGING_SHUT_DOWN}] Terminating Node Connection`
        );
        await DefiProcessManager.stop();
        ElectronLogger.info(
          `[${LOGGING_SHUT_DOWN}] Node connection has been closed`
        );
        this.closeWindowAndQuitApp();
      } catch (error) {
        ElectronLogger.error(error);
        this.closeWindowAndQuitApp();
      }
    });

    ipcMain.on(CLOSE_APP, this.onMainWindowClose);

    ipcMain.on(APP_INIT, () => {
      this.isAppInitialized = true;
    });
  };

  onMainWindowClose = async (event: Electron.Event): Promise<any> => {
    if (this.allowQuit || !this.isAppInitialized) {
      app.quit();
      return (this.mainWindow = null);
    }
    ElectronLogger.info(`[${LOGGING_SHUT_DOWN}] Starting shut down process`);
    setTimeout(() => {
      ElectronLogger.info(
        `[${LOGGING_SHUT_DOWN}] 5 minutes elapsed, force closing app`
      );
      this.closeWindowAndQuitApp();
    }, APP_SHUTDOWN_TIMEOUT);
    // Stop all process before quit
    this.mainWindow.webContents.send(STOP_BINARY_AND_QUEUE);
    event.preventDefault();
  };
}
