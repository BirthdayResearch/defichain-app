import { isEmpty } from 'lodash';
import _ from 'lodash';

import { POOL_PAIR_PAGE_SIZE, SHARE_POOL_PAGE_SIZE } from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import { getAddressInfo } from '../WalletPage/service';
import { fetchDataWithPagination } from '../../utils/utility';

export const handleFetchPoolshares = async () => {
  const rpcClient = new RpcClient();
  const poolShares = await fetchDataWithPagination(
    0,
    SHARE_POOL_PAGE_SIZE,
    rpcClient.listPoolShares
  );

  if (isEmpty(poolShares)) {
    return [];
  }

  const minePoolShares = poolShares.map(async (poolShare) => {
    const addressInfo = await getAddressInfo(poolShare.owner);

    // if (addressInfo.ismine && !addressInfo.iswatchonly) {
    if (true) {
      const poolPair = await rpcClient.getPoolPair(poolShare.poolID);
      const poolPairData = Object.keys(poolPair).map((item) => ({
        hash: item,
        ...poolPair[item],
      }));
      const tokenAData = await handleFetchToken(poolPairData[0].idTokenA);
      const tokenBData = await handleFetchToken(poolPairData[0].idTokenB);
      return {
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        ...poolPairData[0],
        ...poolShare,
      };
    }
  });

  return _.compact(await Promise.all(minePoolShares));
};

export const handleFetchPoolPairList = async () => {
  const rpcClient = new RpcClient();
  const poolPairList: any[] = await fetchDataWithPagination(
    0,
    POOL_PAIR_PAGE_SIZE,
    rpcClient.listPoolPairs
  );
  return poolPairList;
};

export const handleFetchTokenBalanceList = async () => {
  const rpcClient = new RpcClient();
  return await rpcClient.getTokenBalances();
};
