import { ipcMain } from 'electron';
import Uiconfig from '../services/uiconfig';
import { GET_CONFIG_DETAILS } from '@defi_types/ipcEvents';
import { responseMessage } from '../utils';

export default function initiateUiConfig() {
  ipcMain.on(GET_CONFIG_DETAILS, async (event) => {
    try {
      const uiConfig = new Uiconfig();
      const res = await uiConfig.get();
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });
}
