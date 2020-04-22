import isElectron from "is-electron";

export const getRpcConfig = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    return ipcRenderer.sendSync("get-config-details", {});
  }
  // For webapp
  return { success: true, data: {} };
};

export const startBinary = (config) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    return ipcRenderer.sendSync("start-defi-chain", config);
  }
  // For webapp
  return { success: true, data: {} };
};

export const stopBinary = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    return ipcRenderer.sendSync("stop-defi-chain", {});
  }
  // For webapp
  return { success: true, data: {} };
};
