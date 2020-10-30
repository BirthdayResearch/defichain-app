import { isEmpty } from 'lodash';
import _ from 'lodash';

import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import { getAddressInfo } from '../WalletPage/service';

export const handleFetchPoolshares = async () => {
  const rpcClient = new RpcClient();
  const poolShares = await rpcClient.listPoolShares();
  if (isEmpty(poolShares)) {
    return [];
  }
  const minePoolShares = Object.keys(poolShares).map(async (item) => {
    const poolShare = poolShares[item];
    const addressInfo = await getAddressInfo(poolShare.owner);

    // if (addressInfo.ismine && !addressInfo.iswatchonly) {
    if (true) {
      const poolPair = await rpcClient.getPoolPair(poolShares[item].poolID);
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
        ...poolShares[item],
      };
    }
  });

  return _.compact(await Promise.all(minePoolShares));
};
