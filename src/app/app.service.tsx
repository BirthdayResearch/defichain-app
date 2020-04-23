import isElectron from "is-electron";
import store from "./rootStore";
import { startNodeSuccess, startNodeFailure } from "./reducer";

export const getRpcConfig = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    return ipcRenderer.sendSync("get-config-details", {});
  }
  // For webapp
  return { success: true, data: {} };
};

export const startBinary = (config: any) => {
  // async operation;
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("start-defi-chain", config);
      return ipcRenderer.on("start-defi-chain-reply", (_e: any, res: any) => {
        if (res.success) {
          store.dispatch({ type: startNodeSuccess.type, payload: res.data });
          return resolve(res);
        }
        store.dispatch({ type: startNodeFailure.type, payload: res.data });
        return reject(res);
      });
    }
    // For webapp
    store.dispatch({ type: startNodeSuccess.type, payload: {} });
    return resolve({ success: true, data: {} });
  });
};

export const stopBinary = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    return ipcRenderer.sendSync("stop-defi-chain", {});
  }
  // For webapp
  return { success: true, data: {} };
};
