import { takeLatest } from 'redux-saga/effects';
import mySaga, { getConfig } from '../saga';
import {
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
  startNodeSuccess,
} from '../reducer';
import * as appService from '../../../app/service';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

describe('RPC configuration saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every getRpcConfigsRequest action and call getConfig method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(getRpcConfigsRequest.type, getConfig)
    );
  });

  describe('getConfig method', () => {
    let getRpcConfig;
    let startNode;

    beforeEach(() => {
      getRpcConfig = jest.spyOn(appService, 'getRpcConfig');
      startNode = jest.spyOn(appService, 'startNode');
    });

    afterEach(() => {
      getRpcConfig.mockRestore();
      startNode.mockRestore();
    });

    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      getRpcConfig.mockImplementation(() =>
        Promise.resolve({
          success: true,
          data: {},
        })
      );
      startNode.mockImplementation(() => Promise.resolve({}));
      const dispatched = await dispatchedFunc(getConfig);
      expect(getRpcConfig).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        getRpcConfigsSuccess({}),
        startNodeRequest(),
        startNodeSuccess(),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      getRpcConfig.mockImplementation(() =>
        Promise.reject({ message: 'error occurred' })
      );
      startNode.mockImplementation(() => Promise.resolve({}));
      const dispatched = await dispatchedFunc(getConfig);
      expect(getRpcConfig).toBeCalledTimes(1);
      expect(dispatched).toEqual([getRpcConfigsFailure('error occurred')]);
    });

    it('should call api and dispatch failure action', async () => {
      getRpcConfig.mockImplementation(() =>
        Promise.resolve({ message: 'error occurred', success: false })
      );
      startNode.mockImplementation(() => Promise.resolve({}));
      const dispatched = await dispatchedFunc(getConfig);
      expect(getRpcConfig).toBeCalledTimes(1);
      expect(dispatched).toEqual([getRpcConfigsFailure('error occurred')]);
    });
  });
});
