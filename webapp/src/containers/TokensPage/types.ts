export interface TokensState {
  tokenInfo: any;
  tokens: [];
  transfers: [];
  isLoadingTokenInfo: boolean;
  isTokenInfoLoaded: boolean;
  isTokensLoaded: boolean;
  isLoadingTokens: boolean;
  isLoadingTransfers: boolean;
  isTransfersLoaded: boolean;
  isTokenCreating: boolean;
  createdTokenData: any;
  isErrorCreatingToken: string;
  isTokenMinting: boolean;
  mintedTokenData: any;
  isErrorMintingToken: string;
  isTokenUpdating: boolean;
  updatedTokenData: any;
  isErrorUpdatingToken: string;
  isTokenDestroying: boolean;
  destroyTokenData: string;
  isErrorDestroyingToken: string;
}
