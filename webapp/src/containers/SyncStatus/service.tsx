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
  let latestSyncedBlock = latestBlockRes.data ? latestBlockRes.data.result : 0;
  const latestBlockInfo = peerRes.data.result[0];
  let latestBlock = latestBlockInfo ? latestBlockInfo.startingheight : 0;
  // Avoid negative and positive infinity
  if (latestSyncedBlock <= 0 || latestBlock <= 0) {
    latestSyncedBlock = 0;
    latestBlock = 0;
  }
  const percentage = (latestSyncedBlock / latestBlock) * 100;

  const syncedPercentage =
    percentage > 100
      ? Math.min(100, percentage).toFixed(2)
      : Math.max(0, percentage).toFixed(2);
  return { latestSyncedBlock, latestBlock, syncedPercentage };
};
