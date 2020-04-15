const { ipcMain } = require("electron");
const { GET_CONFIG_DETAILS } = require("../constant");
const { getConfig } = require("./../services/configDetails");

ipcMain.on(GET_CONFIG_DETAILS, async (event, arg) => {
  event.returnValue = await getConfig();
})
