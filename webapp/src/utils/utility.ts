/* eslint-disable @typescript-eslint/ban-types */
import Ajv from 'ajv';
import axios from 'axios';

import * as log from './electronLogger';
import moment from 'moment';
import SHA256 from 'crypto-js/sha256';
import _, { isEmpty } from 'lodash';
import * as bitcoin from 'bitcoinjs-lib';
import shuffle from 'shuffle-array';

import {
  IAddressAndAmount,
  ITxn,
  IBlock,
  IParseTxn,
  ITokenBalanceInfo,
} from './interfaces';
import {
  DATE_FORMAT,
  DEFAULT_UNIT,
  UNPARSED_ADDRESS,
  DUST_VALUE_DFI,
  DEFI_CLI,
  MAX_MONEY,
  ENTROPY_BITS,
  MIN_WORD_INDEX,
  MAX_WORD_INDEX,
  TOTAL_WORD_LENGTH,
  MAIN,
  TEST,
  RANDOM_WORD_ENTROPY_BITS,
  STATS_API_BLOCK_URL,
  LIST_ACCOUNTS_PAGE_SIZE,
  COINGECKO_API_BASE_URL,
  LP_DAILY_DFI_REWARD,
  VS_CURRENCY,
  COINGECKO_DFI_ID,
  COINGECKO_BTC_ID,
  COINGECKO_ETH_ID,
  COINGECKO_USDT_ID,
  DFI_SYMBOL,
  BTC_SYMBOL,
  ETH_SYMBOL,
  USDT_SYMBOL,
  SHARE_POOL_PAGE_SIZE,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  MAINNET_ETH_SYMBOL,
  MAINNET_BTC_SYMBOL,
  MAINNET_USDT_SYMBOL,
  API_REQUEST_TIMEOUT,
  APY_MULTIPLICATION_FACTOR,
  DEFICHAIN_MAINNET_LINK,
  DEFICHAIN_TESTNET_LINK,
  MAINNET,
  TESTNET,
  AMOUNT_SEPARATOR,
  STATS_API_BASE_URL,
  COINGECKO_LTC_ID,
  COINGECKO_DOGE_ID,
  MAINNET_LTC_SYMBOL,
  LTC_SYMBOL,
  MAINNET_DOGE_SYMBOL,
  DOGE_SYMBOL,
  MAINNET_BCH_SYMBOL,
  BCH_SYMBOL,
  COINGECKO_BCH_ID,
} from '../constants';
import { unitConversion } from './unitConversion';
import BigNumber from 'bignumber.js';
import RpcClient from './rpc-client';
import Mnemonic from './mnemonic';
import store from '../app/rootStore';
import queue from '../worker/queue';
import DefiIcon from '../assets/svg/defi-icon.svg';
import BTCIcon from '../assets/svg/icon-coin-bitcoin-lapis.svg';
import EthIcon from '../assets/svg/eth-icon.svg';
import USDTIcon from '../assets/svg/usdt-icon.svg';
import DogeIcon from '../assets/svg/doge-icon.svg';
import LtcIcon from '../assets/svg/ltc-icon.svg';
import BchIcon from '../assets/svg/bch-icon.svg';
import {
  getAddressInfo,
  getTransactionInfo,
  handleFetchAccountDFI,
  handleGetPaymentRequest,
} from '../containers/WalletPage/service';
import { handleFetchToken } from '../containers/TokensPage/service';
import { handleFetchPoolshares } from '../containers/LiquidityPage/service';
import { I18n } from 'react-redux-i18n';
import openNewTab from './openNewTab';
import { symbol } from 'prop-types';
import {
  AccountKeyItem,
  AccountModel,
  PeerInfoModel,
} from '../constants/rpcModel';
import {
  ErrorMessages,
  HighestAmountItem,
  ResponseMessages,
} from '../constants/common';

export const validateSchema = (schema, data) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    log.error(validate.errors);
  }
  return valid;
};

export const getTxnSize = async (): Promise<number> => {
  const rpcClient = new RpcClient();
  const unspent = await rpcClient.listUnspent(new BigNumber(MAX_MONEY));

  const inputs = unspent.length;
  const outputs = 2;
  return inputs * 180 + outputs * 34 + 10 + inputs;
};

export const toSha256 = (value): any => {
  return SHA256(value).toString();
};

export const getAddressAndAmount = (
  addresses,
  balance
): IAddressAndAmount[] => {
  return addresses.map((addressObj) => {
    const { address, label } = addressObj;
    return { address, amount: balance, label };
  });
};

export const getTransactionURI = (
  unit: string,
  address: string,
  extraData: any
) => {
  Object.keys(extraData).forEach(
    (key) =>
      (extraData[key] === undefined ||
        extraData[key] === null ||
        extraData[key] === '') &&
      delete extraData[key]
  );
  const extraUriData = new URLSearchParams(extraData).toString();
  return `${unit}:${address}${extraUriData ? `?${extraUriData}` : ''}`;
};

export const dateTimeFormat = (date: string | Date) => {
  return moment(date).format(DATE_FORMAT);
};

export const getBlockDetails = (block) => {
  const blockDetails: IBlock = {
    hash: block.hash,
    size: block.size,
    height: block.height,
    version: block.version,
    merkleRoot: block.merkleroot,
    txnIds: block.tx,
    nonce: block.nonce,
    bits: block.bits,
    difficulty: block.difficulty,
    time: convertEpochToDate(block.time),
    nTxns: block.nTx,
  };
  return blockDetails;
};

