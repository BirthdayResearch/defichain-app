import { isElectron, ipcRendererFunc } from '../utils/isElectron';
import HttpStatus from 'http-status-codes';
import RpcClient from '../utils/rpc-client';
import showNotification from '../utils/notifications';
import * as log from '../utils/electronLogger';
import { I18n } from 'react-redux-i18n';
import { isBlockchainStarted } from '../containers/RpcConfiguration/service';
import { eventChannel } from 'redux-saga';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from '../containers/WalletPage/reducer';
import store from '../app/rootStore';
import { DUMP_WALLET, IMPORT_WALLET } from '../constants/rpcMethods';

export const getRpcConfig = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    return ipcRenderer.sendSync('get-config-details', {});
  }
  // For webapp
  return { success: true, data: {} };
};

export function startBinary(config: any) {
  return eventChannel((emit) => {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.send('start-defi-chain', config);
    ipcRenderer.on('start-defi-chain-reply', async (_e: any, res: any) => {
      if (res.success) {
        isBlockchainStarted(emit, res);
      } else {
        emit(res);
      }
    });
    return () => {
      log.info('Unsubscribe startBinary');
    };
  });
}

export const stopBinary = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    return ipcRenderer.sendSync('stop-defi-chain', {});
  }
  // For webapp
  return { success: true, data: {} };
};

export const backupWallet = async (paths: string) => {
  const rpcClient = new RpcClient();
  const res = await rpcClient.call('', DUMP_WALLET, [paths]);

  if (res.status === HttpStatus.OK) {
    return showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.backupSuccess')
    );
  }
  return showNotification(I18n.t('alerts.errorOccurred'), res.data.error);
};

export const importWallet = async (paths: string[]) => {
  const rpcClient = new RpcClient();
  const res = await rpcClient.call('', IMPORT_WALLET, paths);
  if (res.status === HttpStatus.OK) {
    store.dispatch(fetchWalletBalanceRequest()); // Check for new Balance;
    store.dispatch(fetchPendingBalanceRequest()); // Check for new Pending Balance;

    return showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.importSuccess')
    );
  }
  return showNotification(I18n.t('alerts.errorOccurred'), res.data.error);
};
