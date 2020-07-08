import reducer, {
  initialState,
  getRpcConfigsRequest,
  getRpcConfigsSuccess,
  getRpcConfigsFailure,
  startNodeRequest,
  startNodeSuccess,
  startNodeFailure,
} from '../reducer';

describe('App slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('getRpcConfigsRequest reducers and actions', () => {
    it('should have empty result when getRpcConfigsRequest is made', () => {
      const nextState = reducer(initialState, getRpcConfigsRequest());
      const rootState = { app: nextState };
      expect(rootState.app.isFetching).toBeTruthy();
    });

    it('should propely set result when getRpcConfigsSuccess is made', () => {
      const nextState = reducer(initialState, getRpcConfigsSuccess({}));
      const rootState = { app: nextState };
      expect(rootState.app.isFetching).toBeFalsy();
      expect(rootState.app.rpcConfigError).toBe('');
    });

    it('should have empty result when getRpcConfigsFailure is made', () => {
      const nextState = reducer(initialState, getRpcConfigsFailure({}));
      const rootState = { app: nextState };
      expect(rootState.app.rpcConfigError).toEqual({});
      expect(rootState.app.rpcRemotes).toEqual([]);
      expect(rootState.app.rpcConfig).toEqual({
        rpcauth: '',
        rpcconnect: '',
        rpcport: '',
      });
      expect(rootState.app.isFetching).toBeFalsy();
    });
  });

  describe('startNodeRequest reducers and actions', () => {
    it('should have empty result when startNodeRequest is made', () => {
      const nextState = reducer(initialState, startNodeRequest());
      const rootState = { app: nextState };
      expect(rootState.app.isFetching).toBeTruthy();
    });

    it('should propely set result when startNodeSuccess is made', () => {
      const nextState = reducer(initialState, startNodeSuccess());
      const rootState = { app: nextState };
      expect(rootState.app.isRunning).toBeTruthy();
      expect(rootState.app.isFetching).toBeFalsy();
      expect(rootState.app.rpcConfigError).toEqual('');
    });

    it('should have empty result when startNodeFailure is made', () => {
      const nextState = reducer(
        initialState,
        startNodeFailure('error occurred')
      );
      const rootState = { app: nextState };
      expect(rootState.app.isRunning).toBeFalsy();
      expect(rootState.app.isFetching).toBeFalsy();
      expect(rootState.app.nodeError).toEqual('error occurred');
    });
  });
});
