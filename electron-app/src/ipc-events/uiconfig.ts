import { ipcMain } from "electron";
import UiConfig from "../services/uiconfig";
import { GET_CONFIG_DETAILS } from "../constant";
import { responseMessage } from "../utils";

const initiateConfigDetails = () => {
  ipcMain.on(GET_CONFIG_DETAILS, async (event, arg) => {
    try {
      const uiConfig = new UiConfig();
      const res = await uiConfig.get();
      event.returnValue = responseMessage(true, res);
    } catch (err) {
      event.returnValue = responseMessage(false, err);
    }
  });
};

export default initiateConfigDetails;
