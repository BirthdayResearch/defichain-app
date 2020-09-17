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
    const defiProcessManager = new DefiProcessManager();
    await defiProcessManager.start(arg, event);
  });

  ipcMain.on(STOP_DEFI_CHAIN, async (event) => {
    const defiProcessManager = new DefiProcessManager();
    event.returnValue = await defiProcessManager.stop();
  });

  ipcMain.on(RESTART_APP, async (event, args) => {
    const defiProcessManager = new DefiProcessManager();
    event.returnValue = await defiProcessManager.restart(args, event);
  });

  ipcMain.on(CLOSE_APP, async () => {
    const defiProcessManager = new DefiProcessManager();
    await defiProcessManager.closeApp();
  });

  ipcMain.on(FORCE_KILL_QUEUE_AND_SHUTDOWN, async () => {
    const defiProcessManager = new DefiProcessManager();
    await defiProcessManager.forceClose();
  });
}
