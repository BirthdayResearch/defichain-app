import { ipcMain } from "electron";
import { START_DEFI_CHAIN, STOP_DEFI_CHAIN } from "../constant";
import DefiNode from "../services/defiNode";

const initiateDefiNode = () => {
  ipcMain.on(START_DEFI_CHAIN, async (event: any, arg: any) => {
    const defiNode = new DefiNode();
    await defiNode.start(arg, event);
  });

  ipcMain.on(STOP_DEFI_CHAIN, async (event: { returnValue: any }, arg: any) => {
    const defiNode = new DefiNode();
    event.returnValue = await defiNode.stop();
  });
};

export default initiateDefiNode;
