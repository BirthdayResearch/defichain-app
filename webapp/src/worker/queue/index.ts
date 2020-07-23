import queue from 'async/queue';

import { QUEUE_CONCURRENCY } from '../../constants';
import { ipcRendererFunc, isElectron } from '../../utils/isElectron';

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

export const killQueue = () => {
  if (isElectron()) {
    const ipcRenderer = ipcRendererFunc();
    ipcRenderer.on('kill-queue', () => {
      ipcRenderer.removeAllListeners('kill-queue');
      q.kill();
    });
  }
};

killQueue();

export default q;
