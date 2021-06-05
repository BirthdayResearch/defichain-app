import RpcClient from './rpc-client';

export const getYieldFarming = async (network: string) => {
  const rpcClient = new RpcClient();
  const data = await rpcClient.listPoolPairs(0, false, 100);
  const poolPairs: any[] = [];
  Object.keys(data).forEach((key) => {
    const d = { ...data[key], poolPairId: key };
    poolPairs.push(d);
  });
  const detailPoolPairs: any = await fetchTokenDetails(poolPairs, network);
};

const fetchTokenDetails = async (poolPairs: any[], network: string) => {
  const endDate = new Date();
  const d = new Date();
  const startDate = new Date(d.setDate(endDate.getDate() - 1));
  const tradeVolume = await this.customTransactionService.getTokensTradeVolumeByPair(
    network,
    {
      blockTime: {
        $gte: startDate,
        $lt: endDate,
      },
    },
  );
};
