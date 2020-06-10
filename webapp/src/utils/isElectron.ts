import isElectronFunction from 'is-electron';

export const isElectron = () => isElectronFunction();
export const ipcRendererFunc = () => {
  const { ipcRenderer } = window.require('electron');
  return ipcRenderer;
};