// UNIT_CONVERSION
export const getTxnDetails = async (txns): Promise<ITxn[]> => {
  const rpcClient = new RpcClient();

  const promisedTxns = txns.map(async (txn) => {
    let height = -1;
    const fee = txn.category === 'send' ? txn.fee : 0;
    const blockHash = txn.blockhash || '';
    if (blockHash !== '') {
      const block = await rpcClient.getBlock(blockHash, 1);
      height = block.height;
    }
    return {
      height,
      address: txn.address,
      category: txn.category,
      amount: txn.amount,
      fee,
      confirmations: txn.confirmations,
      blockHash,
      txnId: txn.txid,
      time: convertEpochToDate(txn.time),
      timeReceived: convertEpochToDate(txn.timereceived),
      unit: DEFAULT_UNIT,
    };
  });

  const parsedTxns: ITxn[] = await Promise.all(promisedTxns);
  return parsedTxns;
};

const getToAddressAmountMap = (vouts) => {
  const addressAmountMap = new Map<string, string>();
  for (const vout of vouts) {
    if (vout.scriptPubKey.type !== 'nulldata') {
      const address = vout.scriptPubKey.addresses[0];
      if (addressAmountMap.has(address)) {
        const oldAmount = addressAmountMap.get(address) || 0;
        addressAmountMap.set(
          address,
          new BigNumber(oldAmount).plus(new BigNumber(vout.value)).toString()
        );
      } else {
        addressAmountMap.set(address, vout.value.toString());
      }
    }
  }

  const tos: IAddressAndAmount[] = vouts.reduce((tos, vout) => {
    if (vout.scriptPubKey.type === 'nulldata') {
      tos.push({ address: UNPARSED_ADDRESS, amount: vout.value.toString() });
    }
    return tos;
  }, []);

  return { addressAmountMap, tos };
};

const getToList = (vouts): IAddressAndAmount[] => {
  const { addressAmountMap, tos } = getToAddressAmountMap(vouts);
  const toList: IAddressAndAmount[] = [];
  addressAmountMap.forEach((amount: string, address: string) => {
    toList.push({ address, amount });
  });
  const unparsedAddressList: IAddressAndAmount[] = tos.map((to) => {
    return { address: to.address, amount: to.amount };
  });

  return toList.concat(unparsedAddressList);
};

export const parseTxn = (fullRawTx): IParseTxn => {
  const toList: IAddressAndAmount[] = getToList(fullRawTx.vout);

  return {
    hash: fullRawTx.hash,
    time: convertEpochToDate(fullRawTx.blocktime),
    tos: toList,
    unit: DEFAULT_UNIT,
  };
};

export const convertEpochToDate = (epoch): string => {
  return moment.unix(epoch).format(DATE_FORMAT);
};

export const getTimeDifferenceMS = (time: number): number => {
  return moment.unix(time).toDate().getTime() - new Date().getTime();
};

