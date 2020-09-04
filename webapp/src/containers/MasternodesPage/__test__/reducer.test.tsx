import reducer, {
  initialState,
  fetchMasternodesRequest,
  fetchMasternodesSuccess,
  fetchMasternodesFailure,
  createMasterNode,
  createMasterNodeSuccess,
  createMasterNodeFailure,
  resignMasterNode,
  resignMasterNodeSuccess,
  resignMasterNodeFailure,
} from '../reducer';
import * as testData from './testData.json';
const errorOccurred = 'error Ocurred';

describe('masternode slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchMasternodesRequest reducers and actions', () => {
    it('should have empty masternodes and true isLoadingMasternodes information when fetchMasternodesRequest is made', () => {
      const nextState = reducer(initialState, fetchMasternodesRequest());
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.masternodes).toEqual([]);
      expect(rootState.masterNodes.isLoadingMasternodes).toBeTruthy();
    });
    it('should propely set masternodes when fetchMasternodesSuccess is made', () => {
      const masternodes = testData.fetchMasternodesSuccess;
      const nextState = reducer(
        initialState,
        fetchMasternodesSuccess({ masternodes })
      );
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.masternodes).toEqual(masternodes);
    });
    it('should have empty paymentRequest information when fetchMasternodesFailure is made', () => {
      const nextState = reducer(initialState, fetchMasternodesFailure({}));
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.masternodes).toEqual([]);
      expect(rootState.masterNodes.isLoadingMasternodes).toBeFalsy();
      expect(rootState.masterNodes.isMasternodesLoaded).toBeTruthy();
    });
  });

  describe('createMasterNode reducers and actions', () => {
    it('should properly set isWalletTxnsLoading information when createMasterNode is made', () => {
      const nextState = reducer(initialState, createMasterNode());
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeCreating).toEqual(true);
      expect(rootState.masterNodes.createdMasterNodeData).toEqual({});
      expect(rootState.masterNodes.isErrorCreatingMasterNode).toEqual('');
    });
    it('should propely set isWalletTxnsLoading, walletTxns and walletTxnCount information when createMasterNodeSuccess is made', () => {
      const payload = {
        masternodeOperator: '',
        masternodeOwner: '',
        masterNodeHash: '',
      };
      const nextState = reducer(initialState, createMasterNodeSuccess(payload));
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeCreating).toEqual(false);
      expect(rootState.masterNodes.createdMasterNodeData).toEqual(payload);
      expect(rootState.masterNodes.isErrorCreatingMasterNode).toEqual('');
    });
    it('should properly set isMasterNodeCreating, createdMasterNodeData, isErrorCreatingMasterNode information when createMasterNodeFailure is made', () => {
      const nextState = reducer(
        initialState,
        createMasterNodeFailure(errorOccurred)
      );
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeCreating).toEqual(false);
      expect(rootState.masterNodes.createdMasterNodeData).toEqual({});
      expect(rootState.masterNodes.isErrorCreatingMasterNode).toEqual(
        errorOccurred
      );
    });
  });

  describe('resignMasterNode reducers and actions', () => {
    // tslint:disable-next-line: max-line-length
    it('should properly set isBalanceFetching and isBalanceError information when resignMasterNode is made', () => {
      const nextState = reducer(initialState, resignMasterNode({}));
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeResigning).toEqual(true);
      expect(rootState.masterNodes.resignedMasterNodeData).toEqual('');
      expect(rootState.masterNodes.isErrorResigningMasterNode).toEqual('');
    });
    // tslint:disable-next-line: max-line-length
    it('should properly set isBalanceFetching and walletBalance information when resignMasterNodeSuccess is made', () => {
      const resignMasternode = '1223213123123';
      const nextState = reducer(
        initialState,
        resignMasterNodeSuccess(resignMasternode)
      );
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeResigning).toEqual(false);
      expect(rootState.masterNodes.resignedMasterNodeData).toEqual(
        resignMasternode
      );
      expect(rootState.masterNodes.isErrorResigningMasterNode).toEqual('');
    });
    it('should properly set isBalanceFetching, walletBalance and isBalanceError information when resignMasterNodeFailure is made', () => {
      const nextState = reducer(
        initialState,
        resignMasterNodeFailure(errorOccurred)
      );
      const rootState = { masterNodes: nextState };
      expect(rootState.masterNodes.isMasterNodeResigning).toEqual(false);
      expect(rootState.masterNodes.resignedMasterNodeData).toEqual('');
      expect(rootState.masterNodes.isErrorResigningMasterNode).toEqual(
        errorOccurred
      );
    });
  });
});
