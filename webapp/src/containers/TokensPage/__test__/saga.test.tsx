import { takeLatest } from 'redux-saga/effects';
import * as testData from './testData.json';
import mySaga, {
  fetchTokens,
  createTokens,
  tokenDestroy,
  fetchToken,
} from '../saga';
import {
  fetchTokensRequest,
  fetchTokensSuccess,
  fetchTokensFailure,
  createToken,
  createTokenSuccess,
  createTokenFailure,
  destroyToken,
  destroyTokenSuccess,
  destroyTokenFailure,
  fetchTokenInfo,
  fetchTokenInfoSuccess,
  fetchTokenInfoFailure,
} from '../reducer';
import * as service from '../service';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

const errorObj = {
  message: 'error occurred',
};

describe('Token page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchTokenInfo action and call fetchToken', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTokenInfo.type, fetchToken)
    );
  });

  it('should wait for every fetchTokensRequest action and call fetchTokens', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchTokensRequest.type, fetchTokens)
    );
  });

  it('should wait for every createToken action and call createTokens', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(createToken.type, createTokens)
    );
  });

  it('should wait for every destroyToken action and call tokenDestroy', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(destroyToken.type, tokenDestroy)
    );
  });

  describe('fetchTokens', () => {
    let handleFetchTokens;
    beforeEach(() => {
      handleFetchTokens = jest.spyOn(service, 'handleFetchTokens');
    });
    afterEach(() => {
      handleFetchTokens.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchTokens.mockImplementation(() =>
        Promise.resolve(testData.fetchTokensSuccess)
      );
      await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
    });

    it('should call api and dispatch success action when no data found', async () => {
      handleFetchTokens.mockImplementation(() => Promise.resolve([]));
      const dispatched = await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchTokensSuccess({
          tokens: [],
        }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchTokens.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchTokens);
      expect(handleFetchTokens).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchTokensFailure(errorObj.message)]);
    });
  });

  describe('createTokens method', () => {
    let handleCreateTokens;
    const tokenData = {};
    beforeEach(() => {
      handleCreateTokens = jest.spyOn(service, 'handleCreateTokens');
    });
    afterEach(() => {
      handleCreateTokens.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleCreateTokens.mockImplementation(() =>
        Promise.resolve(testData.saga.handleCreateTokens)
      );
      const dispatched = await dispatchedFunc(createTokens, {
        payload: { tokenData },
      });
      expect(handleCreateTokens).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        createTokenSuccess(testData.saga.handleCreateTokens),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleCreateTokens.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(createTokens, {
        payload: { tokenData },
      });
      expect(handleCreateTokens).toBeCalledTimes(1);
      expect(dispatched).toEqual([createTokenFailure(errorObj.message)]);
    });
  });

  describe('destroyToken method', () => {
    let handleDestroyToken;
    const tokenSymbol = 'DAT';
    beforeEach(() => {
      handleDestroyToken = jest.spyOn(service, 'handleDestroyToken');
    });
    afterEach(() => {
      handleDestroyToken.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleDestroyToken.mockImplementation(() =>
        Promise.resolve(testData.saga.handleDestroyToken)
      );
      const dispatched = await dispatchedFunc(tokenDestroy, {
        payload: { tokenSymbol },
      });
      expect(handleDestroyToken).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        destroyTokenSuccess(testData.saga.handleDestroyToken),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleDestroyToken.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(tokenDestroy, {
        payload: { tokenSymbol },
      });
      expect(handleDestroyToken).toBeCalledTimes(1);
      expect(dispatched).toEqual([destroyTokenFailure(errorObj.message)]);
    });
  });

  describe('fetchToken method', () => {
    let handleFetchToken;
    const tokenSymbol = 'DAT';
    beforeEach(() => {
      handleFetchToken = jest.spyOn(service, 'handleFetchToken');
    });
    afterEach(() => {
      handleFetchToken.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleFetchToken.mockImplementation(() =>
        Promise.resolve(testData.saga.handleFetchToken)
      );
      const dispatched = await dispatchedFunc(fetchToken, {
        payload: { tokenSymbol },
      });
      expect(handleFetchToken).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchTokenInfoSuccess({
          tokenInfo: testData.saga.handleFetchToken,
        }),
      ]);
    });

    it('should call api and dispatch failure action', async () => {
      handleFetchToken.mockImplementation(() => Promise.reject(errorObj));
      const dispatched = await dispatchedFunc(fetchToken, {
        payload: { tokenSymbol },
      });
      expect(handleFetchToken).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchTokenInfoFailure(errorObj.message)]);
    });
  });
});
