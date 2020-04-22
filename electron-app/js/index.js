const autoStart = require("./ipcEvents/autoStart");
const configDetails = require("./ipcEvents/configDetails");
const defiNode = require("./ipcEvents/defiNode");

const initiateIpcEvents = () => {
  autoStart();
  configDetails();
  defiNode();
}

initiateIpcEvents();
