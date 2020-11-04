export interface DATTokenObject {
  name: string;
  icon: any;
  symbol: string;
  type: string;
  price: string;
  volume: string;
  marketCap: string;
  holders: string;
}

export interface DCTTokenObject {
  name: string;
  icon: any;
  symbol: string;
  id: string;
  totalInitialSupply: string;
  finalSupplyLimit: string;
  mintingSupport: string;
  tradeable: string;
}

export interface TransferObject {
  txnhash: string;
  age: string;
  from: string;
  to: string;
  amount: string;
}
