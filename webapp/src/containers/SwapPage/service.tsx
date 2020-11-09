import { isEmpty } from 'lodash';
import _ from 'lodash';

import { POOL_PAIR_PAGE_SIZE, SHARE_POOL_PAGE_SIZE } from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import { getAddressInfo } from '../WalletPage/service';
import {
  fetchPoolPairDataWithPagination,
  fetchPoolShareDataWithPagination,
} from '../../utils/utility';

export const handleFetchPoolshares = async () => {
  const rpcClient = new RpcClient();
  const poolShares = await fetchPoolShareDataWithPagination(
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
      const poolSharePercentage =
        (poolShare.amount / poolShare.totalLiquidity) * 100;
      return {
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        poolSharePercentage: poolSharePercentage.toFixed(2),
        ...poolPairData[0],
        ...poolShare,
      };
    }
  });

  return _.compact(await Promise.all(minePoolShares));
};

export const handleFetchPoolPairList = async () => {
  const rpcClient = new RpcClient();
  const poolPairList: any[] = await fetchPoolPairDataWithPagination(
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

export const handleAddPoolLiquidity = async (
  address1: string,
  amount1: string,
  address2: string,
  amount2: string,
  shareAddress: string
) => {
  const rpcClient = new RpcClient();
  return await rpcClient.addPooLiquidity(
    address1,
    amount1,
    address2,
    amount2,
    shareAddress
  );
};

export const handleRemovePoolLiquidity = async (from: string, amount: string) => {
  const rpcClient = new RpcClient();
  return await rpcClient.removePoolLiquidity(from, amount);
}

