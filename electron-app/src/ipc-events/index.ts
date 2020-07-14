import initiateAutoStart from './autostart';
import initiateUiConfig from './uiconfig';
import initiateDefiProcessManager from './defiprocessmanager';

export function initiateIpcEvents() {
  initiateAutoStart();
  initiateUiConfig();
  initiateDefiProcessManager();
}
