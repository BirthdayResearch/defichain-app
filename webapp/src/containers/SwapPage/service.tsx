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
  getNewAddress,
  getTransactionInfo,
  handleFetchAccountDFI,
} from '../WalletPage/service';
import {
  fetchPoolPairDataWithPagination,
  fetchPoolShareDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressAndAmountListPoolShare,
  getAddressForSymbol,
  getBalanceForSymbol,
  getDfiUTXOS,
  getSmallerAmount,
  handleAccountToAccountConversion,
  handleUtxoToAccountConversion,
  parsedCoinPriceData,
} from '../../utils/utility';
import BigNumber from 'bignumber.js';
import store from '../../app/rootStore';
import {
  addPoolPreparingUTXOSuccess,
  liquidityRemovedSuccess,
  poolSwapRefreshUTXOSuccess,
  refreshUTXOS1Success,
  refreshUTXOS2Success,
  transferTokensSuccess,
} from './reducer';

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
        poolPairData[0].reserveA || 0
      ).times(coinPriceObj[poolPairData[0].idTokenA]);
      const liquidityReserveidTokenB = new BigNumber(
        poolPairData[0].reserveB || 0
      ).times(coinPriceObj[poolPairData[0].idTokenB]);
      const totalLiquidity = liquidityReserveidTokenA.plus(
        liquidityReserveidTokenB
      );

      return {
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        poolSharePercentage: poolSharePercentage.toFixed(8),
        yearlyPoolReward: yearlyPoolReward.toNumber().toFixed(8),
        totalLiquidityInUSDT: totalLiquidity.toNumber().toFixed(8),
        apy: totalLiquidity.toNumber()
          ? yearlyPoolReward
              .div(totalLiquidity)
              .times(100)
              .toNumber()
              .toFixed(2)
          : 0,
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

  // let accountToAccountAmount = new BigNumber(0);

  // // convert account to account, if don't have sufficient funds in one account
  // if (Number(formState.amount1) > maxAmount1) {
  //   accountToAccountAmount = await handleAccountToAccountConversion(
  //     list,
  //     address1,
  //     formState.hash1
  //   );
  // }

  // convert utxo to account DFI, if don't have sufficent funds in account
  // if (
  //   formState.hash1 === DFI_SYMBOL &&
  //   new BigNumber(formState.amount1).gt(accountToAccountAmount.plus(maxAmount1))
  // ) {
  //   await handleUtxoToAccountConversion(
  //     formState.hash1,
  //     address1,
  //     formState.amount1,
  //     accountToAccountAmount.plus(maxAmount1).toNumber()
  //   );
  // }

  if (new BigNumber(formState.amount1).toNumber()) {
    const testPoolSwapAmount = await rpcClient.testPoolSwap(
      address1,
      formState.hash1,
      Number(formState.amount1),
      address2,
      formState.hash2
    );
    return testPoolSwapAmount.split('@')[0];
  } else {
    return '-';
  }
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

  let accountToAccountAmount = new BigNumber(0);

  // convert account to account, if don't have sufficient funds in one account
  if (Number(formState.amount1) > maxAmount1) {
    accountToAccountAmount = await handleAccountToAccountConversion(
      list,
      address1,
      formState.hash1
    );
  }

  // convert utxo to account DFI, if don't have sufficent funds in account
  if (
    formState.hash1 === DFI_SYMBOL &&
    new BigNumber(formState.amount1).gt(accountToAccountAmount.plus(maxAmount1))
  ) {
    await handleUtxoToAccountConversion(
      formState.hash1,
      address1,
      formState.amount1,
      accountToAccountAmount.plus(maxAmount1).toNumber()
    );
  }

  store.dispatch(poolSwapRefreshUTXOSuccess());

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

  let accountToAccountAmount1 = new BigNumber(0);
  let accountToAccountAmount2 = new BigNumber(0);

  // convert account to account, if don't have sufficient funds in one account
  if (Number(amount1) > maxAmount1) {
    accountToAccountAmount1 = await handleAccountToAccountConversion(
      addressesList,
      address1,
      hash1
    );
  }
  if (Number(amount2) > maxAmount2) {
    accountToAccountAmount2 = await handleAccountToAccountConversion(
      addressesList,
      address2,
      hash2
    );
  }

  // convert utxo DFI to account, if don't have sufficent funds in account
  if (
    hash1 === DFI_SYMBOL &&
    new BigNumber(amount1).gt(accountToAccountAmount1.plus(maxAmount1))
  ) {
    await handleUtxoToAccountConversion(
      hash1,
      address1,
      amount1,
      accountToAccountAmount1.plus(maxAmount1).toNumber()
    );
  } else if (
    hash2 === DFI_SYMBOL &&
    new BigNumber(amount2).gt(accountToAccountAmount2.plus(maxAmount2))
  ) {
    await handleUtxoToAccountConversion(
      hash2,
      address2,
      amount2,
      accountToAccountAmount2.plus(maxAmount2).toNumber()
    );
  }

  store.dispatch(addPoolPreparingUTXOSuccess());

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

  const removeLpAmounts = {};
  for (const obj of addressList) {
    removeLpAmounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
  }
  const refreshUtxoTxId1 = await rpcClient.sendMany(removeLpAmounts);
  await getTransactionInfo(refreshUtxoTxId1);

  store.dispatch(refreshUTXOS1Success());

  const addressAndAmountArray = addressList.map(async (obj) => {
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

  store.dispatch(liquidityRemovedSuccess());

  const finalArray = resolvedAddressAndAmountArray.map((addressAndAmount) => {
    const amountA = new BigNumber(Number(addressAndAmount.amount).toFixed(8))
      .div(new BigNumber(poolPair.totalLiquidity).toFixed(8))
      .times(new BigNumber(poolPair.reserveA).toFixed(8));

    const amountB = new BigNumber(Number(addressAndAmount.amount).toFixed(8))
      .div(new BigNumber(poolPair.totalLiquidity).toFixed(8))
      .times(new BigNumber(poolPair.reserveB).toFixed(8));

    return {
      address: addressAndAmount.address,
      amountA: `${amountA.toFixed(8)}@${poolPair.idTokenA}`,
      amountB: `${amountB.toFixed(8)}@${poolPair.idTokenB}`,
    };
  });

  const accountAmounts = {};
  for (const obj of finalArray) {
    accountAmounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
  }
  const refreshUtxoTxId2 = await rpcClient.sendMany(accountAmounts);
  const refreshUtxoTxId3 = await rpcClient.sendMany(accountAmounts);
  await getTransactionInfo(refreshUtxoTxId2);
  await getTransactionInfo(refreshUtxoTxId3);

  store.dispatch(refreshUTXOS2Success());

  const hashArray = finalArray.map(async (obj) => {
    const balance1 = await getBalanceForSymbol(obj.address, poolPair.idTokenA);
    const balance2 = await getBalanceForSymbol(obj.address, poolPair.idTokenB);

    const amountA = getSmallerAmount(balance1, obj.amountA.split('@')[0]);
    const amountB = getSmallerAmount(balance2, obj.amountB.split('@')[0]);

    const txId1 = await rpcClient.accountToAccount(
      obj.address,
      receiveAddress,
      `${amountA.toFixed(8)}@${poolPair.idTokenA}`
    );
    const txId2 = await rpcClient.accountToAccount(
      obj.address,
      receiveAddress,
      `${amountB.toFixed(8)}@${poolPair.idTokenB}`
    );
    return {
      txId1,
      txId2,
    };
  });
  const resolvedHashArray: any[] = _.compact(await Promise.all(hashArray));

  store.dispatch(transferTokensSuccess());

  return resolvedHashArray[resolvedHashArray.length - 1];
};

export const handleFetchUtxoDFI = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBalance();
};

export const handleFetchTokenDFI = async () => {
  const accountDFI = await handleFetchAccountDFI();
  return accountDFI;
};
