import { ipcMain } from "electron";
import ProcessManager from "../services/processmanager";
import { START_DEFI_CHAIN, STOP_DEFI_CHAIN } from "../constant";

const initiateProcessManager = () => {
  ipcMain.on(START_DEFI_CHAIN, async (event: any, arg: any) => {
    const processManager = new ProcessManager();
    await processManager.start(arg, event);
  });

  ipcMain.on(STOP_DEFI_CHAIN, async (event: { returnValue: any }, arg: any) => {
    const processManager = new ProcessManager();
    event.returnValue = await processManager.stop();
  });
};

export default initiateProcessManager;
