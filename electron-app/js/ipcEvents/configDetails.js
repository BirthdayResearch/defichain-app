const { ipcMain } = require("electron");
const UiConfigFlow = require("./../services/configDetails");
const { GET_CONFIG_DETAILS } = require("../constant");

const initiateConfigDetails = () => {
  ipcMain.on(GET_CONFIG_DETAILS, async (event, arg) => {
    const uiConfigFlow = new UiConfigFlow();
    event.returnValue = await uiConfigFlow.getUiConfigDetails();
  })
}

module.exports = initiateConfigDetails;
