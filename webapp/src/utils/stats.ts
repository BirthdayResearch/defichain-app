import BigNumber from 'bignumber.js';
import {
  APY_MULTIPLICATION_FACTOR,
  DFI_SYMBOL,
  MAINNET_USDT_SYMBOL,
  USDT_SYMBOL,
} from '../constants';
import RpcClient from './rpc-client';
import { coinGeckoCoinPrices, getTokenSymbolNetwork } from './utility';

export const getYieldFarming = async (lpDailyDfiReward: number) => {
  const rpcClient = new RpcClient();
  const data = await rpcClient.listPoolPairs(0, false, 100);
  const poolPairs: any[] = [];
  Object.keys(data).forEach((key) => {
    const d = { ...data[key], poolPairId: key };
    poolPairs.push(d);
  });
  return await fetchTokenDetails(poolPairs, lpDailyDfiReward);
};

export const calculateLocalPrices = (poolPairs: any[]) => {
  const usdtSymbol = getTokenSymbolNetwork(MAINNET_USDT_SYMBOL, USDT_SYMBOL);
  const usdtDfiPoolPair = poolPairs.find((p) => p.idTokenA === usdtSymbol);
  const dfiAmount = new BigNumber(usdtDfiPoolPair.reserveA).div(
    usdtDfiPoolPair.reserveB
  );
  const prices = {
    [DFI_SYMBOL]: dfiAmount.toNumber(),
  };
  poolPairs.forEach((pp) => {
    const value = dfiAmount.div(new BigNumber(pp.reserveA).div(pp.reserveB));
    prices[pp.idTokenA] = value.toNumber();
  });
  return prices;
};

const fetchTokenDetails = async (
  poolPairs: any[],
  lpDailyDfiReward: number
) => {
  let price = {};

  try {
    price = await coinGeckoCoinPrices();
  } catch (error) {
    price = calculateLocalPrices(poolPairs);
  }

  let tvl = new BigNumber(0);
  const lpPairPromiseList = poolPairs.map(async (item) => {
    const { reserveA, reserveB, idTokenA, idTokenB, rewardPct, customRewards } =
      item;

    const liquidityReserveIdTokenA = new BigNumber(reserveA).times(
      price[idTokenA] || 0
    );

    const liquidityReserveIdTokenB = new BigNumber(reserveB).times(
      price[idTokenB] || 0
    );

    const rpcClient = new RpcClient();
    const tokenADataResponse = await rpcClient.tokenInfo(idTokenA);
    const tokenAData = tokenADataResponse
      ? tokenADataResponse[idTokenA] || {}
      : {};
    const tokenBDataResponse = await rpcClient.tokenInfo(idTokenB);
    const tokenBData = tokenBDataResponse
      ? tokenBDataResponse[idTokenB] || {}
      : {};

    let totalCustomRewards = 0;
    if (customRewards) {
      customRewards.forEach((customReward) => {
        // TODO: Only supports DFI
        const [reward] = customReward.split('@');
        if (reward) {
          totalCustomRewards += new BigNumber(reward)
            .times(2880)
            .times(365)
            .times(price[0] || 0)
            .toNumber();
        }
      });
    }

    const totalLiquidity = liquidityReserveIdTokenA.plus(
      liquidityReserveIdTokenB
    );
    const multiplicationFactor = APY_MULTIPLICATION_FACTOR;
    const yearlyPoolReward = new BigNumber(lpDailyDfiReward)
      .times(rewardPct)
      .times(365)
      .times(price[0] || 0)
      .plus(totalCustomRewards);
    const apr = totalLiquidity.gt(0)
      ? yearlyPoolReward
          .times(multiplicationFactor)
          .div(totalLiquidity)
          .toNumber()
      : 0;
    tvl = tvl.plus(item.totalLiquidity);
    return {
      apr,
      apy: apr,
      name: item.name,
      pair: item.symbol,
      idTokenA: item.idTokenA,
      idTokenB: item.idTokenB,
      totalStaked: totalLiquidity.toNumber(),
      poolPairId: item.poolPairId,
      reserveA: item.reserveA,
      reserveB: item.reserveB,
      volumeA: item.volumeA,
      volumeB: item.volumeB,
      tokenASymbol: tokenAData.symbolKey,
      tokenBSymbol: tokenBData.symbolKey,
      priceA: price[idTokenA],
      priceB: price[idTokenB],
    };
  });
  const pools = await Promise.all(lpPairPromiseList);
  return {
    pools,
    tvl: tvl.toString(),
  };
};
