const { ipcMain } = require('electron')
const AutoLaunch = require('auto-launch');
const name = 'defi-blockchain-client-ui';

ipcMain.on('prelaunch-preference-status', async (event, arg) => {
  try {
    const autoLauncher = new AutoLaunch({ name });
    event.returnValue = await autoLauncher.isEnabled();
  } catch (err) {
    event.returnValue = err;
  }
})

ipcMain.on('prelaunch-preference-enable', async (event, arg) => {
  try {
    const autoLauncher = new AutoLaunch({ name, isHidden: arg.minimize });
    const data = await autoLauncher.enable()
    event.returnValue = data;
  } catch (err) {
    event.returnValue = err;
  }
})

ipcMain.on('prelaunch-preference-disable', async (event, arg) => {
  try {
    const autoLauncher = new AutoLaunch({ name });
    const data = await autoLauncher.disable()
    event.returnValue = data;
  } catch (err) {
    event.returnValue = err;
  }
})
