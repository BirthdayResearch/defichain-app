import BigNumber from 'bignumber.js';

export interface IBlock {
  hash: string;
  size: number;
  height: number;
  version: number;
  merkleRoot: string;
  txnIds: string[];
  nonce: number;
  bits: string;
  difficulty: number;
  time: string;
  nTxns: number;
}

export interface ITxn {
  height: number;
  address: string;
  category: string;
  amount: number;
  fee: number;
  confirmations: number;
  blockHash: string;
  txnId: string;
  time: string;
  timeReceived: string;
  unit: string;
}

export interface IParseTxn {
  hash: string;
  time: string;
  tos: IAddressAndAmount[];
  unit: string;
}

export interface IRawTxn {
  txid: string;
  hash: string;
  vin: IVin[];
  vout: IVout[];
  blockhash: string;
  blocktime: string;
}

export interface IAddressAndAmount {
  address: string;
  amount: string;
}
export interface IVin {
  txid: string;
  vout: number;
}

export interface IVout {
  value: BigNumber;
  n: number;
  scriptPubKey: object;
}

export interface IMasternodeCreatorInfo {
  operatorAuthAddress: string;
  collateralAddress: string;
}

export interface ITokenCreatorInfo {
  symbol: string;
  name?: string;
  isDAT?: boolean;
  decimal?: number;
  limit?: number;
  mintable?: boolean;
  tradeable?: boolean;
  collateralAddress: string;
}

export interface ITokenMintInfo {
  amount: number;
  hash: string;
  address: string;
}

export interface ITokenUpdatorInfo {
  token: string;
  name?: string;
  isDAT?: boolean;
  decimal?: number;
  limit?: number;
  mintable?: boolean;
  tradeable?: boolean;
  collateralAddress?: string;
}

export interface IToken {
  hash: string;
  name: string;
  symbol: string;
  symbolKey: string;
  isDAT: boolean;
  decimal: number;
  limit: number;
  mintable: boolean;
  tradeable: boolean;
  isLPS: boolean;
  amount?: number;
  isSPV?: boolean;
  displayName?: string;
}

export interface ITokenCard {
  data: IToken;
  handleCardClick: (symbol: string, hash: string) => void;
}

export interface IWalletTokenCard {
  symbolKey: string;
  hash: string;
  name?: string;
  symbol: string | null;
  isDAT?: boolean;
  isLPS?: boolean;
  decimal?: number;
  limit?: number;
  mintable?: boolean;
  tradeable?: boolean;
  creationTx?: string;
  creationHeight?: number;
  destructionTx?: string;
  destructionHeight?: any;
  amount: number | string | null;
  address: string;
}

export interface ITokenResponse {
  hash: string;
}

export interface ITokenBalanceInfo {
  hash: string;
  balance: string;
  isPopularToken: boolean;
}

export interface IAddressAndAmount {
  amount: string;
  address: string;
  label?: string;
}
