const { ipcMain, ipcRenderer } = require("electron")
const PreferenceStatus = require("./../services/autoStart");
const {
  PRELAUNCH_PREFERENCE_STATUS,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_DISABLE,
} = require("./../constant");

const initiateAutoStart = () => {
  ipcMain.on(PRELAUNCH_PREFERENCE_STATUS, async (event) => {
    const preferenceStatus = new PreferenceStatus();
    event.returnValue = await preferenceStatus.get();
  })

  ipcMain.on(PRELAUNCH_PREFERENCE_ENABLE, async (event, arg) => {
    const preferenceStatus = new PreferenceStatus();
    event.returnValue = await preferenceStatus.set(true, arg.minimize);
  })

  ipcMain.on(PRELAUNCH_PREFERENCE_DISABLE, async (event) => {
    const preferenceStatus = new PreferenceStatus();
    event.returnValue = await preferenceStatus.set(false);
  })
}
module.exports = initiateAutoStart;