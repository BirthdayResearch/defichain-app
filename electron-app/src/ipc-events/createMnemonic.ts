import { ipcMain } from 'electron';
import { CREATE_MNEMONIC } from '@defi_types/ipcEvents';
import Mnemonic from '../mnemonic';
import { writeToConfigFile } from '../controllers/wallets';

export const createMnemonicAction = () => {
  ipcMain.on(CREATE_MNEMONIC, (event: Electron.IpcMainEvent, args) => {
    const { mnemonic: menemonicData, network, networkType } = args;
    const mnemonicObj = new Mnemonic();
    const seed = mnemonicObj.createSeed(menemonicData);
    const root = mnemonicObj.createRoot(seed, network);
    writeToConfigFile(null, networkType);
    event.returnValue = root.toWIF();
  });
};
