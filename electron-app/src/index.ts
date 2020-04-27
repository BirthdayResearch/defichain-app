import autoStart from "./ipc-events/autostart";
import uiconfig from "./ipc-events/uiconfig";
import processmanager from "./ipc-events/processmanager";

const initiateIpcEvents = () => {
  autoStart();
  uiconfig();
  processmanager();
};

initiateIpcEvents();
