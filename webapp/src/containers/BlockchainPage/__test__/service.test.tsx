import * as service from '../service';
import { mockAxios } from '../../../utils/testUtils/mockUtils';
import log from 'loglevel';
import {
  getBlock,
  getBlockHash,
  getBlockCount,
  handelFetchBlocks,
  getrawtransaction,
  expected,
} from './testData.json';
const errorMessage = 'Bad Request';

describe('Blockchain Page', () => {
  describe('handleFetchBlockData function', () => {
    it('should check for handleFetchBlockData', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        });
      mockAxios(post);
      const blockNumber = 99;
      const data = await service.handleFetchBlockData(blockNumber);
      expect(data).toEqual(expected.handleFetchBlockData);
      expect(post).toBeCalledTimes(2);
    });

    it('should check for error from getBlockHashData is comming handleFetchBlockData', async () => {
      const post = jest
        .fn()
        .mockRejectedValueOnce(errorMessage)
        .mockResolvedValueOnce({
          data: getBlock,
        });
      mockAxios(post);
      const blockNumber = 99;
      try {
        await service.handleFetchBlockData(blockNumber);
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(1);
      }
    });

    it('should check for error from getBlockData is comming handleFetchBlockData', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({ data: getBlockHash })
        .mockRejectedValueOnce(errorMessage);
      mockAxios(post);
      const blockNumber = 99;
      try {
        await service.handleFetchBlockData(blockNumber);
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(2);
      }
    });
  });

  describe('handleFetchBlockCount function', () => {
    it('should check for handleFetchBlockCount', async () => {
      const post = jest.fn().mockResolvedValueOnce({
        data: getBlockCount,
      });
      mockAxios(post);
      const data = await service.handleFetchBlockCount();
      expect(data).toEqual(expected.handleFetchBlockCount);
      expect(post).toBeCalledTimes(1);
    });

    it('should check for error in handleFetchBlockCount', async () => {
      const post = jest.fn().mockRejectedValueOnce(errorMessage);
      mockAxios(post);
      try {
        await service.handleFetchBlockCount();
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(1);
      }
    });
  });

  describe('handelFetchBlocks function', () => {
    it('should check for handelFetchBlocks', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: handelFetchBlocks.getBlockCount,
        })
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        });
      mockAxios(post);
      const data = await service.handelFetchBlocks(11, 10);
      expect(data).toEqual(expected.handelFetchBlocks);
      expect(post).toBeCalledTimes(3);
    });

    it('should check for error in getBlockCount handelFetchBlocks', async () => {
      const post = jest
        .fn()
        .mockRejectedValueOnce(errorMessage)
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        });
      mockAxios(post);
      try {
        await service.handelFetchBlocks(11, 10);
      } catch (err) {
        expect(err).toEqual(errorMessage);
        expect(post).toBeCalledTimes(1);
      }
    });

    it('should check for error in getBlockHash in handelFetchBlocks', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockCount,
        })
        .mockRejectedValueOnce(errorMessage)
        .mockResolvedValueOnce({
          data: getBlock,
        });
      mockAxios(post);
      try {
        await service.handelFetchBlocks(11, 10);
      } catch (err) {
        expect(err).toEqual(errorMessage);
        expect(post).toBeCalledTimes(2);
      }
    });

    it('should check for error in getBlockHash in handelFetchBlocks', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockCount,
        })
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockRejectedValueOnce(errorMessage);
      mockAxios(post);
      try {
        await service.handelFetchBlocks(11, 10);
      } catch (err) {
        expect(err).toEqual(errorMessage);
        expect(post).toBeCalledTimes(3);
      }
    });
  });

  describe('handelFetchTxns function', () => {
    it('should check for handelFetchTxns', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        })
        .mockResolvedValueOnce({
          data: getrawtransaction,
        });
      mockAxios(post);
      const blockNumber = 101;
      const pageNo = 1;
      const pageSize = 10;
      const data = await service.handelFetchTxns(blockNumber, pageNo, pageSize);
      expect(data).toEqual(expected.handelFetchTxns);
      expect(post).toBeCalledTimes(3);
    });

    it('should check for error if invalid data is passed to handelFetchTxns', async () => {
      const spy = jest.spyOn(log, 'error');
      const updatedGetrawtransaction = Object.assign({}, getrawtransaction);
      delete (updatedGetrawtransaction as any).result;
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        })
        .mockResolvedValueOnce({
          data: updatedGetrawtransaction,
        });
      mockAxios(post);
      const blockNumber = 101;
      const pageNo = 1;
      const pageSize = 10;
      try {
        await service.handelFetchTxns(blockNumber, pageNo, pageSize);
      } catch (err) {
        expect(err).toBeTruthy();
        expect(post).toBeCalledTimes(3);
        expect(spy).toBeCalledTimes(1);
      }
    });

    it('should check for error getBlockHash is rejected in handelFetchTxns', async () => {
      const post = jest
        .fn()
        .mockRejectedValueOnce(errorMessage)
        .mockResolvedValueOnce({
          data: getBlock,
        })
        .mockResolvedValueOnce({
          data: getrawtransaction,
        });
      mockAxios(post);
      const blockNumber = 101;
      const pageNo = 1;
      const pageSize = 10;
      try {
        await service.handelFetchTxns(blockNumber, pageNo, pageSize);
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(1);
      }
    });

    it('should check for error getBlock is rejected in handelFetchTxns', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockRejectedValueOnce(errorMessage)
        .mockResolvedValueOnce({
          data: getrawtransaction,
        });
      mockAxios(post);
      const blockNumber = 101;
      const pageNo = 1;
      const pageSize = 10;
      try {
        await service.handelFetchTxns(blockNumber, pageNo, pageSize);
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(2);
      }
    });

    it('should check for error getRawTransaction is rejected in handelFetchTxns', async () => {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: getBlockHash,
        })
        .mockResolvedValueOnce({
          data: getBlock,
        })
        .mockRejectedValueOnce(errorMessage);
      mockAxios(post);
      const blockNumber = 101;
      const pageNo = 1;
      const pageSize = 10;
      try {
        await service.handelFetchTxns(blockNumber, pageNo, pageSize);
      } catch (err) {
        expect(err).toBe(errorMessage);
        expect(post).toBeCalledTimes(3);
      }
    });
  });
});
