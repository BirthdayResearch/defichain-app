import * as log from './electronLogger';
import ini from 'ini';
import randomString from 'random-string';
import {
  getFileData,
  checkPathExists,
  writeFile,
  getRpcAuth,
  createDir,
} from '../utils';
import { APP_DIR, CONFIG_FILE_NAME } from '../constants';
import {
  DEFAULT_RPC_BIND,
  DEFAULT_RPC_PORT,
  RANDOM_USERNAME_LENGTH,
} from '@defi_types/settings';

export default class UiConfig {
  async get() {
    try {
      // check app dir exists
      if (!checkPathExists(APP_DIR)) {
        createDir(APP_DIR);
      }

      // check for default defi config paths
      if (checkPathExists(CONFIG_FILE_NAME)) {
        const defaultConfigData = this.getDefault(CONFIG_FILE_NAME);
        const configData = this.saveUiConfig(defaultConfigData);
        return configData;
      }

      // If default conf is not available
      const username = randomString({
        length: RANDOM_USERNAME_LENGTH,
        numeric: false,
        letters: true,
        special: false,
      });
      const { rpcauth, rpcuser, rpcpassword } = getRpcAuth(username);
      const defaultConfig = {
        rpcauth,
        rpcuser,
        rpcpassword,
        rpcbind: DEFAULT_RPC_BIND,
        rpcport: DEFAULT_RPC_PORT,
      };
      const defaultConfigData = ini.encode(defaultConfig);
      writeFile(CONFIG_FILE_NAME, defaultConfigData);
      const configData = this.saveUiConfig(defaultConfig);
      return configData;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  getDefault(path: string) {
    const fileData = getFileData(path, 'utf-8');
    // TODO add config specific error message to inform user about corrupt config file -HARSH
    const configData = ini.parse(fileData);
    // check for required data in default config
    const {
      rpcauth,
      rpcbind,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
    } = configData;

    if (rpcauth && rpcbind && rpcport && rpcuser && rpcpassword) {
      return {
        rpcauth,
        rpcbind,
        rpcport,
        testnet,
        regnet,
        rpcuser,
        rpcpassword,
      };
    }
    throw new Error('Inconsistent data in default config');
  }

  saveUiConfig = (configData: any) => {
    const {
      rpcauth,
      rpcbind,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
    } = configData;
    const remotes = [];
    const uiConfigData = {
      rpcauth,
      rpcport,
      testnet,
      regnet,
      rpcuser,
      rpcpassword,
      rpcconnect: rpcbind,
    };
    remotes.push(uiConfigData);
    return { remotes };
  };
}
