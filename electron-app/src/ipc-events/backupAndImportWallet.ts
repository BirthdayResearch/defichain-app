import { ipcMain } from 'electron';
import { WALLET_BACKUP } from '../constants';
import Wallet from '../controllers/wallets';

const initiateBackupImportWalletManager = (bw: Electron.BrowserWindow) => {
  ipcMain.on(WALLET_BACKUP, async (event: Electron.IpcMainEvent) => {
    const wallet = new Wallet();
    event.returnValue = await wallet.backup(bw);
  });
};

export default initiateBackupImportWalletManager;
