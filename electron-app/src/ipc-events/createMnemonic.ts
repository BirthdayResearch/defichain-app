import { ipcMain } from 'electron';
import { CREATE_MNEMONIC } from '../constants';
import Mnemonic from '../mnemonic';

export const createMnemonicAction = () => {
  ipcMain.on(CREATE_MNEMONIC, (event: Electron.IpcMainEvent, args) => {
    const { mnemonic: menemonicData, network } = args;
    const mnemonicObj = new Mnemonic();
    const seed = mnemonicObj.createSeed(menemonicData);
    const root = mnemonicObj.createRoot(seed, network);
    event.returnValue = root.toWIF();
  });
};
