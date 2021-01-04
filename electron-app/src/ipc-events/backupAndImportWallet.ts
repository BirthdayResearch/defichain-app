import { ipcMain } from 'electron';
import {
  WALLET_BACKUP,
  BACKUP_WALLET_DAT,
  REPLACE_WALLET_DAT,
  ENABLE_RESET_MENU,
} from '../constants';
import Wallet from '../controllers/wallets';
import { responseMessage } from '../utils';

const initiateBackupImportWalletManager = (
  bw: Electron.BrowserWindow,
  createMenu: Function
) => {
  ipcMain.on(WALLET_BACKUP, async (event: Electron.IpcMainEvent) => {
    const wallet = new Wallet();
    event.returnValue = await wallet.backup(bw);
  });

  ipcMain.on(BACKUP_WALLET_DAT, async (event: Electron.IpcMainEvent) => {
    try {
      const wallet = new Wallet();
      await wallet.backupWalletDat();
      event.returnValue = responseMessage(true, {});
    } catch (err) {
      event.returnValue = responseMessage(false, {
        message: err.message,
      });
    }
  });

  ipcMain.on(REPLACE_WALLET_DAT, async (event: Electron.IpcMainEvent) => {
    try {
      const wallet = new Wallet();
      await wallet.replaceWalletDat();
      event.returnValue = responseMessage(true, {});
    } catch (err) {
      event.returnValue = responseMessage(false, {
        message: err.message,
      });
    }
  });

  ipcMain.on(
    ENABLE_RESET_MENU,
    async (event: Electron.IpcMainEvent, arg: any) => {
      try {
        createMenu(arg?.isWalletCreatedFlag);
      } catch (err) {
        console.log(err);
      }
    }
  );
};

export default initiateBackupImportWalletManager;
