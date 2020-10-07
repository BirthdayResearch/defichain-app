import queue from 'async/queue';

import { QUEUE_CONCURRENCY, LOADING_BLOCK_INDEX_CODE } from '../../constants';
import { ipcRendererFunc, isElectron } from '../../utils/isElectron';
import * as log from '../../utils/electronLogger';
import RpcClient from '../../utils/rpc-client';
import store from '../../app/rootStore';
import { killQueue } from '../../containers/RpcConfiguration/reducer';

const worker = (task, callback) => {
  task
    .methodName(...task.params)
    .then((result) => {
      callback(null, result);
    })
    .catch((e) => {
      callback(e);
    });
};

const q = queue(worker, QUEUE_CONCURRENCY);

const isRunning = () => {
  const {
    app: { isRunning },
  } = store.getState();
  return isRunning;
};

if (isElectron()) {
  const ipcRenderer = ipcRendererFunc();
  ipcRenderer.on('stop-binary-and-queue', () => {
    ipcRenderer.removeAllListeners('stop-binary-and-queue');
    if (isRunning()) {
      return shutDownBinary();
    }
    return ipcRenderer.send('force-kill-queue-and-shutdown');
  });
}

export const shutDownBinary = async () => {
  try {
    store.dispatch(killQueue());
    await q.kill();
    const rpcClient = new RpcClient();
    const result = rpcClient.stop();
    log.info(JSON.stringify(result));
    return result;
  } catch (err) {
    log.error(JSON.stringify(err));
    if (isElectron()) {
      if (err?.response?.data?.error?.code !== LOADING_BLOCK_INDEX_CODE) {
        const ipcRenderer = ipcRendererFunc();
        ipcRenderer.send('force-kill-queue-and-shutdown');
      }
    }
  }
};

export default q;
