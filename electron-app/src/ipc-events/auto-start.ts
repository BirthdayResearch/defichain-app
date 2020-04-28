import { ipcMain } from "electron";
import PreferenceStatus from "../services/auto-start";
import { responseMessage } from "../utils";
import {
  PRELAUNCH_PREFERENCE_STATUS,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_DISABLE,
} from "../constant";

const initiateAutoStart = () => {
  ipcMain.on(PRELAUNCH_PREFERENCE_STATUS, async (event) => {
    try {
      const preferenceStatus = new PreferenceStatus();
      const res = await preferenceStatus.get();
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });

  ipcMain.on(PRELAUNCH_PREFERENCE_ENABLE, async (event, arg) => {
    try {
      const preferenceStatus = new PreferenceStatus();
      const res = await preferenceStatus.set(true, arg.minimize);
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });

  ipcMain.on(PRELAUNCH_PREFERENCE_DISABLE, async (event) => {
    try {
      const preferenceStatus = new PreferenceStatus();
      const res = await preferenceStatus.set(false);
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });
};

export default initiateAutoStart;
