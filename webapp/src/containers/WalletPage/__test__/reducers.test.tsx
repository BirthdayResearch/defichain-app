import reducer, {
  initialState,
  fetchAccountTokensRequest,
  fetchAccountTokensSuccess,
  fetchAccountTokensFailure,
  accountHistoryCountRequest,
  accountHistoryCountSuccess,
  accountHistoryCountFailure,
  fetchPaymentRequest,
  fetchPaymentRequestsSuccess,
  fetchPaymentRequestsFailure,
  fetchWalletTxnsRequest,
  fetchWalletTxnsSuccess,
  fetchWalletTxnsFailure,
  fetchWalletBalanceRequest,
  fetchWalletBalanceSuccess,
  fetchWalletBalanceFailure,
  fetchPendingBalanceRequest,
  fetchPendingBalanceSuccess,
  fetchPendingBalanceFailure,
  fetchSendDataRequest,
  fetchSendDataSuccess,
  fetchSendDataFailure,
  addReceiveTxnsRequest,
  addReceiveTxnsSuccess,
  addReceiveTxnsFailure,
  removeReceiveTxnsRequest,
  removeReceiveTxnsSuccess,
  removeReceiveTxnsFailure,
  fetchTokensSuccess,
  fetchTokensFailure,
  fetchTokensRequest,
  setBlockChainInfo,
  createWalletRequest,
  createWalletSuccess,
  createWalletFailure,
  resetCreateWalletError,
  restoreWalletRequest,
  restoreWalletSuccess,
  restoreWalletFailure,
  resetRestoreWalletError,
  setIsWalletCreatedRequest,
  fetchWalletTokenTransactionsListRequestSuccess,
  fetchWalletTokenTransactionsListRequestFailure,
  fetchWalletTokenTransactionsListRequestStop,
  checkRestartCriteriaRequestLoading,
  checkRestartCriteriaRequestSuccess,
  checkRestartCriteriaRequestFailure,
  fetchBlockDataForTrxRequestLoading,
  fetchBlockDataForTrxRequestSuccess,
  fetchBlockDataForTrxRequestFailure,
  fetchWalletTokenTransactionsListResetRequest,
} from '../reducer';
import {
  payload,
  accountTokens,
  accountHistoryCount,
  tokens,
  blockChainInfo,
  listAccountHistoryDataError,
  restartCriteria,
  combineAccountHistoryData,
} from './testData.json';

