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
import {
  startUpdateApp,
  updateApp,
  updateCompleted,
  updateError,
  showUpdateAvailableBadge,
  closeUpdateAvailable,
  closePostUpdate,
  closeUpdateApp,
  openReIndexModal,
  openWalletDatBackupModal,
  closeWalletDatBackupModal,
} from '../containers/PopOver/reducer';
import { backupWallet as backupWalletIpcRenderer } from './update.ipcRenderer';

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
        if (res.isReindexReq) {
          store.dispatch(openReIndexModal());
        }
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

export const backupWalletDat = async () => {
  const ipcRenderer = ipcRendererFunc();
  const resp = ipcRenderer.sendSync('backup-wallet-dat');
  if (resp.success) {
    store.dispatch(closeWalletDatBackupModal());
    return showNotification(
      I18n.t('alerts.success'),
      I18n.t('alerts.backupSuccess')
    );
  }
  return showNotification(I18n.t('alerts.errorOccurred'), resp.message);
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

const openUpdateModal = () => {
  const { popover } = store.getState();
  if (!popover.isUpdateModalOpen) {
    store.dispatch(startUpdateApp());
  }
};

const isRunning = () => {
  const {
    app: { isRunning },
  } = store.getState();
  return isRunning;
};

export const updateProgress = (args) => {
  const {
    popover: { isMinimized },
  } = store.getState();
  if (!isMinimized) {
    openUpdateModal();
  }
  return store.dispatch(updateApp(args));
};

export const updateComplete = () => {
  openUpdateModal();
  return store.dispatch(updateCompleted());
};

export const handleUpdateError = (args?: any) => {
  openUpdateModal();
  return store.dispatch(updateError(args));
};

export const handleShowUpdateAvailableBadge = () => {
  return store.dispatch(showUpdateAvailableBadge());
};

export const handleCloseUpdateAvailable = () =>
  store.dispatch(closeUpdateAvailable());

export const handleClosePostUpdate = () => store.dispatch(closePostUpdate());

export const handleCloseUpdateApp = () => store.dispatch(closeUpdateApp());

export const openBackupWalletDat = () => {
  return store.dispatch(openWalletDatBackupModal());
};

export const startBackupModal = () => {
  if (isRunning()) return backupWalletIpcRenderer();
  return openBackupWalletDat();
};

export const showErrorNotification = (res) =>
  showNotification(I18n.t('alerts.errorOccurred'), res.message);
