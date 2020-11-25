import { importWallet, backupWallet, startBackupModal, resetBackupModal } from './service';

const initMenuIpcRenderers = () => {
  const { ipcRenderer } = window.require('electron');
  ipcRenderer.on(
    'menu-backup-wallet',
    async (event: any, arg: { paths: string }) => {
      const { paths } = arg;
      await backupWallet(paths);
    }
  );

  ipcRenderer.on(
    'menu-import-wallet',
    async (event: any, arg: { paths: string[] }) => {
      const { paths } = arg;
      await importWallet(paths);
    }
  );

  ipcRenderer.on('start-backup-wallet', async (event: any) => {
    await startBackupModal();
  });

  ipcRenderer.on('start-reset-wallet', async (event: any) => {
    await resetBackupModal();
  });
};

export default initMenuIpcRenderers;
