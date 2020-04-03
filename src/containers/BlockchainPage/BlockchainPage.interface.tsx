export interface BlockchainPageProps {}

export interface BlockchainPageState {}

export interface BlockchainTableProps {}

export interface BlockchainTableState {}

export interface BlockPageProps {}

export interface BlockPageState {
  txns: Array<{
    hash: string;
    time: string;
    froms: Array<{
      address: string;
      amount: number | string;
    }>;
    tos: Array<{
      address: String;
      amount: number | string;
    }>;
  }>;
}

export interface BlockTxnProps {
  txn: {
    hash: string;
    time: string;
    froms: Array<{
      address: string;
      amount: number | string;
    }>;
    tos: Array<{
      address: String;
      amount: number | string;
    }>;
  };
}

export interface BlockTxnState {
  copied: boolean;
}

export interface MinerPageProps {}

export interface MinerPageState {}

export interface RouteParams {
  id?: string;
  height?: string;
}
