import isElectron from 'is-electron';
import log from 'loglevel';

import RpcClient from '../../utils/rpc-client';

export const isBlockchainStarted = async (): Promise<boolean> => {
  if (isElectron()) {
    const rpcClient = new RpcClient();
    try {
      const isStarted = await rpcClient.isInitialBlockDownload();
      if (isStarted) return true;
    } catch (e) {
      log.error(`Got error in isBlockchainStarted: ${e}`);
      return false;
    }
  }

  // for webapp
  return true;
};
