import reducer, {
  initialState,
  fetchTokenInfo,
  fetchTokenInfoSuccess,
  fetchTokenInfoFailure,
  fetchTokensRequest,
  fetchTokensSuccess,
  fetchTokensFailure,
  createToken,
  createTokenSuccess,
  createTokenFailure,
  destroyToken,
  destroyTokenSuccess,
  destroyTokenFailure,
} from '../reducer';
import * as testData from './testData.json';

const errorOccurred = 'error Ocurred';

describe('token slice', () => {
  const nextState = initialState;

  it('should return the initial state', () => {
    const result = reducer(undefined, { type: undefined });
    expect(result).toEqual(nextState);
  });

  describe('fetchTokensRequest reducers and actions', () => {
    it('should have empty tokens and true isLoadingTokens information when fetchTokensRequest is made', () => {
      const nextState = reducer(initialState, fetchTokensRequest());
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokens).toEqual([]);
      expect(rootState.tokens.isLoadingTokens).toBeTruthy();
    });
    it('should propely set tokens when fetchTokensSuccess is made', () => {
      const tokens = testData.fetchTokensSuccess;
      const nextState = reducer(initialState, fetchTokensSuccess({ tokens }));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokens).toEqual(tokens);
    });
    it('should have empty information when fetchTokensFailure is made', () => {
      const nextState = reducer(initialState, fetchTokensFailure({}));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokens).toEqual([]);
      expect(rootState.tokens.isLoadingTokens).toBeFalsy();
      expect(rootState.tokens.isTokensLoaded).toBeTruthy();
    });
  });

  describe('fetchTokenInfo reducers and actions', () => {
    it('should have empty tokenInfo and true isLoadingTokenInfo information when fetchTokenInfo is made', () => {
      const payload = '';
      const nextState = reducer(initialState, fetchTokenInfo(payload));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokenInfo).toEqual({});
      expect(rootState.tokens.isLoadingTokenInfo).toBeTruthy();
    });
    it('should propely set tokens when fetchTokenInfoSuccess is made', () => {
      const tokenInfo = testData.fetchTokenInfoSuccess;
      const nextState = reducer(
        initialState,
        fetchTokenInfoSuccess({ tokenInfo })
      );
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokenInfo).toEqual(tokenInfo);
    });
    it('should have empty information when fetchTokenInfoFailure is made', () => {
      const nextState = reducer(initialState, fetchTokenInfoFailure({}));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.tokenInfo).toEqual({});
      expect(rootState.tokens.isLoadingTokenInfo).toBeFalsy();
      expect(rootState.tokens.isTokenInfoLoaded).toBeTruthy();
    });
  });

  describe('createToken reducers and actions', () => {
    it('should properly set isMasterNodeCreating information when token is made', () => {
      const payload = {};
      const nextState = reducer(initialState, createToken(payload));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenCreating).toEqual(true);
      expect(rootState.tokens.createdTokenData).toEqual({});
      expect(rootState.tokens.isErrorCreatingToken).toEqual('');
    });
    it('should propely set isTokenCreating, createdTokenData and isErrorCreatingToken information when createTokenSuccess is made', () => {
      const payload = {
        name: '',
        symbol: '',
        isDAT: false,
        decimal: '8',
        limit: '0',
        mintable: 'true',
        tradeable: 'true',
        collateralAddress: '',
      };
      const nextState = reducer(initialState, createTokenSuccess(payload));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenCreating).toEqual(false);
      expect(rootState.tokens.createdTokenData).toEqual(payload);
      expect(rootState.tokens.isErrorCreatingToken).toEqual('');
    });
    it('should properly set isTokenCreating, createdTokenData, isErrorCreatingToken information when createTokenFailure is made', () => {
      const nextState = reducer(
        initialState,
        createTokenFailure(errorOccurred)
      );
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenCreating).toEqual(false);
      expect(rootState.tokens.createdTokenData).toEqual({});
      expect(rootState.tokens.isErrorCreatingToken).toEqual(errorOccurred);
    });
  });

  describe('destroyToken reducers and actions', () => {
    // tslint:disable-next-line: max-line-length
    it('should properly set isTokenDestroying, destroyTokenData and isErrorDestroyingToken information when destroyToken is made', () => {
      const nextState = reducer(initialState, destroyToken({}));
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenDestroying).toEqual(true);
      expect(rootState.tokens.destroyTokenData).toEqual('');
      expect(rootState.tokens.isErrorDestroyingToken).toEqual('');
    });
    // tslint:disable-next-line: max-line-length
    it('should properly set isTokenDestroying, destroyTokenData and isErrorDestroyingToken information when resignMasterNodeSuccess is made', () => {
      const destroyToken = 'DAT';
      const nextState = reducer(
        initialState,
        destroyTokenSuccess(destroyToken)
      );
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenDestroying).toEqual(false);
      expect(rootState.tokens.destroyTokenData).toEqual(destroyToken);
      expect(rootState.tokens.isErrorDestroyingToken).toEqual('');
    });
    it('should properly set isTokenDestroying, destroyTokenData and isErrorDestroyingToken information when destroyTokenFailure is made', () => {
      const nextState = reducer(
        initialState,
        destroyTokenFailure(errorOccurred)
      );
      const rootState = { tokens: nextState };
      expect(rootState.tokens.isTokenDestroying).toEqual(false);
      expect(rootState.tokens.destroyTokenData).toEqual('');
      expect(rootState.tokens.isErrorDestroyingToken).toEqual(errorOccurred);
    });
  });
});
