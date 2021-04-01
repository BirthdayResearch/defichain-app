import { app, shell } from 'electron';
import Wallet from '../controllers/wallets';
import {
  DARWIN,
  WIN_32,
  LINUX,
  DEBUG_LOG_FILE_PATH,
  CONFIG_FILE_PATH,
} from '../constants';
import { logFilePath } from '../services/electronLogger';
import Logs from '../controllers/logs';
import { LICENSE_URL, RELEASE_NOTES_URL, SITE_URL } from '@defi_types/settings';

export default class AppMenu {
  getTemplate(isWalletLoaded?: boolean) {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Wallet',
        submenu: [
          {
            label: 'Backup Wallet',
            enabled: !!isWalletLoaded,
            click(item, bw) {
              const wallet = new Wallet();
              wallet.startBackupWallet(bw);
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
          },
          {
            label: 'Redo',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo',
          },
          {
            type: 'separator',
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectAll',
          },
        ],
      },
      {
        label: 'Logs',
        submenu: [
          {
            label: 'App Logs',
            click: async () => {
              const srcFilePath = logFilePath();
              const logs = new Logs();

              const data = await logs.read(srcFilePath);
              await logs.download(data, '.log');
            },
          },
          {
            label: 'Binary Logs',
            click: async () => {
              const logs = new Logs();
              const data = await logs.read(DEBUG_LOG_FILE_PATH);
              await logs.download(data, '.log');
            },
          },
          {
            label: 'App Config',
            click: async () => {
              const logs = new Logs();
              const data = await logs.read(CONFIG_FILE_PATH);
              await logs.download(data, '.conf');
            },
          },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          {
            label: 'Visit our site',
            click: async () => {
              await shell.openExternal(SITE_URL);
            },
          },
        ],
      },
    ];

    if (process.platform === DARWIN) {
      const label = app.name;
      const submenu: Electron.MenuItemConstructorOptions[] = [
        {
          label: `About ${label}`,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${label}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ];

      template.unshift({
        label,
        submenu,
      });

      this.addUpdateMenuItems(template[0].submenu, 1);
    }

    if (process.platform === WIN_32 || process.platform === LINUX) {
      const helpMenu = template[template.length - 1].submenu;
      this.addUpdateMenuItems(helpMenu, 0);
    }

    return template;
  }

  addUpdateMenuItems(items: any, position: any) {
    if (process.mas) return;

    const version = app.getVersion();
    const updateItems = [
      {
        label: `Version ${version}`,
        enabled: false,
      },
      {
        label: `Release notes`,
        click: async () => {
          await shell.openExternal(`${RELEASE_NOTES_URL}${version}`);
        },
      },
      {
        label: `Licenses`,
        click: async () => {
          await shell.openExternal(`${LICENSE_URL}${version}/LICENSE`);
        },
      },
    ];
    if (items) items.splice.apply(items, [position, 0].concat(updateItems));
  }
}
