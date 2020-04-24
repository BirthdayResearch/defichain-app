import autoStart from "./ipcEvents/autoStart";
import configDetails from "./ipcEvents/configDetails";
import defiNode from "./ipcEvents/defiNode";

const initiateIpcEvents = () => {
  autoStart();
  configDetails();
  defiNode();
};

initiateIpcEvents();