export const range = (from: number, to: number, step = 1) => {
  let i = from;
  const range: number[] = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

export const fetchPageNumbers = (
  currentPage: number,
  totalPages: number,
  pageNeighbors: number
) => {
  const totalNumbers = pageNeighbors * 2;
  const totalBlocks = totalNumbers + 1;
  if (totalPages >= totalBlocks) {
    const prev =
      currentPage === totalPages
        ? currentPage - pageNeighbors - 1
        : currentPage - pageNeighbors;
    const next =
      currentPage === 1
        ? currentPage + pageNeighbors + 1
        : currentPage + pageNeighbors;
    const startPage = Math.max(1, prev);
    const endPage = Math.min(totalPages, next);
    return range(startPage, endPage);
  }
  return range(1, totalPages);
};

// Handle case where user will change the local storage manually
export const getAmountInSelectedUnit = (
  amount: number | string,
  toUnit: string,
  from: string = DEFAULT_UNIT
): string => {
  return convertAmountFromUnit(amount, toUnit, from).toString(10);
};

/**
 * @description - Use if you need to use BigNumber
 * @param amount
 * @param toUnit
 * @param from
 */
export const convertAmountFromUnit = (
  amount: number | string,
  toUnit: string,
  from: string = DEFAULT_UNIT
): BigNumber => {
  return unitConversion(from, toUnit, amount);
};

export const isLessThanDustAmount = (
  amount: number | string,
  unit: string
): boolean => {
  const convertedAmount = getAmountInSelectedUnit(amount, DEFAULT_UNIT, unit);
  return new BigNumber(convertedAmount).lte(DUST_VALUE_DFI);
};

export const getRpcMethodName = (query: string) => {
  if (!query.trim().length) throw new Error('Invalid command');

  const splitQuery = query.trim().split(' ');
  if (splitQuery[0] === DEFI_CLI) {
    return splitQuery[1];
  }
  return splitQuery[0];
};

export const getParams = (query: string) => {
  const splitQuery = query.trim().split(' ');
  let params = splitQuery.slice(1);
  if (splitQuery[0] === DEFI_CLI) {
    params = splitQuery.slice(2);
  }
  const parsedParams = params.map((param) => {
    if (
      (param.startsWith('"') && param.endsWith('"')) ||
      (param.startsWith("'") && param.endsWith("'"))
    ) {
      return param.replace(/"/g, '').replace(/'/g, '');
    } else if (
      (param.startsWith('{') && param.endsWith('}')) ||
      (param.startsWith('[') && param.endsWith(']'))
    ) {
      try {
        return JSON.parse(param);
      } catch (e) {
        return param;
      }
    } else if (param === 'true' || param === 'false') {
      return param === 'true' ? true : false;
    }
    const paramVal = new BigNumber(param);
    return paramVal.isNaN()
      ? param
      : paramVal.isInteger()
      ? paramVal.toNumber()
      : paramVal.toFixed(8);
  });
  return parsedParams;
};

export const filterByValue = (array, query) => {
  return array.filter((o) =>
    Object.keys(o).some((k) => {
      const stringer = JSON.stringify(o[k]);
      return stringer.toLowerCase().includes(query.toLowerCase());
    })
  );
};

export const filterByValueMap = (map, query) => {
  const filteredMap: Map<string, ITokenBalanceInfo> = new Map();
  const keys: string[] = Array.from(map.keys());
  keys.map((key: string) => {
    if (key.toLowerCase().includes(query.toLowerCase())) {
      filteredMap.set(key, map.get(key));
    }
  });
  return filteredMap;
};

export const paginate = (array, pageSize, pageNo) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((pageNo - 1) * pageSize, pageNo * pageSize);
};

export const getErrorMessage = (errorResponse) => {
  let message = errorResponse.message;
  if (errorResponse.response) {
    const { data } = errorResponse.response;
    message = data;
    if (data.error) {
      message = data.error.message;
    }
  }
  return typeof message === 'string' ? message : JSON.stringify(message);
};

export const shouldRemapError = (
  message: string,
  keywords: string[]
): boolean => {
  let shouldReMap = false;
  if (message != null && keywords.length > 0) {
    keywords.forEach((k: string) => {
      shouldReMap = message.toLowerCase().includes(k.toLowerCase());
    });
  }
  return shouldReMap;
};

export const getErrorRemapping = (
  message: string,
  keywords: string[],
  response: string
): string => {
  if (message != null && keywords.length > 0) {
    return shouldRemapError(message, keywords) ? I18n.t(response) : message;
  } else {
    return message;
  }
};

export const remapNodeError = (message: string): string => {
  if (message != null) {
    let remappedMessage = message;
    Object.keys(ErrorMessages).forEach(
      (v: string) =>
        (remappedMessage = getErrorRemapping(
          remappedMessage,
          [ErrorMessages[v] ?? ''],
          ResponseMessages[v] ?? ''
        ))
    );
    return remappedMessage;
  }
  return message;
};

export const setIntervalSynchronous = (func, delay) => {
  let timeoutId;
  const clear = () => {
    clearTimeout(timeoutId);
  };
  const intervalFunction = () => {
    func();
    timeoutId = setTimeout(intervalFunction, delay);
  };
  timeoutId = setTimeout(intervalFunction, delay);
  return clear;
};

export const getMnemonicObject = () => {
  const mnemonic = new Mnemonic();
  const mnemonicCode = mnemonic.createMnemonic(ENTROPY_BITS);
  const mnemonicWordArray = mnemonicCode.split(' ');
  return {
    mnemonicObj: getObjectFromArrayString(mnemonicWordArray),
    mnemonicCode,
  };
};

export const getRandomWordObject = () => {
  const randomWordArray = getRandomWordArray();
  return getObjectFromArrayString(randomWordArray);
};

export const getRandomWordArray = () => {
  const mnemonic = new Mnemonic();
  const randomCode = mnemonic.createMnemonic(RANDOM_WORD_ENTROPY_BITS);
  return randomCode.split(' ');
};

export const getObjectFromArrayString = (strArray: string[]) => {
  const strObj = {};
  for (const [index, str] of strArray.entries()) {
    strObj[index + 1] = str;
  }
  return strObj;
};

export const getMixWordsObject = (
  mnemonicObject: any,
  randomWordObject: any
) => {
  const mnemonicWordArray: any[] = getRandomWordsFromMnemonic(mnemonicObject);
  const randomWordArray = _.values(randomWordObject);
  const mixArray = shuffle(mnemonicWordArray.concat(randomWordArray));
  return getObjectFromArrayString(mixArray);
};

export const getRandomWordsFromMnemonic = (mnemonicObject: any) => {
  let min = MIN_WORD_INDEX;
  let max = MAX_WORD_INDEX;
  const mixArray: any[] = [];
  while (max <= TOTAL_WORD_LENGTH) {
    const index = getRandomNumber(min, max);
    mixArray.push(mnemonicObject[index]);

    min += 4;
    max += 4;
  }
  return mixArray;
};

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const checkElementsInArray = (
  selectedWordObjectArray: any[],
  mnemonicObject: any
): boolean => {
  const selectedWordArray = selectedWordObjectArray.map(
    (wordObj) => wordObj.value
  );

  if (selectedWordArray.length < 6) {
    return false;
  }

  const mnemonicWordArray = _.values(mnemonicObject);

  return selectedWordArray.every((word) => mnemonicWordArray.includes(word));
};

export const getNetworkType = () => {
  const state = store.getState();
  const blockChainInfo: any = state?.wallet?.blockChainInfo;
  return blockChainInfo.chain || MAIN;
};

export const getNetworkInfo = (networkType: string) => {
  if (networkType === MAIN) {
    return bitcoin.networks.bitcoin;
  }
  if (networkType === TEST) {
    return bitcoin.networks.testnet;
  }
  return bitcoin.networks.regtest;
};

export const getMnemonicFromObj = (mnemonicObj) => {
  const values: string[] = Object.values(mnemonicObj);
  const mnemonic = values.reduce((mnemonicCode, value) => {
    return mnemonicCode.concat(value + ' ');
  }, '');
  return mnemonic.trim();
};

export const isValidMnemonic = (mnemonicCode: string) => {
  const mnemonic = new Mnemonic();
  return mnemonic.isValidMnemonic(mnemonicCode);
};

export const queuePush = (
  methodName,
  params,
  callBack: (err, result) => void
) => {
  const {
    app: { isQueueReady },
  } = store.getState();
  if (isQueueReady) {
    return queue.push({ methodName, params }, callBack);
  }
};

const getPopularSymbolList = () => {
  return [DFI_SYMBOL, BTC_SYMBOL, ETH_SYMBOL];
};

export const setTokenMap = (tokenMap, tokenData, tokenId, isPopularToken) => {
  tokenMap.set(tokenData.symbolKey, {
    ...tokenData,
    hash: tokenId.toString(),
    isPopularToken,
  });
};

export const getToken = (tokenlist: any[]) => {
  const tokenMap = new Map<string, any>();
  const popularSymbolList = getPopularSymbolList();

  tokenlist.forEach((tokenData, tokenId) => {
    if (popularSymbolList.includes(tokenId.toString())) {
      setTokenMap(tokenMap, tokenData, tokenId, true);
    } else {
      setTokenMap(tokenMap, tokenData, tokenId, false);
    }
  });
  return tokenMap;
};

export const getTokenListForSwap = (
  poolPairList: any[],
  tokenBalanceList: string[],
  walletBalance: number
) => {
  const tokenMap = new Map<string, ITokenBalanceInfo>();
  const popularSymbolList = getPopularSymbolList();

  const uniqueTokenMap = getUniqueTokenMap(poolPairList);
  const balanceAndSymbolMap = getBalanceAndSymbolMap(tokenBalanceList);

  if (!balanceAndSymbolMap.has(DFI_SYMBOL)) {
    balanceAndSymbolMap.set(DFI_SYMBOL, '0');
  }

  uniqueTokenMap.forEach((symbolKey, tokenId) => {
    const finalBalance =
      tokenId === DFI_SYMBOL
        ? walletBalance
        : balanceAndSymbolMap.get(DFI_SYMBOL);
    if (popularSymbolList.includes(tokenId)) {
      if (tokenId === DFI_SYMBOL) {
        tokenMap.set(symbolKey, {
          hash: tokenId,
          balance: new BigNumber(finalBalance || 0).toFixed(8),
          isPopularToken: true,
        });
      } else {
        tokenMap.set(symbolKey, {
          hash: tokenId,
          balance: new BigNumber(
            balanceAndSymbolMap.get(tokenId) || '0'
          ).toFixed(8),
          isPopularToken: true,
        });
      }
    } else {
      tokenMap.set(symbolKey, {
        hash: tokenId,
        balance: new BigNumber(balanceAndSymbolMap.get(tokenId) || '0').toFixed(
          8
        ),
        isPopularToken: false,
      });
    }
  });
  return tokenMap;
};

export const getTokenAndBalanceMap = (
  poolPairList: any[],
  tokenBalanceList: string[],
  walletBalance: number
) => {
  const tokenMap = new Map<string, ITokenBalanceInfo>();
  const popularSymbolList = getPopularSymbolList();

  const uniqueTokenMap = getUniqueTokenMap(poolPairList);
  const balanceAndSymbolMap = getBalanceAndSymbolMap(tokenBalanceList);

  // Add DFI to list if DFI tokens are not present already
  if (!balanceAndSymbolMap.has(DFI_SYMBOL)) {
    balanceAndSymbolMap.set(DFI_SYMBOL, '0');
  }

  balanceAndSymbolMap.forEach((balance, symbol) => {
    const finalBalance = symbol === DFI_SYMBOL ? walletBalance : balance;
    if (popularSymbolList.includes(symbol) && uniqueTokenMap.has(symbol)) {
      tokenMap.set(uniqueTokenMap.get(symbol), {
        hash: symbol,
        balance: new BigNumber(finalBalance).toFixed(8).toString(),
        isPopularToken: true,
      });
    } else if (uniqueTokenMap.has(symbol)) {
      tokenMap.set(uniqueTokenMap.get(symbol), {
        hash: symbol,
        balance: new BigNumber(finalBalance).toFixed(8).toString(),
        isPopularToken: false,
      });
    }
  });
  return tokenMap;
};

export const getUniqueTokenMap = (poolPairList) => {
  return poolPairList.reduce((uniqueTokenList, poolPair) => {
    const { symbol } = poolPair;
    const symbolList: string[] = symbol.split('-');
    if (!uniqueTokenList.has(poolPair.idTokenA)) {
      uniqueTokenList.set(poolPair.idTokenA, symbolList[0]);
    }
    if (!uniqueTokenList.has(poolPair.idTokenB)) {
      uniqueTokenList.set(poolPair.idTokenB, symbolList[1]);
    }
    return uniqueTokenList;
  }, new Map<string, string>());
};

export const getBalanceAndSymbolMap = (tokenBalanceList: string[]) => {
  return tokenBalanceList.reduce((balanceAndSymbolMap, item) => {
    const itemList: string[] = item.split(AMOUNT_SEPARATOR);
    if (itemList[1] !== DFI_SYMBOL) {
      balanceAndSymbolMap.set(itemList[1], itemList[0]);
    }
    return balanceAndSymbolMap;
  }, new Map<string, string>());
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const fetchPoolPairDataWithPagination = async (
  start: number,
  limit: number,
  fetchList: Function
) => {
  const rpcClient = new RpcClient();
  const govResult = await rpcClient.getGov();
  const lpDailyDfiReward = govResult[LP_DAILY_DFI_REWARD];
  const poolStats = await getPoolStatsFromAPI();
  const coinPriceObj = await parsedCoinPriceData();

  const list: any[] = [];
  const result = await fetchList(start, true, limit);
  const transformedData = Object.keys(result).map(async (item: any) => {
    const { reserveA, reserveB, idTokenA, idTokenB, rewardPct } = result[item];
    const tokenAData = await handleFetchToken(idTokenA);
    const tokenBData = await handleFetchToken(idTokenB);

    const yearlyPoolReward = new BigNumber(lpDailyDfiReward)
      .times(rewardPct)
      .times(365)
      .times(coinPriceObj[DFI_SYMBOL]);

    const poolShares = await handleFetchPoolshares();

    const poolShare = poolShares.find((poolshare) => {
      return poolshare.poolID === item;
    });

    const liquidityReserveidTokenA = new BigNumber(reserveA).times(
      coinPriceObj[idTokenA] || 0
    );

    const liquidityReserveidTokenB = new BigNumber(reserveB).times(
      coinPriceObj[idTokenB] || 0
    );
    const totalLiquidity = liquidityReserveidTokenA.plus(
      liquidityReserveidTokenB
    );
    const apy = new BigNumber(
      poolStats[`${idTokenA}_${idTokenB}`]?.apy || 0
    ).toFixed(2);
    return {
      key: item,
      poolID: item,
      tokenA: tokenAData.symbol,
      tokenB: tokenBData.symbol,
      ...result[item],
      poolSharePercentage: poolShare
        ? new BigNumber(poolShare.poolSharePercentage).toFixed(8)
        : '0',
      totalLiquidityInUSDT: totalLiquidity.toNumber().toFixed(8),
      yearlyPoolReward: yearlyPoolReward.toNumber().toFixed(8),
      apy,
    };
  });
  const resolvedTransformedData = await Promise.all(transformedData);
  if (resolvedTransformedData.length === 0) {
    return [];
  }
  list.push(...resolvedTransformedData);
  start = new BigNumber(
    resolvedTransformedData[resolvedTransformedData.length - 1].key || 0
  ).toNumber();
  while (true) {
    const result = await fetchList(start, false, limit);
    const transformedData = Object.keys(result).map(async (item: any) => {
      const { reserveA, reserveB, idTokenA, idTokenB, rewardPct } = result[
        item
      ];
      const tokenAData = await handleFetchToken(idTokenA);
      const tokenBData = await handleFetchToken(idTokenB);

      const yearlyPoolReward = new BigNumber(lpDailyDfiReward)
        .times(rewardPct)
        .times(365)
        .times(coinPriceObj[DFI_SYMBOL]);

      const poolShares = await handleFetchPoolshares();

      const poolShare = poolShares.find((poolshare) => {
        return poolshare.poolID === item;
      });

      const liquidityReserveidTokenA = new BigNumber(reserveA).times(
        coinPriceObj[idTokenA] || 0
      );
      const liquidityReserveidTokenB = new BigNumber(reserveB).times(
        coinPriceObj[idTokenB] || 0
      );
      const totalLiquidity = liquidityReserveidTokenA.plus(
        liquidityReserveidTokenB
      );
      return {
        key: item,
        poolID: item,
        tokenA: tokenAData.symbol,
        tokenB: tokenBData.symbol,
        ...result[item],
        poolSharePercentage: poolShare
          ? new BigNumber(poolShare.poolSharePercentage).toFixed(8)
          : '0',
        totalLiquidityInUSDT: totalLiquidity.toFixed(8),
        yearlyPoolReward: yearlyPoolReward.toFixed(8),
        apy: calculateAPY(totalLiquidity, yearlyPoolReward),
      };
    });
    const resolvedTransformedData = await Promise.all(transformedData);
    if (resolvedTransformedData.length === 0) {
      break;
    }
    list.push(...resolvedTransformedData);
    start = Number(
      resolvedTransformedData[resolvedTransformedData.length - 1].key || 0
    );
  }
  return list;
};

export const fetchTokenDataWithPagination = async (
  start: number,
  limit: number,
  fetchList: Function
) => {
  const list: any[] = [];
  const result = await fetchList(start, true, limit);
  const transformedData = Object.keys(result).map((item) => ({
    hash: item,
    ...result[item],
  }));
  if (transformedData.length === 0) {
    return [];
  }
  list.push(...transformedData);
  start = Number(transformedData[transformedData.length - 1].hash);
  while (true) {
    const result = await fetchList(start, false, limit);
    const transformedData = Object.keys(result).map((item) => ({
      hash: item,
      ...result[item],
    }));
    if (transformedData.length === 0) {
      break;
    }
    list.push(...transformedData);
    start = Number(transformedData[transformedData.length - 1].hash);
  }
  return list;
};

export const fetchAccountsDataWithPagination = async (
  start: string,
  limit: number,
  fetchList: Function
) => {
  const list: any[] = [];
  const result = await fetchList(true, limit);
  if (result.length === 0) {
    return [];
  }
  list.push(...result);
  start = result[result.length - 1].key;
  while (true) {
    const result = await fetchList(false, limit, start);
    if (result.length === 0) {
      break;
    }
    list.push(...result);
    start = result[result.length - 1].key;
  }
  return list;
};

export const fetchPoolShareDataWithPagination = async (
  start: number,
  limit: number,
  fetchList: Function
) => {
  const list: any[] = [];
  const result = await fetchList(start, true, limit);
  const transformedData = Object.keys(result).map((item) => ({
    key: item.split(AMOUNT_SEPARATOR)[0],
    ...result[item],
  }));
  if (transformedData.length === 0) {
    return [];
  }
  list.push(...transformedData);
  start = Number(transformedData[transformedData.length - 1].key);
  while (true) {
    const result = await fetchList(start, false, limit);
    const transformedData = Object.keys(result).map((item) => ({
      key: item.split(AMOUNT_SEPARATOR)[0],
      ...result[item],
    }));
    if (transformedData.length === 0) {
      break;
    }
    list.push(...transformedData);
    start = Number(transformedData[transformedData.length - 1].key);
  }
  return list;
};

export const getTotalBlocks = async () => {
  const network = getNetworkType();
  const { data } = await axios({
    url: `${STATS_API_BLOCK_URL}?network=${network}net`,
    method: 'GET',
    timeout: API_REQUEST_TIMEOUT,
  });
  return data;
};

export const getStatsYieldFarming = async () => {
  const network = getNetworkType();
  const { data } = await axios({
    url: `${STATS_API_BASE_URL}listyieldfarming?network=${network}net`,
    method: 'GET',
    timeout: API_REQUEST_TIMEOUT,
  });
  return data;
};

export const getPoolStatsFromAPI = async () => {
  const stats = await getStatsYieldFarming();
  const poolStats = {};
  stats?.pools?.forEach((a) => {
    if (a != null) {
      poolStats[`${a.idTokenA}_${a.idTokenB}`] = a;
    }
  });
  return poolStats;
};

export const calculateInputAddLiquidityLeftCard = (
  input1: string,
  formState,
  poolPairList
) => {
  const ratio = new BigNumber(1).div(
    new BigNumber(conversionRatio(formState, poolPairList))
  );
  if (input1 && formState.symbol1 && formState.symbol2 && ratio) {
    return ratio.times(input1).toFixed(8);
  }
  return '0';
};

export const calculateInputAddLiquidity = (
  input1: string,
  formState,
  poolPairList
) => {
  const ratio = new BigNumber(conversionRatio(formState, poolPairList));
  if (input1 && formState.symbol1 && formState.symbol2 && ratio) {
    return ratio.times(input1).toFixed(8);
  }
  return '0';
};

export const countDecimals = (value) => {
  if (value % 1 !== 0) return value.toString().split('.')[1].length;
  return 0;
};

export const selectedPoolPair = (formState, poolPairList) => {
  let condition1;
  let condition2;
  const poolPair = poolPairList.find((poolpair) => {
    condition1 =
      poolpair.idTokenA === formState.hash1 &&
      poolpair.idTokenB === formState.hash2;
    condition2 =
      poolpair.idTokenA === formState.hash2 &&
      poolpair.idTokenB === formState.hash1;
    return condition1 || condition2;
  });
  return [poolPair, condition1];
};

export const conversionRatio = (formState, poolPairList) => {
  const [poolPair, condition1] = selectedPoolPair(formState, poolPairList);

  const ratio = condition1
    ? poolPair['reserveB/reserveA'] !== '0'
      ? new BigNumber(poolPair.reserveB).div(new BigNumber(poolPair.reserveA))
      : new BigNumber(0)
    : poolPair['reserveA/reserveB'] !== '0'
    ? new BigNumber(poolPair.reserveA).div(new BigNumber(poolPair.reserveB))
    : new BigNumber(0);

  return ratio.toFixed(8, 1);
};

export const conversionRatioDex = (formState) => {
  return new BigNumber(formState.amount2).div(formState.amount1).toFixed(8);
};

export const getRatio = (poolpair) => {
  const ratio = new BigNumber(poolpair.reserveA).div(poolpair.reserveB);
  return ratio.toFixed(8);
};

export const shareOfPool = (formState, poolPairList) => {
  const [poolPair] = selectedPoolPair(formState, poolPairList);

  const shareA =
    formState.hash1 === poolPair.idTokenA
      ? new BigNumber(formState.amount1).div(new BigNumber(poolPair.reserveA))
      : new BigNumber(formState.amount1).div(new BigNumber(poolPair.reserveB));

  const shareB =
    formState.hash2 === poolPair.idTokenB
      ? new BigNumber(formState.amount2).div(new BigNumber(poolPair.reserveB))
      : new BigNumber(formState.amount2).div(new BigNumber(poolPair.reserveA));

  const shareOfPool = shareA
    .plus(shareB)
    .div(2)
    .times(100)
    .toNumber()
    .toFixed(8);

  return `${shareOfPool} %`;
};

export const getTotalPoolValue = (formState, poolPairList, hash) => {
  const [poolPair] = selectedPoolPair(formState, poolPairList);
  return hash === poolPair.idTokenA ? poolPair.reserveA : poolPair.reserveB;
};

export const calculateLPFee = (formState, poolPairList) => {
  const [poolPair] = selectedPoolPair(formState, poolPairList);
  return new BigNumber(formState.amount1)
    .times(poolPair.commission)
    .toNumber()
    .toFixed(8);
};

export const getIcon = (symbol: string) => {
  const symbolIconObj = {
    BTC: BTCIcon,
    ETH: EthIcon,
    USDT: USDTIcon,
    DFI: DefiIcon,
    DOGE: DogeIcon,
    LTC: LtcIcon,
    BCH: BchIcon,
  };
  return symbolIconObj[symbol];
};

export const isAddressMine = async (address) => {
  const addressInfo = await getAddressInfo(address);
  if (addressInfo.ismine && !addressInfo.iswatchonly) {
    return true;
  }
  return false;
};

export const hdWalletCheck = async (address) => {
  const rpcClient = new RpcClient();
  const addressInfo = await getAddressInfo(address);
  const walletInfo = await rpcClient.getWalletInfo();
  if (addressInfo.hdseedid === walletInfo.hdseedid) {
    return true;
  }
  return false;
};

export const getAddressAndAmountListForAccount = async () => {
  const rpcClient = new RpcClient();
  const accountList = await fetchAccountsDataWithPagination(
    '',
    LIST_ACCOUNTS_PAGE_SIZE,
    rpcClient.listAccounts
  );

  const addressAndAmountList = accountList.map(async (account) => {
    return {
      amount: account.amount,
      address: account.owner.addresses[0],
    };
  });
  return _.compact(await Promise.all(addressAndAmountList));
};

export const getHighestAmountAddressForSymbol = (
  key: string,
  list: HighestAmountItem[],
  sendAmount?: BigNumber
): HighestAmountItem => {
  let maxAmount = new BigNumber(0);
  let address = '';
  const hasSendAmountValidation = (
    sendAmount: BigNumber,
    tokenAmount: BigNumber
  ) => {
    return sendAmount.lte(tokenAmount);
  };
  for (const obj of list) {
    const tokenSymbol = Object.keys(obj.amount)[0];
    const tokenAmount = new BigNumber(obj.amount[tokenSymbol]);
    const tokenAddress = obj.address;
    if (
      key === tokenSymbol &&
      new BigNumber(tokenAmount).gt(maxAmount) &&
      (sendAmount != null
        ? hasSendAmountValidation(sendAmount, tokenAmount)
        : true)
    ) {
      maxAmount = tokenAmount;
      address = tokenAddress;
    }
  }
  if (!address) {
    const networkName = getNetworkType();
    const paymentRequests = handleGetPaymentRequest(networkName);
    address = (paymentRequests ?? [])[0]?.address;
  }
  return { address, amount: maxAmount };
};

export const getCoinPriceInUSD = async (conversionCurrency: string) => {
  const ids = getIDs();
  const { data } = await axios({
    url: `${COINGECKO_API_BASE_URL}/simple/price`,
    method: 'GET',
    params: {
      ids,
      vs_currencies: conversionCurrency,
    },
  });
  return data;
};

export const parsedCoinPriceData = async () => {
  const result = await getCoinPriceInUSD(VS_CURRENCY);
  const coinMap = getCoinMap();
  return Object.keys(result).reduce((coinPriceObj: any, item) => {
    const symbol = coinMap.get(item) || '0';
    coinPriceObj[symbol] = result[item][VS_CURRENCY];
    return coinPriceObj;
  }, {});
};

export const getCoinMap = () => {
  const networkType = getNetworkType();
  const btcSymbol = networkType === MAIN ? MAINNET_BTC_SYMBOL : BTC_SYMBOL;
  const ethSymbol = networkType === MAIN ? MAINNET_ETH_SYMBOL : ETH_SYMBOL;
  const usdtSymbol = networkType === MAIN ? MAINNET_USDT_SYMBOL : USDT_SYMBOL;
  const ltcSymbol = networkType === MAIN ? MAINNET_LTC_SYMBOL : LTC_SYMBOL;
  const dogeSymbol = networkType === MAIN ? MAINNET_DOGE_SYMBOL : DOGE_SYMBOL;
  const bchSymbol = networkType === MAIN ? MAINNET_BCH_SYMBOL : BCH_SYMBOL;

  const coinMap: Map<string, string> = new Map<string, string>([
    [COINGECKO_DFI_ID, DFI_SYMBOL],
    [COINGECKO_BTC_ID, btcSymbol],
    [COINGECKO_ETH_ID, ethSymbol],
    [COINGECKO_USDT_ID, usdtSymbol],
    [COINGECKO_LTC_ID, ltcSymbol],
    [COINGECKO_DOGE_ID, dogeSymbol],
    [COINGECKO_BCH_ID, bchSymbol],
  ]);
  return coinMap;
};

export const getCoinIds = () => {
  return [
    COINGECKO_DFI_ID,
    COINGECKO_BTC_ID,
    COINGECKO_ETH_ID,
    COINGECKO_USDT_ID,
    COINGECKO_LTC_ID,
    COINGECKO_DOGE_ID,
    COINGECKO_BCH_ID,
  ];
};

export const getIDs = () => {
  const coinIdList = getCoinIds();
  const parsedIds = '' + coinIdList;
  return parsedIds;
};

export const getDfiUTXOS = async () => {
  const rpcClient = new RpcClient();
  return await rpcClient.getBalance();
};

export const handleUtxoToAccountConversion = async (
  hash: string,
  address: string,
  amount: BigNumber,
  maxAmount: BigNumber
) => {
  const rpcClient = new RpcClient();
  const dfiUtxos = await getDfiUTXOS();
  if (amount.gt(maxAmount.plus(dfiUtxos))) {
    throw new Error(`Insufficent DFI in account`);
  }

  const transferAmount = amount.minus(maxAmount);
  const utxoToDfiTxId = await rpcClient.utxosToAccount(
    address,
    `${transferAmount.toFixed(8)}@${hash}`
  );
  await getTransactionInfo(utxoToDfiTxId);
};

export const handleAccountToAccountConversion = async (
  addressAndAmountList: any[],
  toAddress: string,
  hash: string
) => {
  const rpcClient = new RpcClient();
  const amounts = {};
  for (const obj of addressAndAmountList) {
    const tokenSymbol = Object.keys(obj.amount)[0];
    if (tokenSymbol === hash && obj.address !== toAddress) {
      amounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
    }
  }

  const accountToAccountTxHashes: any[] = [];
  let amountTransfered = new BigNumber(0);
  for (const obj of addressAndAmountList) {
    const tokenSymbol = Object.keys(obj.amount)[0];
    const amount = new BigNumber(obj.amount[tokenSymbol]);

    if (tokenSymbol === hash && obj.address !== toAddress) {
      const txId = await rpcClient.accountToAccount(
        obj.address,
        toAddress,
        `${amount.toFixed(8)}@${tokenSymbol}`
      );

      const promiseHash = getTransactionInfo(txId);
      accountToAccountTxHashes.push(promiseHash);
      amountTransfered = amountTransfered.plus(amount);
    }
  }
  await Promise.all(accountToAccountTxHashes);
  return amountTransfered;
};

export const getAddressAndAmountListPoolShare = async (poolID) => {
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

    if (
      addressInfo.ismine &&
      !addressInfo.iswatchonly &&
      poolShare.poolID === poolID
    ) {
      return {
        amount: poolShare.amount,
        address: poolShare.owner,
      };
    }
  });

  const resolvedMineAddressAndAmountListPoolShare = _.compact(
    await Promise.all(minePoolShares)
  );

  const sortedList = resolvedMineAddressAndAmountListPoolShare.sort(
    (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
  );

  return sortedList;
};

export const getTotalAmountPoolShare = async (poolID) => {
  const list = await getAddressAndAmountListPoolShare(poolID);
  const totalAmount = list.reduce((amount, obj) => {
    return new BigNumber(amount).plus(obj.amount).toNumber();
  }, 0);

  return totalAmount;
};

export const getSymbolKey = (symbol: string, key: string, isLPS?) => {
  const networkType = getNetworkType();
  const btcSymbol = networkType === MAIN ? MAINNET_BTC_SYMBOL : BTC_SYMBOL;
  const ethSymbol = networkType === MAIN ? MAINNET_ETH_SYMBOL : ETH_SYMBOL;
  const usdtSymbol = networkType === MAIN ? MAINNET_USDT_SYMBOL : USDT_SYMBOL;
  const ltcSymbol = networkType === MAIN ? MAINNET_LTC_SYMBOL : LTC_SYMBOL;
  const dogeSymbol = networkType === MAIN ? MAINNET_DOGE_SYMBOL : DOGE_SYMBOL;
  const bchSymbol = networkType === MAIN ? MAINNET_BCH_SYMBOL : BCH_SYMBOL;
  const tokens = [
    DFI_SYMBOL,
    btcSymbol,
    ethSymbol,
    usdtSymbol,
    ltcSymbol,
    dogeSymbol,
    bchSymbol,
  ];
  if (tokens.indexOf(key) !== -1 || isLPS) {
    return symbol;
  }
  return `${symbol}#${key}`;
};
export const selectNfromRange = (lowerBound, upperBound, limit = 6) => {
  const distinctRandomNumbers: number[] = [];
  while (distinctRandomNumbers.length < limit) {
    const randomNum = Math.floor(
      Math.random() * (upperBound - lowerBound) + lowerBound
    );
    if (distinctRandomNumbers.indexOf(randomNum) === -1) {
      distinctRandomNumbers.push(randomNum);
    }
  }
  return distinctRandomNumbers;
};

export const numberWithCommas = (nStr) => {
  nStr += '';
  const x = nStr.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};
export const getBalanceForSymbol = async (address: string, symbol: string) => {
  const rpcClient = new RpcClient();
  const balanceArray: string[] = await rpcClient.getAccount(address);

  const tokenInfo = await rpcClient.tokenInfo(symbol);
  const { symbolKey } = tokenInfo[symbol];

  return balanceArray.reduce((amount, item) => {
    const itemList: string[] = item.split(AMOUNT_SEPARATOR);

    if (itemList[1] === symbolKey) {
      amount = new BigNumber(itemList[0]).toFixed(8);
    }
    return amount;
  }, '0');
};

export const getSmallerAmount = (amount1: string, amount2: string) => {
  return BigNumber.minimum(amount1, amount2);
};

export const calculateAPY = (
  totalLiquidity: BigNumber,
  yearlyPoolReward: BigNumber
) => {
  return totalLiquidity.toNumber()
    ? yearlyPoolReward
        .div(totalLiquidity)
        .times(APY_MULTIPLICATION_FACTOR)
        .toFixed(2)
    : 0;
};

export const getTransactionAddressLabel = (
  receiveLabel: string,
  receiveAddress: string,
  fallback: string
) => {
  let label = `${receiveLabel ? receiveLabel + ' ' : ''}`;
  label = label + receiveAddress;
  return receiveAddress ? label : fallback;
};

export const getPageTitle = (pageTitle?: string) => {
  const appTitle = I18n.t('general.defiApp');
  return pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;
};

export const handleFetchTokenDFI = async () => {
  const accountDFI = await handleFetchAccountDFI();
  return accountDFI.toFixed(8);
};

export const handleFetchUtxoDFI = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBalance();
};

