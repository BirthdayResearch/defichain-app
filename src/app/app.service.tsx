import isElectron from "is-electron";

export const getRpcConfig = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require("electron");
    const res = ipcRenderer.sendSync("get-config-details", {});
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message);
  }
  return {};
};
