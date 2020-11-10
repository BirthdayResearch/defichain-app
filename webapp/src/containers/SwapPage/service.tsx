import { isEmpty } from 'lodash';
import _ from 'lodash';

import {
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  POOL_PAIR_PAGE_SIZE,
  SHARE_POOL_PAGE_SIZE,
} from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import {
  getAddressInfo,
  getNewAddress,
  getTransactionInfo,
} from '../WalletPage/service';
import {
  fetchPoolPairDataWithPagination,
  fetchPoolShareDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressForSymbol,
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

    if (addressInfo.ismine && !addressInfo.iswatchonly) {
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

  const resolvedMinePoolShares = _.compact(await Promise.all(minePoolShares));

  const ind = {};

  const groupedMinePoolShares = resolvedMinePoolShares.reduce((arr, obj) => {
    if (ind.hasOwnProperty(obj.poolID)) {
      arr[ind[obj.poolID]].poolSharePercentage =
        Number(arr[ind[obj.poolID]].poolSharePercentage) +
        Number(obj.poolSharePercentage);
    } else {
      arr.push(obj);
      ind[obj.poolID] = arr.length - 1;
    }
    return arr;
  }, []);

  return groupedMinePoolShares;
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

export const handleTestPoolSwap = async (formState) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListForAccount();
  const address1 = await getAddressForSymbol(formState.hash1, list);
  const address2 = await getAddressForSymbol(formState.hash2, list);
  const testPoolSwapAmount = await rpcClient.testPoolSwap(
    address1,
    formState.hash1,
    Number(formState.amount1),
    address2,
    formState.hash2
  );
  return testPoolSwapAmount.split('@')[0];
};

export const handlePoolSwap = async (formState) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListForAccount();
  const address1 = await getAddressForSymbol(formState.hash1, list);
  const address2 = await getAddressForSymbol(formState.hash2, list);
  if (address1 !== address2) {
    const txId1 = await rpcClient.sendToAddress(
      address2,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    const txId2 = await rpcClient.sendToAddress(
      address1,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId1);
    await getTransactionInfo(txId2);
  } else {
    const txId = await rpcClient.sendToAddress(
      address1,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId);
  }
  const hash = await rpcClient.poolSwap(
    address1,
    formState.hash1,
    Number(formState.amount1),
    address2,
    formState.hash2
  );
  return hash;
};

export const handleFetchTokenBalanceList = async () => {
  const rpcClient = new RpcClient();
  return await rpcClient.getTokenBalances();
};

export const handleAddPoolLiquidity = async (
  hash1: string,
  amount1: string,
  hash2: string,
  amount2: string
) => {
  const rpcClient = new RpcClient();
  const addressesList = await getAddressAndAmountListForAccount();
  const address1 = await getAddressForSymbol(hash1, addressesList);
  const address2 = await getAddressForSymbol(hash2, addressesList);
  const shareAddress = await getNewAddress('', true);
  if (address1 !== address2) {
    const txId1 = await rpcClient.sendToAddress(
      address2,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    const txId2 = await rpcClient.sendToAddress(
      address1,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId1);
    await getTransactionInfo(txId2);
  } else {
    const txId = await rpcClient.sendToAddress(
      address1,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId);
  }
  return await rpcClient.addPooLiquidity(
    address1,
    `${Number(amount1).toFixed(8)}@${hash1}`,
    address2,
    `${Number(amount2).toFixed(8)}@${hash2}`,
    shareAddress
  );
};

export const handleRemovePoolLiquidity = async (
  from: string,
  amount: string
) => {
  const rpcClient = new RpcClient();
  return await rpcClient.removePoolLiquidity(from, amount);
};
