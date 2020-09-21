import { importWallet, backupWallet, startBackupWalletDat } from './service';

const initMenuIpcRenderers = () => {
  const { ipcRenderer } = window.require('electron');
  ipcRenderer.on(
    'menu-backup-wallet',
    async (event: any, arg: { paths: string }) => {
      const { paths } = arg;
      await backupWallet(paths);
    }
  );

  ipcRenderer.on('start-backup-wallet-dat', async (event: any) => {
    await startBackupWalletDat();
  });

  ipcRenderer.on(
    'menu-import-wallet',
    async (event: any, arg: { paths: string[] }) => {
      const { paths } = arg;
      await importWallet(paths);
    }
  );
};

export default initMenuIpcRenderers;
