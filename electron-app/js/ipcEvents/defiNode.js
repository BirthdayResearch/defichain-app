const { ipcMain } = require("electron");
const { START_DEFI_CHAIN, STOP_DEFI_CHAIN } = require("../constant");
const DefiNode = require("../services/defiNode");

const initiateDefiNode = () => {
  const defiNode = new DefiNode();

  ipcMain.on(START_DEFI_CHAIN, (event, arg) => {
    event.returnValue = defiNode.start(arg);;
  })

  ipcMain.on(STOP_DEFI_CHAIN, async (event, arg) => {
    event.returnValue = defiNode.stop({});
  })
}

module.exports = initiateDefiNode;
