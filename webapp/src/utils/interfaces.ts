export interface IBlock {
  height: number;
  age: string;
  txns: number;
  size?: number;
}

export interface IAddressAndAmount {
  address: string;
  amount: string;
}
