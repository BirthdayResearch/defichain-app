import { isElectron } from '../utils/isElectron';
import HttpStatus from 'http-status-codes';
import store from './rootStore';
import RpcClient from '../utils/rpc-client';
import {
  startNodeSuccess,
  startNodeFailure,
} from '../containers/RpcConfiguration/reducer';
import showNotification from '../utils/notifications';
import { I18n } from 'react-redux-i18n';
import { isBlockchainStarted } from '../containers/RpcConfiguration/service';

export const getRpcConfig = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('get-config-details', {});
  }
  // For webapp
  return { success: true, data: {} };
};

export const startBinary = (config: any) => {
  // async operation;
  return new Promise((resolve, reject) => {
    if (isElectron()) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('start-defi-chain', config);
      return ipcRenderer.on(
        'start-defi-chain-reply',
        async (_e: any, res: any) => {
          if (res.success) {
            const blockchainStatus = await isBlockchainStarted();
            if (blockchainStatus) {
              store.dispatch({
                type: startNodeSuccess.type,
                payload: res.data,
              });
              return resolve(res);
            }
          }
          store.dispatch({ type: startNodeFailure.type, payload: res.data });
          return reject(res);
        }
      );
    }
    // For webapp
    store.dispatch({ type: startNodeSuccess.type, payload: {} });
    return resolve({ success: true, data: {} });
  });
};

export const stopBinary = () => {
  if (isElectron()) {
    const { ipcRenderer } = window.require('electron');
    return ipcRenderer.sendSync('stop-defi-chain', {});
  }
  // For webapp
  return { success: true, data: {} };
};

export const backupWallet = async (paths: string[]) => {
  const rpcClient = new RpcClient();
  const res = await rpcClient.call('', 'backupwallet', paths);
  if (res.status === HttpStatus.OK) {
    return showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.backupSuccess')
    );
  }
  return showNotification(I18n.t('alerts.error_occurred'), res.data.error);
};

export const importWallet = async (paths: string[]) => {
  const rpcClient = new RpcClient();
  const res = await rpcClient.call('', 'importwallet', paths);
  if (res.status === HttpStatus.OK) {
    return showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.importSuccess')
    );
  }
  return showNotification(I18n.t('alerts.error_occurred'), res.data.error);
};
