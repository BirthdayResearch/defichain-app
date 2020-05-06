import log from 'loglevel'
import ini from 'ini'
import yaml from 'js-yaml'
import randomString from 'random-string'
import {
  getFileData,
  checkFileExists,
  writeFile,
  getRpcAuth,
  createDir,
} from '../utils'
import {
  APP_DIR,
  CONFIG_FILE_NAME,
  UI_CONFIG_FILE_NAME,
  DEFAULT_RPC_BIND,
  DEFAULT_RPC_PORT,
  RANDOM_USERNAME_LENGTH,
  YAML_COMMENT,
} from '../constant'

export default class UiConfig {
  async get() {
    try {
      // check app dir exists
      if (!checkFileExists(APP_DIR)) {
        createDir(APP_DIR)
      }
      // check for UI config file
      if (checkFileExists(UI_CONFIG_FILE_NAME)) {
        const configData = this.getUiDetails(UI_CONFIG_FILE_NAME)
        return configData
      }

      // check for default defi config paths
      if (checkFileExists(CONFIG_FILE_NAME)) {
        const defaultConfigData = this.getDefault(CONFIG_FILE_NAME)
        const configData = this.saveUiDetails(
          UI_CONFIG_FILE_NAME,
          defaultConfigData
        )
        return configData
      }

      // If default conf is not available
      const username = randomString({
        length: RANDOM_USERNAME_LENGTH,
        numeric: false,
        letters: true,
        special: false,
      })
      const { rpcauth, rpcuser, rpcpassword } = getRpcAuth(username)
      const defaultConfig = {
        rpcauth,
        rpcuser,
        rpcpassword,
        rpcbind: DEFAULT_RPC_BIND,
        rpcport: DEFAULT_RPC_PORT,
      }
      const defaultConfigData = ini.encode(defaultConfig)
      writeFile(CONFIG_FILE_NAME, defaultConfigData)
      const configData = this.saveUiDetails(UI_CONFIG_FILE_NAME, defaultConfig)
      return configData
    } catch (err) {
      log.error(err)
      throw err
    }
  }

  getUiDetails(path: string) {
    const uiFileData = getFileData(path, 'utf-8')
    // TODO add UI yaml specific error message to inform user about corrupt yaml file -HARSH
    const configData = yaml.safeLoad(uiFileData)
    const {
      rpcauth,
      rpcport,
      rpcconnect,
      rpcuser,
      rpcpassword,
    } = configData.remotes[0]

    if (rpcauth && rpcport && rpcconnect && rpcuser && rpcpassword) {
      return configData
    }
    throw new Error('Inconsistent data in UI config')
  }

  getDefault(path: string) {
    const fileData = getFileData(path, 'utf-8')
    // TODO add config specific error message to inform user about corrupt config file -HARSH
    const configData = ini.parse(fileData)
    // check for required data in default config
    const {
      rpcauth,
      rpcbind,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
    } = configData

    if (rpcauth && rpcbind && rpcport && rpcuser && rpcpassword) {
      return {
        rpcauth,
        rpcbind,
        rpcport,
        testnet,
        regnet,
        rpcuser,
        rpcpassword,
      }
    }
    throw new Error('Inconsistent data in default config')
  }

  saveUiDetails = (path: string, configData: any) => {
    const {
      rpcauth,
      rpcbind,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
    } = configData
    const remotes = []
    const uiConfigData = {
      rpcauth,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
      rpcconnect: rpcbind,
    }
    remotes.push(uiConfigData)
    const yamlData = yaml.safeDump(
      { remotes },
      {
        styles: {
          '!!null': 'lowercase', // dump null as ~
        },
        skipInvalid: true,
      }
    )
    const comment = `# ${YAML_COMMENT}\n`
    const dataToWrite = `${comment}${yamlData}`
    // write to ui config file
    writeFile(path, dataToWrite)
    return remotes
  }
}
