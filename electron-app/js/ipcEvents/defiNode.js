const { ipcMain } = require("electron");
const { START_DEFI_CHAIN, STOP_DEFI_CHAIN } = require("../constant");
const DefiNode = require("../services/defiNode");

const initiateDefiNode = () => {
  ipcMain.on(START_DEFI_CHAIN, async (event, arg) => {
    const defiNode = new DefiNode();
    event.returnValue = await defiNode.start(arg);;
  })

  ipcMain.on(STOP_DEFI_CHAIN, async (event, arg) => {
    const defiNode = new DefiNode();
    event.returnValue = await defiNode.stop({});
  })
}

module.exports = initiateDefiNode;
