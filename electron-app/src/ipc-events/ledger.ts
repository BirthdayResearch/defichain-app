import { ipcMain } from 'electron';
import { GET_LEDGER_DEFI_PUB_KEY } from '../constants';
import { responseMessage } from '../utils';
import Wallet from '../controllers/wallets';

const initiateLedger = () => {
  ipcMain.on(GET_LEDGER_DEFI_PUB_KEY, async (event: Electron.IpcMainEvent) => {
    try {
      const wallet = new Wallet();
      // TODO Replace the query logic when the connection is ready to Ledger
      event.returnValue = await wallet.connectHwWallet();
    } catch (err) {
      event.returnValue = responseMessage(false, {
        message: err.message,
      });
    }
  });
};

export default initiateLedger;
