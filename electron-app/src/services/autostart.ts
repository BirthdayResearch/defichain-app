import * as log from './electronLogger';
import AutoLaunch from 'auto-launch';
import { APP_NAME } from '../constants';

export default class AutoStart {
  // get app autostart status
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

  // set app autostart status
  async set(enabled: boolean, isHidden?: boolean) {
    try {
      const autoLauncher = new AutoLaunch({ name: APP_NAME, isHidden });
      const isEnabled = await autoLauncher.isEnabled();

      // Handel do not disable autostart when already disabled
      if (!enabled && isEnabled === enabled) {
        return { enabled };
      }

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
