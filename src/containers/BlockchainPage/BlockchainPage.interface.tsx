export interface BlockchainPageProps {}

export interface BlockchainPageState {}

export interface BlockchainTableProps {
  blocks: Array<{
    height: number;
    age: string;
    txns: string;
    minerName: string;
    minerID: number;
    size: string;
  }>;
  isLoadingBlocks: boolean;
  isBlocksLoaded: Boolean;
  blocksLoadError: string;
  fetchBlocks: Function;
}

export interface BlockchainTableState {}

export interface BlockPageProps {
  txns: Array<{
    hash: string;
    time: string;
    froms: Array<{
      address: string;
      amount: number;
    }>;
    tos: Array<{
      address: string;
      amount: number;
    }>;
  }>;
  fetchTxns: Function;
}

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
