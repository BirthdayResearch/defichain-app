import isElectronFunction from 'is-electron';

export const isElectron = () => isElectronFunction();
export const ipcRendererFunc = () => {
  const { ipcRenderer } = window.require('electron');
  return ipcRenderer;
};
export const getElectronProperty = (name) => {
  const electron = window.require('electron');
  if (!electron[name]) {
    return null;
  }
  return electron[name];
};
