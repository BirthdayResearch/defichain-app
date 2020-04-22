const AutoLaunch = require("auto-launch");
const { APP_NAME } = require("./../constant");
const { responseMessage } = require("./../utils");

class PreferenceStatus {
  async get() {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME });
      const enabled = await autoLauncher.isEnabled();
      return responseMessage(true, { enabled });
    } catch (err) {
      return responseMessage(false, err);
    }
  }
  async set(enabled, isHidden) {
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

module.exports = PreferenceStatus;
