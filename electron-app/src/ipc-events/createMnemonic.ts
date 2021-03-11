import path from 'path';
import { ipcMain } from 'electron';
import { CREATE_MNEMONIC } from '@defi_types/ipcEvents';
import Mnemonic from '../mnemonic';
import { writeToConfigFile } from '../controllers/wallets';
import { getBaseFolder } from '../utils';
import { WALLET_DAT } from '@defi_types/fileExtensions';

export const createMnemonicAction = () => {
  ipcMain.on(CREATE_MNEMONIC, (event: Electron.IpcMainEvent, args) => {
    const { mnemonic: menemonicData, network, networkType } = args;
    const mnemonicObj = new Mnemonic();
    const seed = mnemonicObj.createSeed(menemonicData);
    const root = mnemonicObj.createRoot(seed, network);
    const filePath = path.join(getBaseFolder(), WALLET_DAT);
    const parsedPath = path.parse(filePath);
    writeToConfigFile(parsedPath, networkType);
    event.returnValue = root.toWIF();
  });
};
