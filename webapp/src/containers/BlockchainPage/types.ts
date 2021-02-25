export interface BlockData {
  nTxns: number;
  difficulty: number;
  height: number;
  bits: string;
  version: number;
  nonce: number;
  hash: string;
  merkleRoot: string;
}

export interface BlockchainState {
  blocks: [];
  blockCount: number;
  blockData: BlockData;
  txns: [];
  txnCount: number;
  isBlocksLoaded: boolean;
  isLoadingBlocks: boolean;
  blocksLoadError: string;
  isLoadingBlockData: boolean;
  blockDataError: string;
  blockCountError: string;
  isTxnsLoaded: boolean;
  isLoadingTxns: boolean;
  txnsLoadError: string;
}
