const AutoLaunch = require("auto-launch");
const { APP_NAME } = require("./../constant");
const { responseMessage } = require("./../utils");

class PreferenceStatus {
  get = async () => {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME });
      const data = await autoLauncher.isEnabled();
      return responseMessage(true, data);
    } catch (err) {
      return responseMessage(false, err);
    }
  }
  set = async (enable, isHidden) => {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME, isHidden });
      if (enable) {
        const data = await autoLauncher.enable();
        return responseMessage(true, data);
      }
      const data = await autoLauncher.disable();
      return responseMessage(true, data);
    } catch (err) {
      return responseMessage(false, err);
    }
  }
}

module.exports = PreferenceStatus;
