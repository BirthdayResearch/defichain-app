import { takeLatest } from 'redux-saga/effects';
import { handleDataForQuery as testData } from './testData.json';
import mySaga, { fetchDataForQuery } from '../saga';
import {
  fetchDataForQueryRequest,
  fetchDataForQuerySuccess,
  fetchDataForQueryFailure,
} from '../reducer';
import * as service from '../service';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

describe('Console page saga unit test', () => {
  const genObject = mySaga();

  it('should wait for every fetchDataForQueryRequest action and call fetchDataForQuery method', () => {
    expect(genObject.next().value).toEqual(
      takeLatest(fetchDataForQueryRequest.type, fetchDataForQuery)
    );
  });

  describe('fetchDataForQuery method', () => {
    let handleDataForQuery;
    beforeEach(() => {
      handleDataForQuery = jest.spyOn(service, 'handleDataForQuery');
    });
    afterEach(() => {
      handleDataForQuery.mockRestore();
    });
    afterAll(jest.clearAllMocks);
    it('should call api and dispatch success action', async () => {
      handleDataForQuery.mockImplementation(() => Promise.resolve(testData));
      const dispatched = await dispatchedFunc(fetchDataForQuery, {
        query: 'defi-cli getnewaddress',
      });
      expect(handleDataForQuery).toBeCalledTimes(1);
      expect(dispatched).toEqual([fetchDataForQuerySuccess(testData)]);
    });

    it('should call api and dispatch failure action', async () => {
      handleDataForQuery.mockImplementation(() =>
        Promise.reject({
          message: 'error while fetching query',
        })
      );
      const dispatched = await dispatchedFunc(fetchDataForQuery, {
        query: 'defi-cli getnewaddress',
      });
      expect(handleDataForQuery).toBeCalledTimes(1);
      expect(dispatched).toEqual([
        fetchDataForQueryFailure('error while fetching query'),
      ]);
    });
  });
});
