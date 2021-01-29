import { ipcMain } from 'electron';
import DefiProcessManager from '../services/defiprocessmanager';
import {
  START_DEFI_CHAIN,
  STOP_DEFI_CHAIN,
  FORCE_KILL_QUEUE_AND_SHUTDOWN,
  RESTART_APP,
} from '@defi_types/ipcEvents';

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

  ipcMain.on(FORCE_KILL_QUEUE_AND_SHUTDOWN, async () => {
    await DefiProcessManager.forceClose();
  });
}