export const parseAccountKey = (key: string): AccountKeyItem => {
  const arr = key?.split(AMOUNT_SEPARATOR) ?? [];
  return {
    address: arr[0] ?? '',
    hash: arr[1] ?? '',
  };
};

export const getTokenBalances = (listAccounts: AccountModel[]): string[] => {
  try {
    const tokenBalances: string[] = [];
    const mapKey = {};
    listAccounts
      .filter((account) => parseAccountKey(account.key).address != '')
      .forEach((account) => {
        const { hash } = parseAccountKey(account.key);
        const amount = account.amount[hash] || 0;
        mapKey[hash] =
          mapKey[hash] == null
            ? new BigNumber(amount)
            : new BigNumber(amount).plus(mapKey[hash] || 0);
      });
    Object.keys(mapKey).forEach((k) => {
      tokenBalances.push(`${mapKey[k]}${AMOUNT_SEPARATOR}${k}`);
    });
    return tokenBalances;
  } catch (error) {
    log.error(error, 'getTokenBalances');
    return [];
  }
};

export const handleFetchTokenBalanceList = async (): Promise<string[]> => {
  const tokenBalance = [];
  try {
    const rpcClient = new RpcClient();
    const listAccounts: AccountModel[] = await rpcClient.listAccounts(
      true,
      LIST_ACCOUNTS_PAGE_SIZE
    );
    return getTokenBalances(listAccounts);
  } catch (error) {
    log.error(error, 'handleFetchTokenBalanceList');
  }
  return tokenBalance;
};

