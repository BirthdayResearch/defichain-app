import isElectron from "is-electron";

export const getPreLaunchStatus = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const data = ipcRenderer.sendSync("prelaunch-preference-status", {
      data: 1,
    });
    return data;
  }
  return false;
};

export const enablePreLaunchStatus = (minimize = false) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const data = ipcRenderer.sendSync("prelaunch-preference-enable", {
      minimize,
    });
    return data;
  }
  return false;
};

export const disablePreLaunchStatus = (minimize = false) => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const data = ipcRenderer.sendSync("prelaunch-preference-disable", {});
    return data;
  }
  return false;
};
