import * as log from '../../utils/electronLogger';
import {
  DIFF,
  RETRY_ATTEMPT,
  BLOCKCHAIN_START_ERROR,
  BLOCKCHAIN_START_SUCCESS,
} from '../../constants';
import RpcClient from '../../utils/rpc-client';

let retryAttempt = RETRY_ATTEMPT;

const getRetryAttempt = () => retryAttempt;

const setRetryAttempt = val => (retryAttempt = val);

export const isBlockchainStarted = async emitter => {
  const rpcClient = new RpcClient();
  const intervalRef = setInterval(
    () => blockChainStartEmitFunction(rpcClient, emitter),
    DIFF
  );
  return () => {
    clearInterval(intervalRef);
  };
};

export const blockChainStartEmitFunction = async (rpcClient, emitter) => {
  try {
    const res = await rpcClient.isInitialBlockDownload();
    if (res) {
      emitter({
        status: res,
        message: BLOCKCHAIN_START_SUCCESS,
      });
    }
  } catch (err) {
    setRetryAttempt(getRetryAttempt() - 1);
    log.error(`Got error in isBlockchainStarted: ${err}`);
    // this causes the channel to close
    if (!getRetryAttempt()) {
      emitter({
        status: false,
        message: BLOCKCHAIN_START_ERROR,
      });
    }
  }
};
