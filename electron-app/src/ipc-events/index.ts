import initiateAutoStart from './autostart';
import initiateUiConfig from './uiconfig';
import initiateDefiProcessManager from './defiprocessmanager';
import initiateAppUpdateManager from './appUpdateManager';

export function initiateIpcEvents(autoUpdater: any) {
  initiateAutoStart();
  initiateUiConfig();
  initiateDefiProcessManager();
  initiateAppUpdateManager(autoUpdater);
}
