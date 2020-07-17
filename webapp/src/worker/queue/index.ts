import queue from 'async/queue';

import { QUEUE_CONCURRENCY } from '../../constants';
import { ipcRendererFunc } from '../../utils/isElectron';

const ipcRenderer = ipcRendererFunc();

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

ipcRenderer.on('kill-queue', () => {
  ipcRenderer.removeAllListeners('kill-queue');
  q.kill();
});

export default q;