export const isValidAddress = async (toAddress: string) => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.isValidAddress(toAddress);
  } catch (err) {
    log.error(`Got error in isValidAddress: ${err}`);
    return false;
  }
};

export const createChainURL = (tx: string): string => {
  const [url, net] =
    getNetworkType() === MAIN
      ? [DEFICHAIN_MAINNET_LINK, MAINNET]
      : [DEFICHAIN_TESTNET_LINK, TESTNET];
  return `${url}#/DFI/${net.toLowerCase()}/tx/${tx ?? ''}`;
};

export const onViewOnChain = (tx: string): void => {
  openNewTab(createChainURL(tx));
};

export const handlePeersSyncRequest = async (
  shouldAllowEmptyPeers?: boolean
): Promise<PeerInfoModel[]> => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.getPeerInfo(shouldAllowEmptyPeers);
  } catch (err) {
    log.error(err, 'handlePeersSyncRequest');
    return [];
  }
};

export const getMaxNumberOfAmount = (value: string, hash: string): string => {
  return hash === DFI_SYMBOL
    ? BigNumber.maximum(new BigNumber(value).minus(1), 0).toFixed(8, 1)
    : new BigNumber(value).toFixed(8, 1);
};

export const shortenedPathAddress = (p: string): string => {
  try {
    const fileLength = 50;
    if (p && p.length > fileLength) {
      const middle = Math.floor(p.length / 3);
      const firstHalf = Math.floor(middle / 2);
      return p.replace(p.substr(firstHalf, firstHalf * 2), '...');
    } else {
      return p;
    }
  } catch (error) {
    log.error(error, 'shortenedPathAddress');
    return p;
  }
};

export const getFormattedTime = () => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  return `${y}-${m}-${d}_${h}-${mi}-${s}`;
};

export const checkRPCErrorMessagePending = (message: string): string => {
  if (message) {
    const lpKeywords = ['amount', 'is less than'];
    if (shouldRemapError(message, lpKeywords)) {
      return getErrorRemapping(
        message,
        lpKeywords,
        ResponseMessages.BLOCKS_PENDING
      );
    } else {
      return remapNodeError(message);
    }
  }
  return message;
};
