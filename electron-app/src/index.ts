import autoStart from "./ipc-events/auto-start";
import uiconfig from "./ipc-events/uiconfig";
import processmanager from "./ipc-events/processmanager";

const initiateIpcEvents = () => {
  autoStart();
  uiconfig();
  processmanager();
};

initiateIpcEvents();
