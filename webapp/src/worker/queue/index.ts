import queue from 'async/queue';
import { QUEUE_CONCURRENCY } from '../../constants';

const worker = (task, callback) => {
  task
    .methodName(...task.params)
    .then(result => {
      callback(null, result);
    })
    .catch(e => {
      callback(e);
    });
};

const q = queue(worker, QUEUE_CONCURRENCY);

export default q;
