import { dialog } from 'electron'
import log from 'loglevel'

export default class DialogManager {
  // open directory model and allow to select directory
  async getDirectoryPath() {
    try {
      const res = await dialog.showOpenDialog(null, {
        properties: ['openDirectory'],
      })
      if (res.canceled || !res.filePaths.length) {
        throw new Error('Directory not selected')
      }
      return res.filePaths
    } catch (err) {
      log.error(err)
      throw err
    }
  }

  // open file model and allow to select file
  async getFilePath(filters?: { name: string; extensions: string[] }[]) {
    try {
      const res = await dialog.showOpenDialog(null, {
        properties: ['openFile', 'openDirectory'],
        filters,
      })
      if (res.canceled || !res.filePaths.length) {
        throw new Error('File not selected')
      }
      return res.filePaths
    } catch (err) {
      log.error(err)
      throw err
    }
  }
}
