import RpcClient from '../../utils/rpc-client';

export const getBlockSyncInfo = async () => {
  const rpcClient = new RpcClient();
  const latestSyncedBlock = await rpcClient.getLatestSyncedBlock();
  const latestBlockInfoArr: any = await rpcClient.getPeerInfo();

  const latestBlock = latestBlockInfoArr.length
    ? Math.max.apply(
        Math,
        latestBlockInfoArr.map((o: { startingheight: any }) => o.startingheight)
      )
    : 0;

  const percentage = (latestSyncedBlock / latestBlock) * 100;

  const syncedPercentage =
    percentage > 100
      ? Math.min(100, percentage).toFixed(2)
      : Math.max(0, percentage).toFixed(2);
  return { latestSyncedBlock, latestBlock, syncedPercentage };
};

export const getBlockChainInfo = () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBlockChainInfo();
};
