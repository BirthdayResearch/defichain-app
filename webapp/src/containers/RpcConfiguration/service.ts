import log from 'loglevel';

import { DIFF, RETRY_ATTEMPT } from '../../constants';
import RpcClient from '../../utils/rpc-client';

//TODO: need to be done through event channel
export const isBlockchainStarted = async (): Promise<boolean> => {
  let retryCount = 0;
  const rpcClient = new RpcClient();

  while (true && retryCount <= RETRY_ATTEMPT) {
    try {
      const isStarted = await rpcClient.isInitialBlockDownload();
      if (isStarted) return isStarted;
    } catch (e) {
      log.error(`Got error in isBlockchainStarted: ${e}`);
      retryCount++;
      await sleep(DIFF);
    }
  }
  return false;
};

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
