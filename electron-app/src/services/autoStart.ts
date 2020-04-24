import AutoLaunch from "auto-launch";
import { APP_NAME } from "../constant";
import { responseMessage } from "../utils";

export default class PreferenceStatus {
  async get() {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME });
      const enabled = await autoLauncher.isEnabled();
      return responseMessage(true, { enabled });
    } catch (err) {
      return responseMessage(false, err);
    }
  }
  async set(enabled: boolean, isHidden?: boolean) {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME, isHidden });
      if (enabled) {
        await autoLauncher.enable();
        return responseMessage(true, { enabled });
      }
      await autoLauncher.disable();
      return responseMessage(true, { enabled });
    } catch (err) {
      return responseMessage(false, err);
    }
  }
}
