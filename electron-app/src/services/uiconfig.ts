import * as log from './electronLogger';
import ini from 'ini';
import randomString from 'random-string';
import {
  getFileData,
  checkPathExists,
  writeFile,
  getRpcAuth,
  createDir,
  formatConfigFileWrite,
  formatRPCAuth,
} from '../utils';
import { APP_DIR, CONFIG_FILE_NAME } from '../constants';
import {
  DEFAULT_RPC_BIND,
  DEFAULT_RPC_PORT,
  RANDOM_USERNAME_LENGTH,
} from '@defi_types/settings';
import {
  CONFIG_DISABLED,
  NetworkTypes,
  RPCConfigItem,
  RPCRemotes,
} from '@defi_types/rpcConfig';
export default class UiConfig {
  async get(): Promise<RPCRemotes> {
    try {
      // check app dir exists
      if (!checkPathExists(APP_DIR)) {
        createDir(APP_DIR);
      }

      // check for default defi config paths
      if (checkPathExists(CONFIG_FILE_NAME)) {
        const existingConfigData = this.getExistingConfig(CONFIG_FILE_NAME);
        const configData = this.saveUiConfig(existingConfigData);
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
        rpcport: DEFAULT_RPC_PORT.toString(),
      };
      const configData = this.saveUiConfig(defaultConfig);
      return configData;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  getExistingConfig(path: string): RPCConfigItem {
    const fileData = getFileData(path, 'utf-8');
    // TODO add config specific error message to inform user about corrupt config file -HARSH
    const configData = ini.parse(fileData) as RPCConfigItem;
    // check for required data in default config
    const { rpcauth, rpcuser, rpcpassword } = configData;

    if (rpcauth && rpcuser && rpcpassword) {
      return configData;
    }
    throw new Error('Inconsistent data in default config');
  }

  saveUiConfig = (
    existingConfigData: Partial<RPCConfigItem> = {}
  ): RPCRemotes => {
    const networks = [NetworkTypes.MAIN, NetworkTypes.TEST];
    const remotes = [];
    const uiConfigData: any = {
      ...existingConfigData,
      rpcauth: formatRPCAuth(
        existingConfigData.rpcuser,
        existingConfigData.rpcpassword
      ),
      rpcuser: existingConfigData.rpcuser,
      rpcpassword: existingConfigData.rpcpassword,
      rpcconnect: existingConfigData.rpcbind ?? DEFAULT_RPC_BIND,
      testnet: existingConfigData.testnet ?? CONFIG_DISABLED,
      regtest: existingConfigData.regtest ?? CONFIG_DISABLED,
    };

    //* Set on respective networks
    delete uiConfigData.rpcbind;
    delete uiConfigData.rpcport;
    delete uiConfigData.addnode;
    delete uiConfigData.masternode_operator;
    delete uiConfigData.spv;
    delete uiConfigData.gen;

    networks.forEach((n: string) => {
      uiConfigData[n] = uiConfigData[n] ?? {};
      uiConfigData[n].rpcbind =
        uiConfigData[n].rpcbind ??
        existingConfigData.rpcbind ??
        DEFAULT_RPC_BIND;
      uiConfigData[n].rpcport =
        uiConfigData[n].rpcport ??
        existingConfigData.rpcport ??
        DEFAULT_RPC_PORT;
      //* If main network, copy root configs to network to prevent startup errors
      if (n === NetworkTypes.MAIN) {
        remapConfigIfExisting(uiConfigData[n], existingConfigData, 'addnode');
        remapConfigIfExisting(
          uiConfigData[n],
          existingConfigData,
          'masternode_operator'
        );
        remapConfigIfExisting(uiConfigData[n], existingConfigData, 'spv');
        remapConfigIfExisting(uiConfigData[n], existingConfigData, 'gen');
      }
    });
    const defaultConfigData = ini.encode(uiConfigData);
    const newData = formatConfigFileWrite(defaultConfigData);
    writeFile(CONFIG_FILE_NAME, newData);
    remotes.push(uiConfigData);
    return { remotes };
  };
}

const remapConfigIfExisting = (
  configData: any,
  source: any,
  property: string
): void => {
  if (configData[property] != null || source[property] != null) {
    configData[property] = configData[property] ?? source[property];
  }
};
