import { isEmpty } from 'lodash';
import _ from 'lodash';

import {
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  DFI_SYMBOL,
  LP_DAILY_DFI_REWARD,
  POOL_PAIR_PAGE_SIZE,
  SHARE_POOL_PAGE_SIZE,
} from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import {
  getAddressInfo,
  getTransactionInfo,
  handleFetchAccountDFI,
} from '../WalletPage/service';
import {
  calculateAPY,
  fetchPoolPairDataWithPagination,
  fetchPoolShareDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressAndAmountListPoolShare,
  getAddressForSymbol,
  getDfiUTXOS,
  handleUtxoToAccountConversion,
  parsedCoinPriceData,
} from '../../utils/utility';
import BigNumber from 'bignumber.js';

export const handleFetchPoolshares = async () => {
  const rpcClient = new RpcClient();
  const govResult = await rpcClient.getGov();
  const lpDailyDfiReward = govResult[LP_DAILY_DFI_REWARD];
  const coinPriceObj = await parsedCoinPriceData();
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

      const yearlyPoolReward = new BigNumber(lpDailyDfiReward)
        .times(poolPairData[0].rewardPct)
        .times(365)
        .times(coinPriceObj[DFI_SYMBOL]);

      const liquidityReserveidTokenA = new BigNumber(
        poolPairData[0].reserveA
      ).times(coinPriceObj[poolPairData[0].idTokenA]);
      const liquidityReserveidTokenB = new BigNumber(
        poolPairData[0].reserveB
      ).times(coinPriceObj[poolPairData[0].idTokenB]);
      const totalLiquidity = liquidityReserveidTokenA.plus(
        liquidityReserveidTokenB
      );
      return {
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        poolSharePercentage: poolSharePercentage.toFixed(2),
        yearlyPoolReward: yearlyPoolReward.toNumber().toFixed(8),
        totalLiquidityInUSDT: totalLiquidity.toNumber().toFixed(8),
        apy: calculateAPY(totalLiquidity, yearlyPoolReward),
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

export const handleFetchPoolpair = async (id: string) => {
  const rpcClient = new RpcClient();
  const poolPair = await rpcClient.getPoolPair(id);
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
  };
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
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    formState.hash1,
    list
  );
  const { address: address2, amount: maxAmount2 } = await getAddressForSymbol(
    formState.hash2,
    list
  );

  const dfiUTXOS = await getDfiUTXOS();

  const tokenInfo1 = await rpcClient.tokenInfo(formState.hash1);
  const tokenInfo2 = await rpcClient.tokenInfo(formState.hash2);

  const { symbol: symbol1 } = tokenInfo1[formState.hash1];
  const { symbol: symbol2 } = tokenInfo2[formState.hash2];

  // convert utxo to account DFI, if don't have sufficent funds in account
  if (
    formState.hash1 === DFI_SYMBOL &&
    Number(formState.amount1) > maxAmount1
  ) {
    await handleUtxoToAccountConversion(
      formState.hash1,
      address1,
      formState.amount1,
      maxAmount1
    );
  } else if (
    formState.hash2 === DFI_SYMBOL &&
    Number(formState.amount2) > maxAmount2
  ) {
    await handleUtxoToAccountConversion(
      formState.hash2,
      address2,
      formState.amount2,
      maxAmount2
    );
  }

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
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    formState.hash1,
    list
  );
  const { address: address2, amount: maxAmount2 } = await getAddressForSymbol(
    formState.hash2,
    list
  );
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
  amount2: string,
  shareAddress: string
) => {
  const rpcClient = new RpcClient();
  const addressesList = await getAddressAndAmountListForAccount();
  const { address: address1, amount: maxAmount1 } = await getAddressForSymbol(
    hash1,
    addressesList
  );
  const { address: address2, amount: maxAmount2 } = await getAddressForSymbol(
    hash2,
    addressesList
  );
  const dfiUTXOS = await getDfiUTXOS();

  const tokenInfo1 = await rpcClient.tokenInfo(hash1);
  const tokenInfo2 = await rpcClient.tokenInfo(hash2);

  const { symbol: symbol1 } = tokenInfo1[hash1];
  const { symbol: symbol2 } = tokenInfo2[hash2];

  // convert utxo to account DFI, if don't have sufficent funds in account
  if (hash1 === DFI_SYMBOL && Number(amount1) > maxAmount1) {
    await handleUtxoToAccountConversion(hash1, address1, amount1, maxAmount1);
  } else if (hash2 === DFI_SYMBOL && Number(amount2) > maxAmount2) {
    await handleUtxoToAccountConversion(hash2, address2, amount2, maxAmount2);
  }

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
  poolID: string,
  amount: string,
  receiveAddress: string,
  poolPair: any
) => {
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListPoolShare(poolID);
  const addressList: any[] = [];
  list.reduce((sumAmount, obj) => {
    if (sumAmount < Number(amount)) {
      const tempAmount =
        sumAmount + Number(obj.amount) <= Number(amount)
          ? Number(obj.amount)
          : Number(amount) - sumAmount;
      addressList.push({
        address: obj.address,
        amount: tempAmount,
      });
      sumAmount = sumAmount + tempAmount;
    }
    return sumAmount;
  }, 0);

  const addressAndAmountArray = addressList.map(async (obj, index) => {
    const txId = await rpcClient.sendToAddress(
      obj.address,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId);
    await rpcClient.removePoolLiquidity(
      obj.address,
      `${Number(obj.amount).toFixed(8)}@${poolID}`
    );
    if (obj.address !== receiveAddress) {
      return obj;
    }
  });

  const resolvedAddressAndAmountArray: any[] = _.compact(
    await Promise.all(addressAndAmountArray)
  );

  const finalArray = resolvedAddressAndAmountArray.map((addressAndAmount) => {
    const amountA =
      (addressAndAmount.amount / poolPair.totalLiquidity) * poolPair.reserveA;
    const amountB =
      (addressAndAmount.amount / poolPair.totalLiquidity) * poolPair.reserveB;
    return {
      address: addressAndAmount.address,
      amountA: `${amountA.toFixed(8)}@${poolPair.idTokenA}`,
      amountB: `${amountB.toFixed(8)}@${poolPair.idTokenB}`,
    };
  });

  finalArray.map(async (obj) => {
    const txId1 = await rpcClient.sendToAddress(
      obj.address,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    const txId2 = await rpcClient.sendToAddress(
      obj.address,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId1);
    await getTransactionInfo(txId2);
  });

  const hashArray = finalArray.map(async (obj) => {
    const txId1 = await rpcClient.accountToAccount(
      obj.address,
      receiveAddress,
      obj.amountA
    );
    const txId2 = await rpcClient.accountToAccount(
      obj.address,
      receiveAddress,
      obj.amountB
    );
    return {
      txId1,
      txId2,
    };
  });

  const resolvedHashArray: any[] = _.compact(await Promise.all(hashArray));

  return resolvedHashArray[resolvedHashArray.length - 1];
};

export const handleFetchUtxoDFI = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBalance();
};

export const handleFetchTokenDFI = async () => {
  const accountDFI = handleFetchAccountDFI();
  return accountDFI;
};
