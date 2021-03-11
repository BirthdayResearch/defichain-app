import * as service from '../service';
import {
  getBalance,
  getBalances,
  getNewAddress,
  listtransaction,
  walletInfo,
  expected,
  handelRemoveReceiveTxns,
} from './testData.json';
import * as log from '../../../utils/electronLogger';
import {
  mockPersistentStore,
  mockAxios,
} from '../../../utils/testUtils/mockUtils';
import { MAINNET } from '../../../constants';
import BigNumber from 'bignumber.js';
const networkName = MAINNET.toLowerCase();
describe('Wallet page service unit test', () => {
  it('should check for handleGetPaymentRequest', () => {
    const PersistentStore = mockPersistentStore(null, null);
    service.handleGetPaymentRequest(networkName);
    expect(PersistentStore.get).toBeCalledTimes(1);
  });

  it('should check for handelRemoveReceiveTxns', () => {
    const PersistentStore = mockPersistentStore(
      JSON.stringify(handelRemoveReceiveTxns.localStorageData),
      null
    );
    const data = service.handelRemoveReceiveTxns(
      handelRemoveReceiveTxns.uuid,
      networkName
    );
    expect(PersistentStore.set).toBeCalledTimes(1);
    expect(PersistentStore.get).toBeCalledTimes(1);
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(expected.handelRemoveReceiveTxns);
  });

  it('should check for handelFetchWalletTxns', async () => {
    const post = jest
      .fn()
      .mockResolvedValueOnce({
        data: listtransaction,
      })
      .mockResolvedValueOnce({
        data: walletInfo,
      });
    mockAxios(post);
    const test = await service.handelFetchWalletTxns(1, 0);
    expect(test).toEqual(expected.handelFetchWalletTxns);
    expect(post).toBeCalledTimes(2);
  });

  it('should check for handleFetchPendingBalance', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getBalances,
    });
    mockAxios(post);
    const test = await service.handleFetchPendingBalance();
    expect(test).toEqual(expected.handleFetchPendingBalance);
    expect(post).toBeCalledTimes(1);
  });

  it('should check for getNewAddress', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getNewAddress,
    });
    const label = 'test';
    mockAxios(post);
    const test = await service.getNewAddress(label, false);
    expect(test).toBe(expected.getNewAddress);
    expect(post).toBeCalledTimes(1);
  });

  it('should check for error in getNewAddress', async () => {
    try {
      const post = jest
        .fn()
        .mockImplementationOnce(() => Promise.reject('Error'));
      const label = 'test';
      mockAxios(post);
      const test = await service.getNewAddress(label, false);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check for error if invalid data is comming from getNewAddress', async () => {
    const spy = jest.spyOn(log, 'error');
    const testData = Object.assign({}, getNewAddress);
    (testData as any).result = null;
    try {
      const post = jest.fn().mockResolvedValueOnce({
        data: testData,
      });
      const label = 'test';
      mockAxios(post);
      const test = await service.getNewAddress(label, false);
    } catch (err) {
      expect(spy).toBeCalled();
      expect(err).toBeTruthy();
    }
  });

  it('should check for error sendToAddress', async () => {
    try {
      const post = jest.fn().mockRejectedValueOnce('Error');
      const toAddress = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
      const amount = new BigNumber(10);
      mockAxios(post);
      const test = await service.sendToAddress(toAddress, amount);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check for error handleFetchPendingBalance', async () => {
    const spy = jest.spyOn(log, 'error');
    const testBalancesData = Object.assign({}, getBalances);
    delete (testBalancesData as any).result.mine.immature;
    try {
      const post = jest.fn().mockResolvedValueOnce({
        data: testBalancesData,
      });
      mockAxios(post);
      const test = await service.handleFetchPendingBalance();
    } catch (err) {
      expect(spy).toBeCalled();
      expect(err).toBeTruthy();
    }
  });

  it('should check for error handleFetchWalletBalance', async () => {
    const testBalance = Object.assign({}, getBalance);
    delete (testBalance as any).result;
    const spy = jest.spyOn(log, 'error');
    try {
      const post = jest.fn().mockResolvedValueOnce({
        data: { error: null, id: 'curltest' },
      });
      mockAxios(post);
      const test = await service.handleFetchWalletBalance();
    } catch (err) {
      expect(spy).toBeCalled();
      expect(err).toBeTruthy();
    }
  });

  it('should check for error handleFetchWalletBalance', async () => {
    try {
      const post = jest.fn().mockRejectedValueOnce('error');
      mockAxios(post);
      const test = await service.handleFetchWalletBalance();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check if list of transaction is throwing error handelFetchWalletTxns', async () => {
    try {
      const post = jest
        .fn()
        .mockRejectedValueOnce('Error')
        .mockResolvedValueOnce({
          data: walletInfo,
        });
      mockAxios(post);
      const test = await service.handelFetchWalletTxns(1, 0);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check if get balance is throwing error handelFetchWalletTxns', async () => {
    try {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: listtransaction,
        })
        .mockRejectedValueOnce('Error');
      mockAxios(post);
      const test = await service.handelFetchWalletTxns(1, 0);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should check if list data is not valid is throwing error handelFetchWalletTxns', async () => {
    const spy = jest.spyOn(log, 'error');
    const testListTransaction = Object.assign({}, listtransaction);
    delete (testListTransaction as any).result[0].address;
    try {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: testListTransaction,
        })
        .mockResolvedValueOnce({
          data: walletInfo,
        });
      mockAxios(post);
      const test = await service.handelFetchWalletTxns(1, 0);
    } catch (err) {
      expect(spy).toBeCalled();
      expect(err).toBeTruthy();
    }
  });

  it('should check if get wallet data is not valid is throwing error handelFetchWalletTxns', async () => {
    const spy = jest.spyOn(log, 'error');
    const testWalletInfo = Object.assign({}, walletInfo);
    delete (testWalletInfo as any).result.balance;
    try {
      const post = jest
        .fn()
        .mockResolvedValueOnce({
          data: listtransaction,
        })
        .mockResolvedValueOnce({
          data: testWalletInfo,
        });
      mockAxios(post);
      const test = await service.handelFetchWalletTxns(1, 0);
    } catch (err) {
      expect(spy).toBeCalled();
      expect(err).toBeTruthy();
    }
  });
});
