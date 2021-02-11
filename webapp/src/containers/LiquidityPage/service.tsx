import { isEmpty } from 'lodash';
import _ from 'lodash';
import * as log from '../../utils/electronLogger';

import {
  AMOUNT_SEPARATOR,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  DFI_SYMBOL,
  LP_DAILY_DFI_REWARD,
  POOL_PAIR_PAGE_SIZE,
  SHARE_POOL_PAGE_SIZE,
} from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { handleFetchToken } from '../TokensPage/service';
import { getAddressInfo } from '../WalletPage/service';
import {
  fetchPoolPairDataWithPagination,
  fetchPoolShareDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressAndAmountListPoolShare,
  getHighestAmountAddressForSymbol,
  getBalanceForSymbol,
  getPoolStatsFromAPI,
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
  refreshUTXOS1Success,
  refreshUTXOS2Success,
  transferTokensSuccess,
} from './reducer';

export const handleFetchPoolshares = async () => {
  const rpcClient = new RpcClient();
  const govResult = await rpcClient.getGov();
  const lpDailyDfiReward = govResult[LP_DAILY_DFI_REWARD];
  const poolStats = await getPoolStatsFromAPI();
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
      const idTokenA = poolPairData[0].idTokenA;
      const idTokenB = poolPairData[0].idTokenB;
      const tokenAData = await handleFetchToken(idTokenA);
      const tokenBData = await handleFetchToken(idTokenB);
      const poolSharePercentage =
        (poolShare.amount / poolShare.totalLiquidity) * 100;

      const yearlyPoolReward = new BigNumber(lpDailyDfiReward)
        .times(poolPairData[0].rewardPct)
        .times(365)
        .times(coinPriceObj[DFI_SYMBOL]);

      const liquidityReserveidTokenA = new BigNumber(
        poolPairData[0].reserveA || 0
      ).times(coinPriceObj[idTokenA]);
      const liquidityReserveidTokenB = new BigNumber(
        poolPairData[0].reserveB || 0
      ).times(coinPriceObj[idTokenB]);
      const totalLiquidity = liquidityReserveidTokenA.plus(
        liquidityReserveidTokenB
      );
      const apy = new BigNumber(
        poolStats[`${idTokenA}_${idTokenB}`]?.apy || 0
      ).toFixed(2);
      return {
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        poolSharePercentage: poolSharePercentage.toFixed(8),
        yearlyPoolReward: yearlyPoolReward.toNumber().toFixed(8),
        totalLiquidityInUSDT: totalLiquidity.toNumber().toFixed(8),
        apy,
        ...poolPairData[0],
        ...poolShare,
      };
    }
  });

  const resolvedMinePoolShares = _.compact(await Promise.all(minePoolShares));

  const ind = {};

  const groupedMinePoolShares = resolvedMinePoolShares.reduce((arr, obj) => {
    if (ind.hasOwnProperty(obj.poolID)) {
      arr[ind[obj.poolID]].poolSharePercentage = new BigNumber(
        arr[ind[obj.poolID]].poolSharePercentage || 0
      )
        .plus(obj.poolSharePercentage)
        .toNumber();
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

export const handleAddPoolLiquidity = async (
  hash1: string,
  amount1: string,
  hash2: string,
  amount2: string,
  shareAddress: string
): Promise<string> => {
  log.info('Starting Add Pool Liquidity', 'handleAddPoolLiquidity');
  const rpcClient = new RpcClient();
  const addressesList = await getAddressAndAmountListForAccount();

  const setEmptyAddress = (address: string) => {
    return address == null || address == '' ? shareAddress : address;
  };

  const {
    address: address1,
    amount: maxAmount1,
  } = getHighestAmountAddressForSymbol(hash1, addressesList);

  const {
    address: address2,
    amount: maxAmount2,
  } = getHighestAmountAddressForSymbol(hash2, addressesList);

  log.info(
    `1. Address ${address1} Amount ${maxAmount1}`,
    'handleAddPoolLiquidity'
  );
  log.info(
    `2. Address ${address2} Amount ${maxAmount2}`,
    'handleAddPoolLiquidity'
  );

  let accountToAccountAmount1 = new BigNumber(0);
  let accountToAccountAmount2 = new BigNumber(0);
  const amount1BN = new BigNumber(amount1);
  const amount2BN = new BigNumber(amount2);

  // convert account to account, if don't have sufficient funds in one account
  if (amount1BN.gt(maxAmount1)) {
    accountToAccountAmount1 = await handleAccountToAccountConversion(
      addressesList,
      setEmptyAddress(address1),
      hash1
    );
    log.info(`1. Account to Account completed`, 'handleAddPoolLiquidity');
  }
  if (amount2BN.gt(maxAmount2)) {
    accountToAccountAmount2 = await handleAccountToAccountConversion(
      addressesList,
      setEmptyAddress(address2),
      hash2
    );
    log.info(`2. Account to Account completed`, 'handleAddPoolLiquidity');
  }

  // convert utxo DFI to account, if don't have sufficent funds in account
  if (
    hash1 === DFI_SYMBOL &&
    amount1BN.gt(accountToAccountAmount1.plus(maxAmount1))
  ) {
    await handleUtxoToAccountConversion(
      hash1,
      setEmptyAddress(address1),
      amount1BN,
      accountToAccountAmount1.plus(maxAmount1)
    );
    log.info(
      `1. UTXO to Account completed ${address1}`,
      'handleAddPoolLiquidity'
    );
  } else if (
    hash2 === DFI_SYMBOL &&
    amount2BN.gt(accountToAccountAmount2.plus(maxAmount2))
  ) {
    await handleUtxoToAccountConversion(
      hash2,
      setEmptyAddress(address2),
      amount2BN,
      accountToAccountAmount2.plus(maxAmount2)
    );
    log.info(
      `2. UTXO to Account completed ${address2}`,
      'handleAddPoolLiquidity'
    );
  }

  store.dispatch(addPoolPreparingUTXOSuccess());

  return await rpcClient.addPooLiquidity(
    setEmptyAddress(address1),
    `${amount1BN.toFixed(8)}@${hash1}`,
    setEmptyAddress(address2),
    `${amount2BN.toFixed(8)}@${hash2}`,
    shareAddress
  );
};

export const handleRemovePoolLiquidity = async (
  poolID: string,
  amount: string,
  receiveAddress: string,
  poolPair: any
) => {
  log.info('Starting Remove Pool Liquidity', 'handleRemovePoolLiquidity');
  const rpcClient = new RpcClient();
  const list = await getAddressAndAmountListPoolShare(poolID);
  const addressList: any[] = [];
  list.reduce((sumAmount, obj) => {
    if (new BigNumber(amount).gt(sumAmount)) {
      const tempAmount = new BigNumber(sumAmount || 0)
        .plus(obj.amount || 0)
        .lte(amount || 0)
        ? new BigNumber(obj.amount).toNumber()
        : new BigNumber(amount).minus(sumAmount || 0).toNumber();
      addressList.push({
        address: obj.address,
        amount: tempAmount,
      });
      sumAmount = new BigNumber(sumAmount).plus(tempAmount).toNumber();
    }
    return sumAmount;
  }, 0);
  log.info(`1. AddressList ${addressList}`, 'handleRemovePoolLiquidity');
  const removeLpAmounts = {};
  for (const obj of addressList) {
    removeLpAmounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
  }
  log.info(
    `1. Remove Lp Amounts ${removeLpAmounts}`,
    'handleRemovePoolLiquidity'
  );

  store.dispatch(refreshUTXOS1Success());

  const addressAndAmountArray = addressList.map(async (obj) => {
    await rpcClient.removePoolLiquidity(
      obj.address,
      `${new BigNumber(obj.amount).toFixed(8)}@${poolID}`
    );
    if (obj.address !== receiveAddress) {
      return obj;
    }
  });
  const resolvedAddressAndAmountArray: any[] = _.compact(
    await Promise.all(addressAndAmountArray)
  );
  log.info(
    `Liquidity removed from different addresses`,
    'handleRemovePoolLiquidity'
  );
  store.dispatch(liquidityRemovedSuccess());

  const finalArray = resolvedAddressAndAmountArray.map((addressAndAmount) => {
    const amountA = new BigNumber(addressAndAmount.amount)
      .div(new BigNumber(poolPair.totalLiquidity))
      .times(new BigNumber(poolPair.reserveA))
      .toFixed(8);

    const amountB = new BigNumber(addressAndAmount.amount)
      .div(new BigNumber(poolPair.totalLiquidity))
      .times(new BigNumber(poolPair.reserveB))
      .toFixed(8);

    return {
      address: addressAndAmount.address,
      amountA: `${amountA}@${poolPair.idTokenA}`,
      amountB: `${amountB}@${poolPair.idTokenB}`,
    };
  });

  log.info(`1. Final Array ${finalArray}`, 'handleRemovePoolLiquidity');

  const accountAmounts = {};
  for (const obj of finalArray) {
    accountAmounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
  }

  store.dispatch(refreshUTXOS2Success());

  const hashArray = finalArray.map(async (obj) => {
    const balance1 = await getBalanceForSymbol(obj.address, poolPair.idTokenA);
    const balance2 = await getBalanceForSymbol(obj.address, poolPair.idTokenB);

    const amountA = getSmallerAmount(
      balance1,
      obj.amountA.split(AMOUNT_SEPARATOR)[0]
    );
    const amountB = getSmallerAmount(
      balance2,
      obj.amountB.split(AMOUNT_SEPARATOR)[0]
    );

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
  log.info(`RemoveLiquidity done successfully`, 'handleRemovePoolLiquidity');
  return resolvedHashArray[resolvedHashArray.length - 1];
};
