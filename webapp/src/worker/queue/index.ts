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

if (isElectron()) {
  const ipcRenderer = ipcRendererFunc();
  ipcRenderer.on('kill-queue', () => {
    ipcRenderer.removeAllListeners('kill-queue');
    killQueue();
  });
}

export const killQueue = () => {
  if (q) q.kill();
};

export default q;
