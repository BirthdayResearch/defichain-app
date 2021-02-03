import reducer, {
  initialState,
  fetchDataForQueryRequest,
  fetchDataForQuerySuccess,
  fetchDataForQueryFailure,
  resetDataForQuery,
  storeCliLog,
} from '../reducer';
import { handleDataForQuery } from './testData.json';

describe('cli slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchDataForQueryRequest reducers and actions', () => {
    it('should have empty result when fetchDataForQueryRequest is made', () => {
      const query = 'bitcoin-cli getnewaddress';
      const nextState = reducer(
        initialState,
        fetchDataForQueryRequest({ query })
      );
      const rootState = { cli: nextState };
      expect(rootState.cli.result).toEqual({});
      expect(rootState.cli.isLoading).toBeTruthy();
    });

    it('should propely set result when fetchDataForQuerySuccess is made', () => {
      const nextState = reducer(
        initialState,
        fetchDataForQuerySuccess(handleDataForQuery)
      );
      const rootState = { cli: nextState };
      expect(rootState.cli.result).toEqual(handleDataForQuery);
      expect(rootState.cli.isLoading).toBeFalsy();
    });

    it('should have empty result when fetchDataForQueryFailure is made', () => {
      const nextState = reducer(initialState, fetchDataForQueryFailure({}));
      const rootState = { cli: nextState };
      expect(rootState.cli.result).toEqual({});
      expect(rootState.cli.isLoading).toBeFalsy();
    });

    it('should have empty result when fetchDataForQueryFailure is made', () => {
      const nextState = reducer(initialState, resetDataForQuery());
      const rootState = { cli: nextState };
      expect(rootState.cli.result).toEqual({});
      expect(rootState.cli.isLoading).toBeFalsy();
      expect(rootState.cli.isError).toBe('');
    });

    it('should be store cliLog', () => {
      const payload = {};
      const nextState = reducer(initialState, storeCliLog(payload));
      const rootState = { cli: nextState };
      expect(rootState.cli.cliLog).toEqual(payload);
    });
  });
});
