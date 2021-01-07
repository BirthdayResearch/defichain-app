import reducer, {
  initialState,
  syncStatusRequest,
  syncStatusSuccess,
  syncStatusFailure,
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
});
