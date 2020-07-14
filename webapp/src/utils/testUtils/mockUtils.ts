import PersistentStore from '../persistentStore';
import * as isElectron from '../isElectron';
import * as Notifications from '../notifications';
import log from 'loglevel';
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

const mockisElectron = () => {
  return jest.spyOn(isElectron, 'isElectron');
};
const mockIpcRenderer = () => {
  return jest.spyOn(isElectron, 'ipcRendererFunc');
};

const spyLogger = () => {
  return jest.spyOn(log, 'error');
};

const mockNotification = () => {
  return (
    jest
      .spyOn(Notifications, 'default')
      // tslint:disable-next-line: no-empty
      .mockImplementation(() => {})
  );
};
export {
  mockPersistentStore,
  mockAxios,
  dispatchedFunc,
  mockisElectron,
  mockIpcRenderer,
  spyLogger,
  mockNotification,
};
