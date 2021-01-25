import queue from 'async/queue';

import { QUEUE_CONCURRENCY, LOADING_BLOCK_INDEX_CODE } from '../../constants';
import { ipcRendererFunc, isElectron } from '../../utils/isElectron';
import * as log from '../../utils/electronLogger';
import RpcClient from '../../utils/rpc-client';
import store from '../../app/rootStore';
import {
  isAppClosing,
  killQueue,
} from '../../containers/RpcConfiguration/reducer';
import {
  FORCE_KILL_QUEUE_AND_SHUTDOWN,
  ON_CLOSE_RPC_CLIENT,
  STOP_BINARY_AND_QUEUE,
} from '@defi_types/ipcEvents';
import { LOGGING_SHUT_DOWN } from '@defi_types/loggingMethodSource';

const worker = (task, callback) => {
  task
    .methodName(...task.params)
    .then((result) => {
      callback(null, result);
    })
    .catch((e) => {
      log.error(JSON.stringify(e), 'queueWorker');
      callback(e);
    });
};

const q = queue(worker, QUEUE_CONCURRENCY);
q.error((e, task) => {
  log.error(JSON.stringify(e), `${task?.methodName ?? 'queueWorker'}`);
});

const isRunning = () => {
  const {
    app: { isRunning },
  } = store.getState();
  return isRunning;
};

if (isElectron()) {
  const ipcRenderer = ipcRendererFunc();
  ipcRenderer.on(STOP_BINARY_AND_QUEUE, async () => {
    try {
      log.info('Removing all Binary and Queue listeners..', LOGGING_SHUT_DOWN);
      store.dispatch(isAppClosing({ isAppClosing: true }));
      ipcRenderer.removeAllListeners(STOP_BINARY_AND_QUEUE);
      if (isRunning()) {
        await shutDownBinary();
        ipcRenderer.send(ON_CLOSE_RPC_CLIENT);
      }
      return ipcRenderer.send(FORCE_KILL_QUEUE_AND_SHUTDOWN);
    } catch (error) {
      ipcRenderer.send(ON_CLOSE_RPC_CLIENT);
      log.error(error);
    }
  });
}

export const shutDownBinary = async () => {
  try {
    log.info('Starting node shutdown...', LOGGING_SHUT_DOWN);
    store.dispatch(killQueue());
    await q.kill();
    const rpcClient = new RpcClient();
    const result = rpcClient.stop();
    log.info('Node shutdown successfully', LOGGING_SHUT_DOWN);
    log.info(JSON.stringify(result));
    return result;
  } catch (err) {
    log.error(JSON.stringify(err), LOGGING_SHUT_DOWN);
    if (isElectron()) {
      if (err?.response?.data?.error?.code !== LOADING_BLOCK_INDEX_CODE) {
        const ipcRenderer = ipcRendererFunc();
        ipcRenderer.send(FORCE_KILL_QUEUE_AND_SHUTDOWN);
      }
    }
  }
};

export default q;