describe('wallet slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchAccountTokensRequest reducers and actions', () => {
    it('should be check fetchAccountTokensRequest', () => {
      const nextState = reducer(initialState, fetchAccountTokensRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isAccountLoadingTokens).toBeTruthy();
    });
    it('should propely set accountTokens information when fetchAccountTokensSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchAccountTokensSuccess({ accountTokens })
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.accountTokens).toEqual(accountTokens);
      expect(rootState.wallet.isAccountLoadingTokens).toBeFalsy();
      expect(rootState.wallet.isAccountTokensLoaded).toBeTruthy();
    });
    it('should have empty accountTokens information when fetchAccountTokensFailure is made', () => {
      const nextState = reducer(initialState, fetchAccountTokensFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.accountTokens).toEqual([]);
      expect(rootState.wallet.isAccountLoadingTokens).toBeFalsy();
      expect(rootState.wallet.isAccountTokensLoaded).toBeTruthy();
    });
  });
  describe('fetchTokensRequest reducers and actions', () => {
    it('should be check fetchTokensRequest', () => {
      const nextState = reducer(initialState, fetchTokensRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isLoadingTokens).toBeTruthy();
    });
    it('should propely set tokens information when fetchTokensSuccess is made', () => {
      const nextState = reducer(initialState, fetchTokensSuccess({ tokens }));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.tokens).toEqual(tokens);
      expect(rootState.wallet.isLoadingTokens).toBeFalsy();
      expect(rootState.wallet.isTokensLoaded).toBeTruthy();
    });
    it('should have empty accountTokens information when fetchTokensFailure is made', () => {
      const nextState = reducer(initialState, fetchTokensFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.tokens).toEqual([]);
      expect(rootState.wallet.isLoadingTokens).toBeFalsy();
      expect(rootState.wallet.isTokensLoaded).toBeTruthy();
    });
  });

  describe('accountHistoryCountRequest reducers and actions', () => {
    it('should be check accountHistoryCountRequest', () => {
      const nextState = reducer(initialState, accountHistoryCountRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.accountHistoryCount).toEqual('');
    });
    it('should propely set accountHistoryCount information when accountHistoryCountSuccess is made', () => {
      const nextState = reducer(
        initialState,
        accountHistoryCountSuccess({ accountHistoryCount })
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.accountHistoryCount).toEqual(accountHistoryCount);
      expect(rootState.wallet.accountHistoryCountLoading).toBeFalsy();
      expect(rootState.wallet.accountHistoryCountLoaded).toBeTruthy();
    });
    it('should have empty accountHistoryCount information when accountHistoryCountFailure is made', () => {
      const nextState = reducer(initialState, accountHistoryCountFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.accountTokens).toEqual([]);
      expect(rootState.wallet.accountHistoryCountLoading).toBeFalsy();
      expect(rootState.wallet.accountHistoryCountLoaded).toBeTruthy();
    });
  });

  describe('fetchPaymentRequest reducers and actions', () => {
    it('should have empty paymentRequest information when fetchPaymentRequest is made', () => {
      const nextState = reducer(initialState, fetchPaymentRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
    it('should propely set paymentRequest information when fetchPaymentRequestsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchPaymentRequestsSuccess(payload.paymentRequests)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual(payload.paymentRequests);
    });
    it('should have empty paymentRequest information when fetchPaymentRequestsfailure is made', () => {
      const nextState = reducer(initialState, fetchPaymentRequestsFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
  });

  describe('fetchWalletTxnsRequest reducers and actions', () => {
    it('should properly set isWalletTxnsLoading information when fetchWalletTxnsRequest is made', () => {
      const nextState = reducer(initialState, fetchWalletTxnsRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.walletTxns).toEqual([]);
      expect(rootState.wallet.walletTxnCount).toEqual(0);
      expect(rootState.wallet.isWalletTxnsLoading).toEqual(true);
    });
    it('should propely set isWalletTxnsLoading, walletTxns and walletTxnCount information when fetchWalletTxnsSuccess is made', () => {
      const { walletTxns, walletTxnCount } = payload;
      const nextState = reducer(
        initialState,
        fetchWalletTxnsSuccess({ walletTxns, walletTxnCount })
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.walletTxns).toEqual(walletTxns);
      expect(rootState.wallet.walletTxnCount).toEqual(walletTxnCount);
      expect(rootState.wallet.isWalletTxnsLoading).toEqual(false);
    });
    it('should properly set isWalletTxnsLoading and walletTxns information when fetchWalletTxnsFailure is made', () => {
      const nextState = reducer(initialState, fetchWalletTxnsFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.walletTxns).toEqual([]);
      expect(rootState.wallet.walletTxnCount).toEqual(0);
      expect(rootState.wallet.isWalletTxnsLoading).toEqual(false);
    });
  });

  describe('fetchWalletBalanceRequest reducers and actions', () => {
    // tslint:disable-next-line: max-line-length
    it('should properly set isBalanceFetching and isBalanceError information when fetchWalletBalanceRequest is made', () => {
      const nextState = reducer(initialState, fetchWalletBalanceRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isBalanceError).toEqual('');
      expect(rootState.wallet.isBalanceFetching).toEqual(true);
    });
    // tslint:disable-next-line: max-line-length
    it('should properly set isBalanceFetching and walletBalance information when fetchWalletBalanceSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchWalletBalanceSuccess(payload.walletBalance)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.walletBalance).toEqual(payload.walletBalance);
      expect(rootState.wallet.isBalanceFetching).toEqual(false);
    });
    it('should properly set isBalanceFetching, walletBalance and isBalanceError information when fetchWalletBalanceFailure is made', () => {
      const error = new Error('Error while fetching balance');
      const payload = error.message;
      const nextState = reducer(
        initialState,
        fetchWalletBalanceFailure(payload)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isBalanceError).toEqual(payload);
      expect(rootState.wallet.walletBalance).toEqual(0);
      expect(rootState.wallet.isBalanceFetching).toEqual(false);
    });
  });

  describe('fetchPendingBalanceRequest reducers and actions', () => {
    it('should properly set isPendingBalanceFetching and isPendingBalanceError information when fetchPendingBalanceRequest is made', () => {
      const nextState = reducer(initialState, fetchPendingBalanceRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isPendingBalanceError).toEqual('');
      expect(rootState.wallet.isPendingBalanceFetching).toEqual(true);
    });
    it('should properly set isPendingBalanceFetching and pendingBalance information when fetchPendingBalanceSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchPendingBalanceSuccess(payload.pendingBalance)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.pendingBalance).toEqual(payload.pendingBalance);
      expect(rootState.wallet.isPendingBalanceFetching).toEqual(false);
    });
    it('should properly set isPendingBalanceFetching, pendingBalance and isPendingBalanceError information when fetchPendingBalanceFailure is made', () => {
      const error = new Error('Error while fetching pending balance');
      const payload = error.message;
      const nextState = reducer(
        initialState,
        fetchPendingBalanceFailure(payload)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isPendingBalanceError).toEqual(payload);
      expect(rootState.wallet.pendingBalance).toEqual(0);
      expect(rootState.wallet.isPendingBalanceFetching).toEqual(false);
    });
  });

  describe('fetchSendDataRequest reducers and actions', () => {
    it('should have default information when fetchSendDataRequest is made', () => {
      const nextState = reducer(initialState, fetchSendDataRequest());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.sendData).toEqual(initialState.sendData);
    });
    it('should properly set sendData information when fetchSendDataSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchSendDataSuccess({ data: payload.sendData })
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.sendData).toEqual(payload.sendData);
    });
    it('should properly set sendData information when fetchSendDataFailure is made', () => {
      const nextState = reducer(initialState, fetchSendDataFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.sendData).toEqual(initialState.sendData);
    });
  });

  describe('addReceiveTxnsRequest reducers and actions', () => {
    it('should have empty paymentRequest information when addReceiveTxnsRequest is made', () => {
      const nextState = reducer(initialState, addReceiveTxnsRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
    it('should propely set paymentRequest information when addReceiveTxnsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        addReceiveTxnsSuccess(payload.paymentRequests)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual(payload.paymentRequests);
    });
    it('should have empty paymentRequest information when addReceiveTxnsFailure is made', () => {
      const nextState = reducer(initialState, addReceiveTxnsFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
  });

  describe('removeReceiveTxnsRequest reducers and actions', () => {
    it('should have empty paymentRequest information when removeReceiveTxnsRequest is made', () => {
      const nextState = reducer(initialState, removeReceiveTxnsRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
    it('should propely set paymentRequest information when removeReceiveTxnsSuccess is made', () => {
      const nextState = reducer(
        initialState,
        removeReceiveTxnsSuccess(payload.paymentRequests)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual(payload.paymentRequests);
    });
    it('should have empty paymentRequest information when removeReceiveTxnsFailure is made', () => {
      const nextState = reducer(initialState, removeReceiveTxnsFailure({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.paymentRequests).toEqual([]);
    });
  });

  describe('setBlockChainInfo reducers and actions', () => {
    it('should propely set blockChainInfo information when setBlockChainInfo is made', () => {
      const nextState = reducer(
        initialState,
        setBlockChainInfo(blockChainInfo)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.blockChainInfo).toEqual(blockChainInfo);
    });
  });

  describe('createWalletRequest reducers and actions', () => {
    it('should have empty paymentRequest information when createWalletRequest is made', () => {
      const nextState = reducer(initialState, createWalletRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletCreating).toBeTruthy();
      expect(rootState.wallet.isErrorCreatingWallet).toEqual('');
    });
    it('should be check createWalletSuccess ', () => {
      const nextState = reducer(initialState, createWalletSuccess());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletCreating).toBeFalsy();
      expect(rootState.wallet.isErrorCreatingWallet).toEqual('');
    });
    it('should have empty isErrorCreatingWallet information when createWalletFailure is made', () => {
      const nextState = reducer(
        initialState,
        createWalletFailure(payload.ErrorCreatingWallet)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletCreating).toBeFalsy();
      expect(rootState.wallet.isErrorCreatingWallet).toEqual(
        payload.ErrorCreatingWallet
      );
    });
    it('should be check resetCreateWalletError ', () => {
      const nextState = reducer(initialState, resetCreateWalletError({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletCreating).toBeFalsy();
      expect(rootState.wallet.isErrorCreatingWallet).toEqual('');
    });
  });

  describe('restoreWalletRequest reducers and actions', () => {
    it('should be check restoreWalletRequest is made', () => {
      const nextState = reducer(initialState, restoreWalletRequest({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletRestoring).toBeTruthy();
      expect(rootState.wallet.isErrorRestoringWallet).toEqual('');
    });
    it('should be check removeReceiveTxnsSuccess is made', () => {
      const nextState = reducer(initialState, restoreWalletSuccess());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletRestoring).toBeFalsy();
      expect(rootState.wallet.isErrorRestoringWallet).toEqual('');
    });
    it('should have empty isErrorRestoringWallet information when restoreWalletFailure is made', () => {
      const nextState = reducer(
        initialState,
        restoreWalletFailure(payload.ErrorRestoringWallet)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletRestoring).toBeFalsy();
      expect(rootState.wallet.isErrorRestoringWallet).toEqual(
        payload.ErrorRestoringWallet
      );
    });
    it('should be check resetRestoreWalletError is made', () => {
      const nextState = reducer(initialState, resetRestoreWalletError({}));
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletRestoring).toBeFalsy();
      expect(rootState.wallet.isErrorRestoringWallet).toEqual('');
    });
  });

  describe('setIsWalletCreatedRequest reducers and actions', () => {
    it('should propely set isWalletCreatedFlag information when setIsWalletCreatedRequest is made', () => {
      const nextState = reducer(
        initialState,
        setIsWalletCreatedRequest(payload['walletCreatedFlag '])
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.isWalletCreatedFlag).toEqual(
        payload['walletCreatedFlag ']
      );
    });
  });

  describe('fetchWalletTokenTransactionsListRequestSuccess reducers and actions', () => {
    it('should propely set listAccountHistoryData information when addReceiveTxnsRequest is made', () => {
      const nextState = reducer(
        initialState,
        fetchWalletTokenTransactionsListRequestSuccess(payload)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.listAccountHistoryData.isLoading).toBeFalsy();
      expect(rootState.wallet.listAccountHistoryData.isError).toEqual('');
      // expect(rootState.wallet.listAccountHistoryData.data).toEqual([]);
      expect(rootState.wallet.minBlockHeight).toEqual(payload.minBlockHeight);
    });
    it('should have empty listAccountHistoryData information when fetchWalletTokenTransactionsListRequestFailure is made', () => {
      const nextState = reducer(
        initialState,
        fetchWalletTokenTransactionsListRequestFailure(payload)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.listAccountHistoryData.isLoading).toBeFalsy();
      expect(rootState.wallet.listAccountHistoryData.isError).toEqual(
        listAccountHistoryDataError
      );
      expect(rootState.wallet.listAccountHistoryData.data).toEqual([]);
    });
    it('should be check  fetchWalletTokenTransactionsListRequestStop is made', () => {
      const nextState = reducer(
        initialState,
        fetchWalletTokenTransactionsListRequestStop()
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.listAccountHistoryData.isLoading).toBeFalsy();
      expect(rootState.wallet.listAccountHistoryData.stop).toBeTruthy();
    });
  });

  describe('checkRestartCriteriaRequestLoading reducers and actions', () => {
    it('should have empty restartCriteria information when removeReceiveTxnsRequest is made', () => {
      const nextState = reducer(
        initialState,
        checkRestartCriteriaRequestLoading()
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.restartCriteria.isLoading).toBeTruthy();
      expect(rootState.wallet.restartCriteria.data).toBeTruthy();
      expect(rootState.wallet.restartCriteria.isError).toEqual('');
    });
    it('should propely set restartCriteria information when checkRestartCriteriaRequestSuccess is made', () => {
      const nextState = reducer(
        initialState,
        checkRestartCriteriaRequestSuccess(restartCriteria)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.restartCriteria.isLoading).toBeFalsy();
      expect(rootState.wallet.restartCriteria.data).toEqual(restartCriteria);
      expect(rootState.wallet.restartCriteria.isError).toEqual('');
    });
    it('should have empty restartCriteria information when checkRestartCriteriaRequestFailure is made', () => {
      const nextState = reducer(
        initialState,
        checkRestartCriteriaRequestFailure({})
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.restartCriteria.isLoading).toBeFalsy();
      expect(rootState.wallet.restartCriteria.data).toBeTruthy();
      expect(rootState.wallet.restartCriteria.isError).toEqual({});
    });
  });

  describe('fetchBlockDataForTrxRequestLoading reducers and actions', () => {
    it('should have empty combineAccountHistoryData information when fetchBlockDataForTrxRequestLoading is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlockDataForTrxRequestLoading(combineAccountHistoryData)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.combineAccountHistoryData.isLoading).toBeTruthy();
      expect(rootState.wallet.combineAccountHistoryData.data).toEqual([]);
      expect(rootState.wallet.combineAccountHistoryData.isError).toEqual(
        combineAccountHistoryData
      );
    });
    it('should propely set combineAccountHistoryData information when fetchBlockDataForTrxRequestSuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlockDataForTrxRequestSuccess(combineAccountHistoryData)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.combineAccountHistoryData.isLoading).toBeFalsy();
      expect(rootState.wallet.combineAccountHistoryData.data).toEqual(
        combineAccountHistoryData
      );
      expect(rootState.wallet.combineAccountHistoryData.isError).toEqual('');
    });
    it('should have empty combineAccountHistoryData information when fetchBlockDataForTrxRequestFailure is made', () => {
      const nextState = reducer(
        initialState,
        fetchBlockDataForTrxRequestFailure(combineAccountHistoryData)
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.restartCriteria.isLoading).toBeFalsy();
      expect(rootState.wallet.restartCriteria.data).toBeTruthy();
      expect(rootState.wallet.restartCriteria.isError).toEqual('');
    });
  });

  describe('fetchWalletTokenTransactionsListResetRequest reducers and actions', () => {
    it('should propely set listAccountHistoryData information when fetchWalletTokenTransactionsListResetRequest is made', () => {
      const nextState = reducer(
        initialState,
        fetchWalletTokenTransactionsListResetRequest()
      );
      const rootState = { wallet: nextState };
      expect(rootState.wallet.listAccountHistoryData.isLoading).toBeFalsy();
      expect(rootState.wallet.listAccountHistoryData.isError).toEqual('');
      expect(rootState.wallet.listAccountHistoryData.data).toEqual([]);
    });
  });
});
