// @ts-nocheck
import reducer, {
  initialState,
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
} from '../reducer';
import { payload } from './testData.json';

describe('wallet slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
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
      const nextState = reducer(initialState, fetchPaymentRequestsFailure());
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
      const nextState = reducer(initialState, fetchWalletTxnsFailure());
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
      const nextState = reducer(initialState, fetchSendDataFailure());
      const rootState = { wallet: nextState };
      expect(rootState.wallet.sendData).toEqual(initialState.sendData);
    });
  });

  describe('addReceiveTxnsRequest reducers and actions', () => {
    it('should have empty paymentRequest information when addReceiveTxnsRequest is made', () => {
      const nextState = reducer(initialState, addReceiveTxnsRequest());
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
      const nextState = reducer(initialState, removeReceiveTxnsRequest());
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
});
