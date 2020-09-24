import { ipcMain } from 'electron';
import DefiProcessManager from '../services/defiprocessmanager';
import {
  START_DEFI_CHAIN,
  STOP_DEFI_CHAIN,
  RESTART_APP,
  CLOSE_APP,
  FORCE_KILL_QUEUE_AND_SHUTDOWN,
} from '../constants';

export default function initiateDefiProcessManager() {
  ipcMain.on(START_DEFI_CHAIN, async (event, arg) => {
    await DefiProcessManager.start(arg, event);
  });

  ipcMain.on(STOP_DEFI_CHAIN, async (event) => {
    event.returnValue = await DefiProcessManager.stop();
  });

  ipcMain.on(RESTART_APP, async (event, args) => {
    event.returnValue = await DefiProcessManager.restart(args, event);
  });

  ipcMain.on(CLOSE_APP, async () => {
    await DefiProcessManager.closeApp();
  });

  ipcMain.on(FORCE_KILL_QUEUE_AND_SHUTDOWN, async () => {
    await DefiProcessManager.forceClose();
  });
}
