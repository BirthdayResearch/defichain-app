import {
  MENU_BACKUP_WALLET,
  MENU_IMPORT_WALLET,
  ON_REINDEX_REQUEST,
  RESET_BACKUP_WALLET,
  START_BACKUP_WALLET,
} from '@defi_types/ipcEvents';
import { reindexRequest } from '../containers/SettingsPage/reducer';
import store from './rootStore';
import {
  importWallet,
  backupWallet,
  startBackupModal,
  resetBackupModal,
} from './service';

const initMenuIpcRenderers = () => {
  const { ipcRenderer } = window.require('electron');
  ipcRenderer.on(
    MENU_BACKUP_WALLET,
    async (event: any, arg: { paths: string }) => {
      const { paths } = arg;
      await backupWallet(paths);
    }
  );

  ipcRenderer.on(
    MENU_IMPORT_WALLET,
    async (event: any, arg: { paths: string[] }) => {
      const { paths } = arg;
      await importWallet(paths);
    }
  );

  ipcRenderer.on(START_BACKUP_WALLET, async (event: any) => {
    await startBackupModal();
  });

  ipcRenderer.on(RESET_BACKUP_WALLET, async (event: any) => {
    await resetBackupModal();
  });

  ipcRenderer.on(ON_REINDEX_REQUEST, async (event: any) => {
    store.dispatch(reindexRequest());
  });
};

export default initMenuIpcRenderers;
