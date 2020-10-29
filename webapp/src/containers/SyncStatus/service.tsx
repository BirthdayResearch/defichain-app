import RpcClient from '../../utils/rpc-client';
import { getTotalBlocks } from '../../utils/utility';

export const getBlockSyncInfo = async () => {
  const rpcClient = new RpcClient();
  const latestSyncedBlock = await rpcClient.getLatestSyncedBlock();
  let latestBlock = 0;

  try {
    const latestBlockInfoArr = await getTotalBlocks();
    latestBlock = latestBlockInfoArr.blockHeight;
  } catch (e) {
    // Use getpeerinfo rpc call, if not able to get data from stats api
    const latestBlockInfoArr: any = await rpcClient.getPeerInfo();
    latestBlock = latestBlockInfoArr.length
      ? Math.max.apply(
          Math,
          latestBlockInfoArr.map(
            (o: { startingheight: any }) => o.startingheight
          )
        )
      : 0;
  }

  const percentage = (latestSyncedBlock / latestBlock) * 100;

  const syncedPercentage =
    percentage > 100
      ? Math.min(100, percentage).toFixed(2)
      : Math.max(0, percentage).toFixed(2);
  return { latestSyncedBlock, latestBlock, syncedPercentage };
};
