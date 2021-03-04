export interface IPCResponseModel<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ListUnspentModel {
  txid: string;
  vout: number;
  address: string;
  amount: number;
  confirmations: number;
  label?: string;
  scriptPubKey?: string;
  redeemScript?: string;
  witnessScript?: string;
  spendable?: boolean;
  solvable?: boolean;
  desc?: string;
  safe?: boolean;
}
