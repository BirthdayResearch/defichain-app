export interface AccountAmountModel {
  [key: string]: number;
}

export interface AccountOwnerModel {
  asm: string;
  hex: string;
  reqSigs: number;
  type: string;
  addresses: string[];
}

export interface AccountKeyItem {
  address: string;
  hash: string;
}

export interface AccountModel {
  key: string;
  owner: AccountOwnerModel;
  amount: AccountAmountModel;
}
