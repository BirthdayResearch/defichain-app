import reducer, {
  initialState,
  syncStatusRequest,
  syncStatusSuccess,
  syncStatusFailure,
  syncStatusPeersRequest,
  syncStatusPeersLoading,
  syncStatusPeersSuccess,
} from '../reducer';
import * as payload from './testData.json';

describe(' syncStatus reducers and actions', () => {
  it('should be check  syncStatusRequest', () => {
    const nextState = reducer(initialState, syncStatusRequest());
    const rootState = { syncstatus: nextState };
    expect(rootState.syncstatus.isLoading).toBeTruthy();
  });

  it('should be check for syncStatusSuccess', () => {
    const nextState = reducer(
      initialState,
      syncStatusSuccess(payload.synStatus)
    );
    const rootState = { syncstatus: nextState };
    expect(rootState.syncstatus.syncedPercentage).toEqual(
      payload.synStatus.syncedPercentage
    );
    expect(rootState.syncstatus.latestSyncedBlock).toEqual(
      payload.synStatus.latestSyncedBlock
    );
    expect(rootState.syncstatus.latestBlock).toEqual(
      payload.synStatus.latestBlock
    );
    expect(rootState.syncstatus.isLoading).toBeFalsy();
  });

  it('should be check for syncStatusFailure', () => {
    const nextState = reducer(
      initialState,
      syncStatusFailure(payload.syncingError)
    );
    const rootState = { syncstatus: nextState };
    expect(rootState.syncstatus.syncedPercentage).toEqual(0);
    expect(rootState.syncstatus.latestSyncedBlock).toEqual(0);
    expect(rootState.syncstatus.latestBlock).toEqual(0);
    expect(rootState.syncstatus.isLoading).toBeFalsy();
    expect(rootState.syncstatus.syncingError).toEqual(payload.syncingError);
  });

  it('should be check  syncStatusPeersRequest', () => {
    const nextState = reducer(initialState, syncStatusPeersRequest());
    const rootState = { syncstatus: nextState };
    expect(rootState.syncstatus.isPeersLoading).toBeTruthy();
  });

  it('should be check for syncStatusPeersLoading', () => {
    const nextState = reducer(
      initialState,
      syncStatusPeersLoading(payload.isLoading)
    );
    const rootState = { syncstatus: nextState };
    // expect(rootState.syncstatus.isPeersLoading).toBeTruthy();
  });

  it('should be check for syncStatusPeersSuccess', () => {
    const nextState = reducer(
      initialState,
      syncStatusPeersSuccess(payload.peers)
    );
    const rootState = { syncstatus: nextState };
    // expect(rootState.syncstatus.peers).toEqual(1);
    expect(rootState.syncstatus.syncingError).toEqual('');
  });

  it('should be check for syncStatusPeersFailure', () => {
    const nextState = reducer(
      initialState,
      syncStatusFailure(payload.syncingError)
    );
    const rootState = { syncstatus: nextState };
    expect(rootState.syncstatus.peers).toEqual(0);
    expect(rootState.syncstatus.isPeersLoading).toBeTruthy();
    expect(rootState.syncstatus.syncingError).toEqual(payload.syncingError);
  });
});
