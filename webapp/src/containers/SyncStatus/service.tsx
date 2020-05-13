import * as HttpStatus from 'http-status-codes';
import RpcClient from '../../utils/rpc-client';

export const getBlockSyncInfo = async () => {
  const rpcClient = new RpcClient();
  const latestBlockRes = await rpcClient.call('/', 'getblockcount', []);
  const peerRes = await rpcClient.call('/', 'getpeerinfo', []);
  if (latestBlockRes.status !== HttpStatus.OK) {
    throw new Error(latestBlockRes.data.error);
  }
  if (peerRes.status !== HttpStatus.OK) {
    throw new Error(peerRes.data.error);
  }
  const latestSyncedBlock = latestBlockRes.data
    ? latestBlockRes.data.result
    : 0;
  const latestBlockInfo = peerRes.data.result[0];
  const latestBlock = latestBlockInfo ? latestBlockInfo.startingheight : 0;
  const percentage = (latestSyncedBlock / latestBlock) * 100;

  const syncedPercentage = Math.max(0, percentage).toFixed(2);
  return { latestSyncedBlock, latestBlock, syncedPercentage };
};
