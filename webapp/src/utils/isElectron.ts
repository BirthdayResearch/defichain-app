import {
  CLOSE_APP,
  RESTART_APP,
  START_DEFI_CHAIN,
} from '@defi_types/ipcEvents';
import isElectronFunction from 'is-electron';
import store from '../app/rootStore';
import { getRpcConfigsSuccess } from '../containers/RpcConfiguration/reducer';

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

export const updateConfigOnRestart = (args?: any) => {
  if (args?.updatedConf != null) {
    store.dispatch(getRpcConfigsSuccess({ remotes: [args?.updatedConf] }));
  }
};

export const restartNode = (args?: any) => {
  if (isElectron()) {
    updateConfigOnRestart(args);
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(RESTART_APP, args);
  } else {
    throw new Error('Unable to restart');
  }
};

export const restartNodeSync = (args?: any) => {
  if (isElectron()) {
    updateConfigOnRestart(args);
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.sendSync(RESTART_APP, args);
  } else {
    throw new Error('Unable to restart');
  }
};

export const restartNodeWithReIndexing = (args?: any) => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(START_DEFI_CHAIN, args);
  } else {
    throw new Error('Unable to restart');
  }
};

export const closeApp = (args?: any) => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send(CLOSE_APP, args);
  } else {
    throw new Error('Unable to close app');
  }
};
