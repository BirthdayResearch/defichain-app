import log from "loglevel";
import AutoLaunch from "auto-launch";
import { APP_NAME } from "../constant";

export default class PreferenceStatus {
  async get() {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME });
      const enabled = await autoLauncher.isEnabled();
      return { enabled };
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  async set(enabled: boolean, isHidden?: boolean) {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME, isHidden });
      if (enabled) {
        await autoLauncher.enable();
        return { enabled };
      }
      await autoLauncher.disable();
      return { enabled };
    } catch (err) {
      log.error(err);
      throw err;
    }
  }
}
