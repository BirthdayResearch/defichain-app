const { ipcMain } = require("electron")
const {
  PRELAUNCH_PREFERENCE_STATUS,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_DISABLE,
} = require("./../constant");
const { getPreferenceStatus, setPreferenceStatus } = require("./../services/autoStart")

ipcMain.on(PRELAUNCH_PREFERENCE_STATUS, async (event, arg) => {
  event.returnValue = await getPreferenceStatus();
})

ipcMain.on(PRELAUNCH_PREFERENCE_ENABLE, async (event, arg) => {
  event.returnValue = await setPreferenceStatus(true, arg.minimize)
})

ipcMain.on(PRELAUNCH_PREFERENCE_DISABLE, async (event, arg) => {
  event.returnValue = await setPreferenceStatus(false)
})
