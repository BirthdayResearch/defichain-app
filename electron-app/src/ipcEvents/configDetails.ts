import { ipcMain } from "electron";
import UiConfigFlow from "../services/configDetails";
import { GET_CONFIG_DETAILS } from "../constant";

const initiateConfigDetails = () => {
  ipcMain.on(GET_CONFIG_DETAILS, async (event, arg) => {
    const uiConfigFlow = new UiConfigFlow();
    event.returnValue = await uiConfigFlow.getUiConfigDetails();
  });
};

export default initiateConfigDetails;
