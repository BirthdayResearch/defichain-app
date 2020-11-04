import Ajv from 'ajv';
import axios from 'axios';

import * as log from './electronLogger';
import moment from 'moment';
import SHA256 from 'crypto-js/sha256';
import _ from 'lodash';
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
  IS_WALLET_CREATED_MAIN,
  IS_WALLET_CREATED_TEST,
  TEST,
  IS_WALLET_LOCKED_MAIN,
  IS_WALLET_LOCKED_TEST,
  RANDOM_WORD_ENTROPY_BITS,
  STATS_API_BASE_URL,
} from '../constants';
import { unitConversion } from './unitConversion';
import BigNumber from 'bignumber.js';
import RpcClient from './rpc-client';
import Mnemonic from './mnemonic';
import store from '../app/rootStore';
import queue from '../../src/worker/queue';
import PersistentStore from './persistentStore';
import DefiIcon from '../assets/svg/defi-icon.svg';
import BTCIcon from '../assets/svg/icon-coin-bitcoin-lapis.svg';
import EthIcon from '../assets/svg/eth-icon.svg';
import USDTIcon from '../assets/svg/usdt-icon.svg';

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
  const unspent = await rpcClient.listUnspent(MAX_MONEY);

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
    const { address } = addressObj;
    return { address, amount: balance };
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

export const getFromPersistentStorage = (path) => {
  return localStorage.getItem(path);
};

export const setToPersistentStorage = (path, data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  localStorage.setItem(path, data);
  return data;
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

export const convertEpochToDate = (epoch) => {
  return moment.unix(epoch).format(DATE_FORMAT);
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
) => {
  const to = toUnit;
  return unitConversion(from, to, amount);
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
    } else if (param === 'true' || param === 'false') {
      return param === 'true' ? true : false;
    }
    return isNaN(Number(param)) ? param : Number(param);
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

export const setIntervalSynchronous = (func, delay) => {
  let intervalFunction;
  let timeoutId;
  let clear;
  clear = () => {
    clearTimeout(timeoutId);
  };
  intervalFunction = () => {
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
  const mnemonic = new Mnemonic();
  const randomCode = mnemonic.createMnemonic(RANDOM_WORD_ENTROPY_BITS);
  const randomWordArray = randomCode.split(' ');
  return getObjectFromArrayString(randomWordArray);
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
  const blockChainInfo: any = state.wallet.blockChainInfo;
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

export const isWalletCreated = () => {
  const networkType = getNetworkType();
  const key =
    networkType === MAIN ? IS_WALLET_CREATED_MAIN : IS_WALLET_CREATED_TEST;
  return PersistentStore.get(key) || false;
};

const getPopularSymbolList = () => {
  return ['0', '1', '2'];
};

export const getTokenAndBalanceMap = (
  poolPairList: any[],
  tokenBalanceList: string[]
) => {
  const tokenMap = new Map<string, ITokenBalanceInfo>();
  const popularSymbolList = getPopularSymbolList();

  const uniqueTokenMap = getUniqueTokenMap(poolPairList);
  const balanceAndSymbolMap = getBalanceAndSymbolMap(tokenBalanceList);

  balanceAndSymbolMap.forEach((balance, symbol) => {
    if (popularSymbolList.includes(symbol) && uniqueTokenMap.has(symbol)) {
      tokenMap.set(uniqueTokenMap.get(symbol), {
        hash: symbol,
        balance,
        isPopularToken: true,
      });
    } else if (uniqueTokenMap.has(symbol)) {
      tokenMap.set(uniqueTokenMap.get(symbol), {
        hash: symbol,
        balance,
        isPopularToken: false,
      });
    }
  });
  return tokenMap;
};

const getUniqueTokenMap = (poolPairList) => {
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

const getBalanceAndSymbolMap = (tokenBalanceList: string[]) => {
  return tokenBalanceList.reduce((balanceAndSymbolMap, item) => {
    const itemList: string[] = item.split('@');
    return balanceAndSymbolMap.set(itemList[1], itemList[0]);
  }, new Map<string, string>());
};

export const fetchPoolPairDataWithPagination = async (
  start: number,
  limit: number,
  fetchList: Function
) => {
  const list: any[] = [];
  const result = await fetchList(start, true, limit);
  const transformedData = Object.keys(result).map((item) => ({
    key: item,
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
      key: item,
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
    key: item.split('@')[0],
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
      key: item.split('@')[0],
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

export const isWalletEncrypted = () => {
  const networkType = getNetworkType();
  const isWalletLocked =
    networkType === MAIN ? IS_WALLET_LOCKED_MAIN : IS_WALLET_LOCKED_TEST;
  return PersistentStore.get(isWalletLocked) || false;
};

export const getTotalBlocks = async () => {
  const network = getNetworkType();
  const { data } = await axios({
    url: `${STATS_API_BASE_URL}?network=${network}net`,
    method: 'GET',
  });
  return data;
};

export const getIcon = (symbol: string | null) => {
  if (symbol === 'BTC') {
    return BTCIcon;
  } else if (symbol === 'ETH') {
    return EthIcon;
  } else if (symbol === 'USDT') {
    return USDTIcon;
  } else {
    return DefiIcon;
  }
};
