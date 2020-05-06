import { ipcMain } from 'electron'
import DefiProcessManager from '../services/defiprocessmanager'
import { START_DEFI_CHAIN, STOP_DEFI_CHAIN } from '../constant'

export default function initiateDefiProcessManager() {
  ipcMain.on(START_DEFI_CHAIN, async (event, arg) => {
    const defiProcessManager = new DefiProcessManager()
    await defiProcessManager.start(arg, event)
  })

  ipcMain.on(STOP_DEFI_CHAIN, async (event) => {
    const defiProcessManager = new DefiProcessManager()
    event.returnValue = await defiProcessManager.stop()
  })
}
