import isElectron from "is-electron";

export const getRpcConfig = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("get-config-details", {});
    console.log(res);

    if (res.success) {
      return res.data;
    }
    throw new Error(res.message);
  }
  return {};
};

export const startBinary = (config) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("start-defi-chain", config);
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message);
  }
  return {};
};

export const stopBinary = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("stop-defi-chain", {});
    console.log(res);
    // if (res.success) {
    //   return res.data;
    // }
    // throw new Error(res.message);
  }
  return {};
};
