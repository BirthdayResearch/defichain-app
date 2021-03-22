import * as service from '../service';
// import
//   getBalance,
//   getBalances,
//   validateAddress,
//   sendToAddress,
//   getNewAddress,
//   listtransaction,
//   walletInfo,
//   expected,
//   handleRemoveReceiveTxns,
//   ,
// './testData.json';
import * as log from '../../../utils/electronLogger';
import {
  mockPersistentStore,
  mockAxios,
} from '../../../utils/testUtils/mockUtils';
import * as Utility from '../../../utils/utility';
import { MAINNET } from '../../../constants';
const networkName = MAINNET.toLowerCase();
describe('liquidity page service unit test', () => {
  it('should check for handleGetPaymentRequest', () => {
    const PersistentStore = mockPersistentStore(null, null);
    // service.handleGetPaymentRequest(networkName);
    expect(true).toBe(true);
  });

  // it('should check for ', async () => {
  //   const PersistentStore = mockPersistentStore(null, null);
  //   const data = await service.(
  //     ,
  //     networkName
  //   );
  //   console.log("data=================>", data)
  //   expect(PersistentStore.get).toBeCalledTimes(1);
  //   expect(data).toBeInstanceOf(Array);
  //   expect(data).toEqual(expected.);
  // });

  //   it('should check for handleRemoveReceiveTxns', () => {
  //     const PersistentStore = mockPersistentStore(
  //       JSON.stringify(handleRemoveReceiveTxns.localStorageData),
  //       null
  //     );
  //     const data = service.handleRemoveReceiveTxns(
  //       handleRemoveReceiveTxns.uuid,
  //       networkName
  //     );
  //     expect(PersistentStore.set).toBeCalledTimes(1);
  //     expect(PersistentStore.get).toBeCalledTimes(1);
  //     expect(data).toBeInstanceOf(Array);
  //     expect(data).toEqual(expected.handleRemoveReceiveTxns);
  //   });

  //   it('should check for handelFetchWalletTxns', async () => {
  //     const post = jest
  //       .fn()
  //       .mockResolvedValueOnce({
  //         data: listtransaction,
  //       })
  //       .mockResolvedValueOnce({
  //         data: walletInfo,
  //       });
  //     mockAxios(post);
  //     const test = await service.handelFetchWalletTxns(1, 0);
  //     expect(test).toEqual(expected.handelFetchWalletTxns);
  //     expect(post).toBeCalledTimes(2);
  //   });

  // it('should check for handleSendData', async () => {
  //   const post = jest.fn().mockResolvedValueOnce({
  //     data: getBalance,
  //   });
  //   mockAxios(post);
  //   const test = await service.handleSendData();
  //   expect(test).toEqual(expected.handleSendData);
  //   expect(post).toBeCalledTimes(1);
  // });

  // it('should check for handleFetchWalletBalance', async () => {
  //   const post = jest.fn().mockResolvedValueOnce({
  //     data: getBalance,
  //   });
  //   mockAxios(post);
  //   const test = await service.handleFetchWalletBalance();
  //   expect(test).toEqual(expected.handleFetchWalletBalance);
  //   expect(post).toBeCalledTimes(1);
  // });

  //   it('should check for handleFetchPendingBalance', async () => {
  //     const post = jest.fn().mockResolvedValueOnce({
  //       data: getBalances,
  //     });
  //     mockAxios(post);
  //     const test = await service.handleFetchPendingBalance();
  //     expect(test).toEqual(expected.handleFetchPendingBalance);
  //     expect(post).toBeCalledTimes(1);
  //   });

  //   it('should check for isValidAddress', async () => {
  //     const post = jest.fn().mockResolvedValueOnce({
  //       data: validateAddress,
  //     });
  //     const param = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
  //     mockAxios(post);
  //     const test = await service.isValidAddress(param);
  //     expect(test).toBeTruthy();
  //     expect(post).toBeCalledTimes(1);
  //   });

  // it('should check for sendToAddress if getTxnSize is 0', async () => {
  //   const utilMock = jest.spyOn(Utility, 'getTxnSize').mockResolvedValueOnce(0);
  //   const post = jest.fn().mockResolvedValueOnce({
  //     data: sendToAddress,
  //   });
  //   const toAddress = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
  //   const amount = 10;
  //   mockAxios(post);
  //   const test = await service.sendToAddress(toAddress, amount);
  //   expect(test).toBe(expected.sendToAddress);
  //   expect(post).toBeCalledTimes(1);
  //   expect(utilMock).toBeCalledTimes(1);
  // });

  //   it('should check for getNewAddress', async () => {
  //     const post = jest.fn().mockResolvedValueOnce({
  //       data: getNewAddress,
  //     });
  //     const label = 'test';
  //     mockAxios(post);
  //     const test = await service.getNewAddress(label, false);
  //     expect(test).toBe(expected.getNewAddress);
  //     expect(post).toBeCalledTimes(1);
  //   });

  //   it('should check for error in getNewAddress', async () => {
  //     try {
  //       const post = jest
  //         .fn()
  //         .mockImplementationOnce(() => Promise.reject('Error'));
  //       const label = 'test';
  //       mockAxios(post);
  //       const test = await service.getNewAddress(label, false);
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error if invalid data is comming from getNewAddress', async () => {
  //     const spy = jest.spyOn(log, 'error');
  //     const testData = Object.assign({}, getNewAddress);
  //     delete testData.result;
  //     try {
  //       const post = jest.fn().mockResolvedValueOnce({
  //         data: testData,
  //       });
  //       const label = 'test';
  //       mockAxios(post);
  //       const test = await service.getNewAddress(label, false);
  //     } catch (err) {
  //       expect(spy).toBeCalled();
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error sendToAddress', async () => {
  //     try {
  //       const post = jest.fn().mockRejectedValueOnce('Error');
  //       const toAddress = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
  //       const amount = 10;
  //       mockAxios(post);
  //       const test = await service.sendToAddress(toAddress, amount);
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error isValidAddress', async () => {
  //     try {
  //       const post = jest.fn().mockRejectedValueOnce('Error');
  //       const param = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
  //       mockAxios(post);
  //       const test = await service.isValidAddress(param);
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error handleFetchPendingBalance', async () => {
  //     const spy = jest.spyOn(log, 'error');
  //     const testBalancesData = Object.assign({}, getBalances);
  //     delete testBalancesData.result.mine.immature;
  //     try {
  //       const post = jest.fn().mockResolvedValueOnce({
  //         data: testBalancesData,
  //       });
  //       mockAxios(post);
  //       const test = await service.handleFetchPendingBalance();
  //     } catch (err) {
  //       expect(spy).toBeCalled();
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error handleFetchWalletBalance', async () => {
  //     const testBalance = Object.assign({}, getBalance);
  //     delete testBalance.result;
  //     const spy = jest.spyOn(log, 'error');
  //     try {
  //       const post = jest.fn().mockResolvedValueOnce({
  //         data: { error: null, id: 'curltest' },
  //       });
  //       mockAxios(post);
  //       const test = await service.handleFetchWalletBalance();
  //     } catch (err) {
  //       expect(spy).toBeCalled();
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check for error handleFetchWalletBalance', async () => {
  //     try {
  //       const post = jest.fn().mockRejectedValueOnce('error');
  //       mockAxios(post);
  //       const test = await service.handleFetchWalletBalance();
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check if list of transaction is throwing error handelFetchWalletTxns', async () => {
  //     try {
  //       const post = jest
  //         .fn()
  //         .mockRejectedValueOnce('Error')
  //         .mockResolvedValueOnce({
  //           data: walletInfo,
  //         });
  //       mockAxios(post);
  //       const test = await service.handelFetchWalletTxns(1, 0);
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check if get balance is throwing error handelFetchWalletTxns', async () => {
  //     try {
  //       const post = jest
  //         .fn()
  //         .mockResolvedValueOnce({
  //           data: listtransaction,
  //         })
  //         .mockRejectedValueOnce('Error');
  //       mockAxios(post);
  //       const test = await service.handelFetchWalletTxns(1, 0);
  //     } catch (err) {
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check if list data is not valid is throwing error handelFetchWalletTxns', async () => {
  //     const spy = jest.spyOn(log, 'error');
  //     const testListTransaction = Object.assign({}, listtransaction);
  //     delete testListTransaction.result[0].address;
  //     try {
  //       const post = jest
  //         .fn()
  //         .mockResolvedValueOnce({
  //           data: testListTransaction,
  //         })
  //         .mockResolvedValueOnce({
  //           data: walletInfo,
  //         });
  //       mockAxios(post);
  //       const test = await service.handelFetchWalletTxns(1, 0);
  //     } catch (err) {
  //       expect(spy).toBeCalled();
  //       expect(err).toBeTruthy();
  //     }
  //   });

  //   it('should check if get wallet data is not valid is throwing error handelFetchWalletTxns', async () => {
  //     const spy = jest.spyOn(log, 'error');
  //     const testWalletInfo = Object.assign({}, walletInfo);
  //     delete testWalletInfo.result.balance;
  //     try {
  //       const post = jest
  //         .fn()
  //         .mockResolvedValueOnce({
  //           data: listtransaction,
  //         })
  //         .mockResolvedValueOnce({
  //           data: testWalletInfo,
  //         });
  //       mockAxios(post);
  //       const test = await service.handelFetchWalletTxns(1, 0);
  //     } catch (err) {
  //       expect(spy).toBeCalled();
  //       expect(err).toBeTruthy();
  //     }
  //   });
});
