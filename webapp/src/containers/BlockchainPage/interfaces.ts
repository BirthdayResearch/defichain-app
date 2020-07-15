export interface ITxn {
  hash: string;
  time: string;
  froms: {
    address: string;
    amount: number | string;
  }[];
  tos: {
    address: string;
    amount: number | string;
  }[];
  unit: string;
}

export interface IBlockData {
  nTxns: number;
  difficulty: number;
  height: number;
  bits: string;
  version: number;
  nonce: number;
  hash: string;
  merkleRoot: string;
}
