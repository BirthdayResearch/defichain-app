export interface IBlock {
  height: number;
  age: string;
  txns: number;
  size?: number;
}

export interface ITxn {
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

export interface IAddressAndAmount {
  address: string;
  amount: string;
}
