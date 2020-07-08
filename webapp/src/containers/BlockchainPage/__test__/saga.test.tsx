import { takeLatest } from 'redux-saga/effects';

// import mySaga, {
//   fetchBlocks,
//   fetchBlockData,
//   fetchBlockCount,
//   fetchTxns,
// } from '../saga';
import {
  fetchBlocksRequest,
  fetchBlocksSuccess,
  fetchBlocksFailure,
  fetchBlockDataRequest,
  fetchBlockDataSuccess,
  fetchBlockDataFailure,
  fetchBlockCountRequest,
  fetchBlockCountSuccess,
  fetchBlockCountFailure,
  fetchTxnsRequest,
  fetchTxnsSuccess,
  fetchTxnsFailure,
} from '../reducer';
import * as service from '../service';
import { expected } from './testData.json';
import { dispatchedFunc } from '../../../utils/testUtils/mockUtils';

/* For future use */

// describe('Wallet page saga unit test', () => {
//   const genObject = mySaga();

//   it('should wait for every fetchBlocksRequest action and call fetchBlocks method', () => {
//     expect(genObject.next().value).toEqual(
//       takeLatest(fetchBlocksRequest.type, fetchBlocks)
//     );
//   });

//   it('should wait for every fetchBlockCountRequest action and call fetchBlockCount method', () => {
//     expect(genObject.next().value).toEqual(
//       takeLatest(fetchBlockCountRequest.type, fetchBlockCount)
//     );
//   });

//   it('should wait for every fetchBlockDataRequest action and call fetchBlockData method', () => {
//     expect(genObject.next().value).toEqual(
//       takeLatest(fetchBlockDataRequest.type, fetchBlockData)
//     );
//   });

//   it('should wait for every fetchTxnsRequest action and call fetchTxns method', () => {
//     expect(genObject.next().value).toEqual(
//       takeLatest(fetchTxnsRequest.type, fetchTxns)
//     );
//   });

//   describe('fetchBlocks method', () => {
//     let handelFetchBlocks;

//     beforeEach(() => {
//       handelFetchBlocks = jest.spyOn(service, 'handelFetchBlocks');
//     });

//     afterEach(() => {
//       handelFetchBlocks.mockRestore();
//     });

//     afterAll(() => {
//       handelFetchBlocks.mockClear();
//     });

//     it('should call api and dispatch success action', async () => {
//       handelFetchBlocks.mockImplementation(() =>
//         Promise.resolve(expected.handelFetchBlocks)
//       );

//       const dispatched = await dispatchedFunc(fetchBlocks);

//       expect(handelFetchBlocks).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlocksSuccess(expected.handelFetchBlocks),
//       ]);
//     });

//     it('should call api and dispatch failure action', async () => {
//       handelFetchBlocks.mockImplementation(() =>
//         Promise.reject({ message: 'error in handelFetchBlocks' })
//       );

//       const dispatched = await dispatchedFunc(fetchBlocks);

//       expect(handelFetchBlocks).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlocksFailure('error in handelFetchBlocks'),
//       ]);
//     });
//   });

//   describe('fetchBlockData method', () => {
//     let handleFetchBlockData;

//     beforeEach(() => {
//       handleFetchBlockData = jest.spyOn(service, 'handleFetchBlockData');
//     });

//     afterEach(() => {
//       handleFetchBlockData.mockRestore();
//     });

//     afterAll(() => {
//       handleFetchBlockData.mockClear();
//     });

//     it('should call api and dispatch success action', async () => {
//       handleFetchBlockData.mockImplementation(() =>
//         Promise.resolve(expected.handleFetchBlockData)
//       );

//       const dispatched = await dispatchedFunc(fetchBlockData, {
//         blockNumber: 101,
//       });

//       expect(handleFetchBlockData).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlockDataSuccess(expected.handleFetchBlockData),
//       ]);
//     });

//     it('should call api and dispatch failure action', async () => {
//       handleFetchBlockData.mockImplementation(() =>
//         Promise.reject({ message: 'error while fetching block' })
//       );

//       const dispatched = await dispatchedFunc(fetchBlockData, {
//         blockNumber: 101,
//       });

//       expect(handleFetchBlockData).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlockDataFailure('error while fetching block'),
//       ]);
//     });
//   });

//   describe('fetchBlockCount method', () => {
//     let handleFetchBlockCount;

//     beforeEach(() => {
//       handleFetchBlockCount = jest.spyOn(service, 'handleFetchBlockCount');
//     });

//     afterEach(() => {
//       handleFetchBlockCount.mockRestore();
//     });

//     afterAll(() => {
//       handleFetchBlockCount.mockClear();
//     });

//     it('should call api and dispatch success action', async () => {
//       handleFetchBlockCount.mockImplementation(
//         () => expected.handleFetchBlockCount
//       );

//       const dispatched = await dispatchedFunc(fetchBlockCount);

//       expect(handleFetchBlockCount).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlockCountSuccess(expected.handleFetchBlockCount),
//       ]);
//     });

//     it('should call api and dispatch failure action', async () => {
//       handleFetchBlockCount.mockImplementation(() => {
//         throw new Error('Error in handleFetchBlockCount');
//       });

//       const dispatched = await dispatchedFunc(fetchBlockCount);

//       expect(handleFetchBlockCount).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchBlockCountFailure('Error in handleFetchBlockCount'),
//       ]);
//     });
//   });

//   describe('fetchTxns method', () => {
//     const blockNumber = 101;
//     const pageNo = 1;
//     const pageSize = 10;
//     let handelFetchTxns;

//     beforeEach(() => {
//       handelFetchTxns = jest.spyOn(service, 'handelFetchTxns');
//     });

//     afterEach(() => {
//       handelFetchTxns.mockRestore();
//     });

//     afterAll(() => {
//       handelFetchTxns.mockClear();
//     });

//     it('should call api and dispatch success action', async () => {
//       handelFetchTxns.mockImplementation(() => expected.handelFetchTxns);

//       const dispatched = await dispatchedFunc(fetchTxns, {
//         blockNumber,
//         pageNo,
//         pageSize,
//       });

//       expect(handelFetchTxns).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([fetchTxnsSuccess(expected.handelFetchTxns)]);
//     });

//     it('should call api and dispatch failure action', async () => {
//       handelFetchTxns.mockImplementation(() => {
//         throw new Error('Error in handelFetchTxns');
//       });

//       const dispatched = await dispatchedFunc(fetchTxns, {
//         blockNumber,
//         pageNo,
//         pageSize,
//       });

//       expect(handelFetchTxns).toHaveBeenCalledTimes(1);
//       expect(dispatched).toEqual([
//         fetchTxnsFailure('Error in handelFetchTxns'),
//       ]);
//     });
//   });
// });
