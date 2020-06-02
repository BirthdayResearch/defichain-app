import PersistentStore from '../persistentStore';
import { runSaga } from 'redux-saga';
import axios from 'axios';

const mockPersistentStore = (getData, setData) => {
  PersistentStore.get = jest.fn(() => getData);
  PersistentStore.set = jest.fn(() => setData);
  return PersistentStore;
};

const mockAxios = mockFunc => {
  axios.create = jest.fn().mockImplementation(() => ({
    post: mockFunc,
  }));
};
const dispatchedFunc = async (method, payload = {}) => {
  const dispatched = Array();
  let action = {};
  if (payload) action = { payload };
  await runSaga(
    {
      dispatch: action => dispatched.push(action),
    },
    method,
    action
  );
  return dispatched;
};
export { mockPersistentStore, mockAxios, dispatchedFunc };
