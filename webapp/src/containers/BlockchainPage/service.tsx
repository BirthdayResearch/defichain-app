import RpcClient from '../../utils/rpc-client';
import { IBlock } from '../../utils/interfaces';
import LruCache from '../../utils/lruCache';
import { toSha256 } from '../../utils/utility';

export const handleFetchBlockData = async (blockNumber: number) => {
  if (isNaN(blockNumber) || blockNumber <= 0)
    throw new Error(`Invalid block number: ${blockNumber}`);

  const rpcClient = new RpcClient();
  const blockHash = await rpcClient.getBlockHash(blockNumber);
  const blockDetails = await rpcClient.getBlock(blockHash, 1);
  const blockData = {
    nTxns: blockDetails.nTxns,
    height: blockDetails.height,
    bits: blockDetails.bits,
    difficulty: blockDetails.difficulty,
    hash: blockDetails.hash,
    merkleRoot: blockDetails.merkleRoot,
    version: blockDetails.version,
    nonce: blockDetails.nonce,
  };
  const data = { blockData };
  return data;
};

export const handleFetchBlockCount = async () => {
  const rpcClient = new RpcClient();
  const blockCount = await rpcClient.getLatestSyncedBlock();
  const data = { blockCount };
  return data;
};

export const handelFetchBlocks = async (pageNo: number, pageSize: number) => {
  const rpcClient = new RpcClient();

  const blocks: IBlock[] = [];
  const blockCount = await rpcClient.getLatestSyncedBlock();

  const endIndex = blockCount - (pageNo - 1) * pageSize;
  const startIndex = Math.max(endIndex - pageSize, 0);
  for (let blockNumber = endIndex; blockNumber > startIndex; blockNumber -= 1) {
    const blockHash = await rpcClient.getBlockHash(blockNumber);
    const blockDetails = await rpcClient.getBlock(blockHash, 1);
    blocks.push(blockDetails);
  }

  const data = {
    blocks,
    blockCount,
  };
  return data;
};

export const handelFetchTxns = async (
  blockNumber: number,
  pageNo: number,
  pageSize: number
) => {
  if (isNaN(blockNumber) || blockNumber <= 0)
    throw new Error(`Invalid block number: ${blockNumber}`);

  const rpcClient = new RpcClient();

  const blockHash = await rpcClient.getBlockHash(blockNumber);
  const block = await rpcClient.getBlock(blockHash, 1);

  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = Math.min(pageNo * pageSize, block.nTxns);
  const txnList = Array();
  for (let i = startIndex; i < endIndex; i++) {
    const parsedTxn = await rpcClient.getRawTransactionOfBlock(
      block.txnIds[i],
      true,
      block.hash
    );
    txnList.push(parsedTxn);
  }

  // add to cache for future use
  const key = toSha256(`${blockNumber} ${pageNo} ${pageSize}`);
  LruCache.put(key, txnList);

  const data = { txns: txnList, txnCount: block.nTxns };
  return data;
};
