import { ipcMain } from 'electron';
import AutoStart from '../services/autostart';
import { responseMessage } from '../utils';
import {
  PRELAUNCH_PREFERENCE_DISABLE,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_STATUS,
} from '@defi_types/ipcEvents';

export default function initiateAutoStart() {
  ipcMain.on(PRELAUNCH_PREFERENCE_STATUS, async (event) => {
    try {
      const autoStart = new AutoStart();
      const res = await autoStart.get();
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });

  ipcMain.on(PRELAUNCH_PREFERENCE_ENABLE, async (event, arg) => {
    try {
      const autoStart = new AutoStart();
      const res = await autoStart.set(true, arg.minimize);
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });

  ipcMain.on(PRELAUNCH_PREFERENCE_DISABLE, async (event) => {
    try {
      const autoStart = new AutoStart();
      const res = await autoStart.set(false);
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });
}
