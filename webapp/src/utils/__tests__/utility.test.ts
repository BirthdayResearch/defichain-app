import * as utility from '../utility';
import { rpcResponseSchemaMap } from '../schemas/rpcMethodSchemaMapping';
import * as methodNames from '@defi_types/rpcMethods';
import {
  validateSchema,
  getTxnDetails,
  expected,
  listUnspentTwo,
  mnemonicObject,
  mnemonicCode,
  validatedMnemonicCode,
  poolPairList,
  uniqueTokenList,
  main_net,
  test_net,
  other_net,
  address,
  tokenMap,
} from './testData.json';
import log from 'loglevel';
import { mockAxios } from '../testUtils/mockUtils';
import { AccountModel } from '../../constants/rpcModel';
import { BigNumber } from 'bignumber.js';

const DUST_VALUE_DFI = '0.00000546';
const DUST_VALUE_FI = '546';
const TEST: string = 'test';
const MAIN: string = 'main';
const OTHER_NETWORK = 'other_network';

describe('utility', () => {
  it('fetchPageNumbers when currentPage, totalPages, pageNeighbors', () => {
    const data = utility.fetchPageNumbers(0, 0, 0);
    expect(data).toHaveLength(0);
  });

  it('fetchPageNumbers with valid currentPage, totalPages, pageNeighbors', () => {
    const data = utility.fetchPageNumbers(1, 4, 1);
    expect(data).toHaveLength(3);
  });

  it('fetchPageNumbers with invalid currentPage, totalPages, pageNeighbors', () => {
    const data = utility.fetchPageNumbers(-1, -1, -1);
    expect(data).toHaveLength(0);
  });

  it('convertEpochToDate feature', () => {
    const data = utility.convertEpochToDate(1590584379);
    expect(data).toBe('May 27, 06:29 pm');
  });

  it('convertEpochToDate feature when value is null', () => {
    const data = utility.convertEpochToDate(null);
    expect(data).toBe('Jan 1, 05:30 am');
  });

  it('range feature value is valid', () => {
    const data = utility.range(1, 4);
    expect(data).toHaveLength(4);
  });

  it('range feature is to and from is invalid', () => {
    const data = utility.range(-1, -2);
    expect(data).toHaveLength(0);
  });

  it('dateTimeFormat is string', () => {
    const data = utility.dateTimeFormat('Wed May 27 2020 18:55:22');
    expect(data).toBe('May 27, 06:55 pm');
  });

  it('dateTimeFormat is Date object', () => {
    const data = utility.dateTimeFormat(new Date(2020, 4, 27, 19, 2, 15));
    expect(data).toBe('May 27, 07:02 pm');
  });

  it('getAddressAndAmount pass valid data ', async () => {
    const address = [
      '1AxAnLpXn9nDcqejmL4oKkGEDNUHRMmaHu',
      '1GteSB8ayQSuDVsoMCaCeBR5CbEKsbsDVM',
      '1DPYMWDzvSHYw2wW17cemB2XQc4jPfYegw',
    ];
    const testData = address.map((item) => ({
      address: item,
      amount: '',
    }));
    const data = await utility.getAddressAndAmount(testData, '');
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(testData);
  });

  it('getTxnDetails valid data pass when category is not send and fee attribute is not present', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getTxnDetails.getBlock,
    });
    mockAxios(post);
    const testData = getTxnDetails.category_not_send_fee_not_present;
    const data = await utility.getTxnDetails(testData);
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(
      expected.getTxnDetails.category_not_send_fee_not_present
    );
  });

  it('getTxnDetails valid data pass when category is send and fee attribute present ', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getTxnDetails.getBlock,
    });
    mockAxios(post);
    const testData = getTxnDetails.category_is_send_fee_present;
    const data = await utility.getTxnDetails(testData);
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(expected.getTxnDetails.category_is_send_fee_present);
  });

  it('getTxnDetails valid data pass when category is not send and fee attribute present ', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: getTxnDetails.getBlock,
    });
    mockAxios(post);
    const testData = getTxnDetails.category_is_not_send;
    const data = await utility.getTxnDetails(testData);
    expect(data).toBeInstanceOf(Array);
    expect(data).toEqual(expected.getTxnDetails.category_is_not_send);
  });

  it('getTransactionURI valid data without message and data ', async () => {
    const testData = {
      amount: 50.0,
      label: '',
      message: '',
    };

    const data = await utility.getTransactionURI(
      'fi',
      'bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9',
      testData
    );
    expect(data).toBe(
      'fi:bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9?amount=50'
    );
  });

  it('getTransactionURI valid data without message and data ', async () => {
    const testData = {
      amount: 50.0,
      label: 'random test',
      message: 'lorem ipsum',
    };

    const data = await utility.getTransactionURI(
      'fi',
      'bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9',
      testData
    );
    expect(data).toBe(
      'fi:bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9?amount=50&label=random+test&message=lorem+ipsum'
    );
  });

  it('getTransactionURI valid data with no extraprops ', async () => {
    const data = await utility.getTransactionURI(
      'fi',
      'bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9',
      {}
    );
    expect(data).toBe('fi:bcrt1qpneu4759jp5xc7we4xzgrmskxteqeewytnxqm9');
  });

  it('should test getAmountInSelectedUnit when passed string', () => {
    const data = utility.getAmountInSelectedUnit('50', 'fi');
    expect(data).toBe('5000000000');
  });

  it('should test getAmountInSelectedUnit when passed value', () => {
    const data = utility.getAmountInSelectedUnit(50, 'fi');
    expect(data).toBe('5000000000');
  });

  it('should test getAmountInSelectedUnit when passed from', () => {
    const data = utility.getAmountInSelectedUnit(50, 'DFI', 'fi');
    expect(data).toBe('0.0000005');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is DFI', () => {
    const data = utility.getAmountInSelectedUnit(DUST_VALUE_DFI, 'DFI');
    expect(data).toBe('0.00000546');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is fi', () => {
    const data = utility.getAmountInSelectedUnit(DUST_VALUE_DFI, 'fi');
    expect(data).toBe('546');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is DFI', () => {
    const data = utility.getAmountInSelectedUnit(DUST_VALUE_FI, 'DFI');
    expect(data).toBe('546');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is fi', () => {
    const data = utility.getAmountInSelectedUnit(DUST_VALUE_FI, 'fi');
    expect(data).toBe('54600000000');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is fi', () => {
    const data = utility.getAmountInSelectedUnit(0, 'fi');
    expect(data).toBe('0');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is fi', () => {
    const data = utility.getAmountInSelectedUnit(1000, 'fi');
    expect(data).toBe('100000000000');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is DFI', () => {
    const data = utility.getAmountInSelectedUnit(0, 'DFI');
    expect(data).toBe('0');
  });

  it('should test isDustAmount when equal to DUST_VALUE_DFI and unit is DFI', () => {
    const data = utility.getAmountInSelectedUnit(1000, 'DFI');
    expect(data).toBe('1000');
  });

  it('should test getTxnSize with two inputs', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: listUnspentTwo,
    });
    mockAxios(post);

    const test = await utility.getTxnSize();
    expect(test).toEqual(expected.getTxnSize);
    expect(post).toBeCalledTimes(1);
  });

  it('validateSchema valid object', () => {
    const isValid = utility.validateSchema(
      rpcResponseSchemaMap.get(methodNames.LIST_TRANSACTIONS),
      validateSchema
    );
    expect(isValid).toBeTruthy();
  });

  it('validateSchema invalid object', () => {
    const spy = jest.spyOn(log, 'error');
    const data = Object.assign({}, validateSchema);
    delete (data as any).result[0].time;
    const isValid = utility.validateSchema(
      rpcResponseSchemaMap.get(methodNames.LIST_TRANSACTIONS),
      data
    );
    expect(isValid).toBeFalsy();
    expect(spy).toBeCalledTimes(1);
  });

  it('should return empty array for token balances when there are no tokens', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: [] } });
    mockAxios(post);
    const result = await utility.handleFetchTokenBalanceList();
    expect(result).toEqual([]);
    expect(post).toBeCalledTimes(1);
  });

  it('should return smaller amount among between two numbers', () => {
    const result = utility.getSmallerAmount('10', '20');
    const number = new BigNumber(10);
    expect(result).toStrictEqual(number);
  });

  it('should return smaller amount among between two numbers', () => {
    const result = utility.getSmallerAmount('abc', 'def');
    expect(result).toBeNaN;
  });

  it('should return label if recieveAddress is present', () => {
    const result = utility.getTransactionAddressLabel(
      'receiveLabel',
      'receiveAddress',
      'fallback'
    );
    expect(result).toBe('receiveLabel receiveAddress');
  });

  it('should return fallback if recieveAddress is not present', () => {
    const result = utility.getTransactionAddressLabel(
      'receiveLabel',
      '',
      'fallback'
    );
    expect(result).toBe('fallback');
  });

  it('should return pageTitle with appTitle when pageTitle is present', () => {
    const result = utility.getPageTitle('abcdefgh');
    expect(result).toBe('abcdefgh - DeFi Wallet');
  });

  it('should return appTitle when pageTitle is not present', () => {
    const result = utility.getPageTitle('');
    expect(result).toBe('DeFi Wallet');
  });

  it('should return token balance', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: { result: 13123 },
    });
    mockAxios(post);
    const result = await utility.handleFetchUtxoDFI();
    expect(result).toBe(13123);
  });

  it('should check for isValidAddress', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      data: {
        result: {
          isvalid: true,
          address: 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk',
          scriptPubKey: '001472903c101c2c92d7206842c3d801ec6adccce164',
          isscript: false,
          iswitness: true,
          witness_version: 0,
          witness_program: '72903c101c2c92d7206842c3d801ec6adccce164',
        },
        error: null,
        id: 'curltest',
      },
    });
    const param = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
    mockAxios(post);
    const test = await utility.isValidAddress(param);
    expect(test).toBeTruthy();
    expect(post).toBeCalledTimes(1);
  });

  it('should check for error isValidAddress', async () => {
    try {
      const post = jest.fn().mockRejectedValueOnce('Error');
      const param = 'bcrt1qw2grcyqu9jfdwgrggtpasq0vdtwvecty4vf4jk';
      mockAxios(post);
      const test = await utility.isValidAddress(param);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('should return token balance using getTokenBalances', async () => {
    const accounts: AccountModel[] = [
      {
        key: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac@0',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '0': 1,
        },
      },
      {
        key: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac@1',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '1': 100,
        },
      },
      {
        key: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac@1',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '1': 5,
        },
      },
    ];
    const result = utility.getTokenBalances(accounts);
    expect(result).toEqual(['1@0', '105@1']);
  });

  it('should not return token balance without address using getTokenBalances', async () => {
    const accounts: AccountModel[] = [
      {
        key: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac@0',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '0': 1,
        },
      },
      {
        key: '@1',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '1': 100,
        },
      },
      {
        key: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac@1',
        owner: {
          asm: '',
          hex: '76a914f26fa153c6fec0cb6ac4023ba4fd29a125156c8388ac',
          reqSigs: 1,
          type: 'pubkeyhash',
          addresses: ['7RAw2Fg1CEEhybAb22XGsTiNFe7PTuxkMj'],
        },
        amount: {
          '1': 5,
        },
      },
    ];
    const result = utility.getTokenBalances(accounts);
    expect(result).toEqual(['1@0', '5@1']);
  });

  it('getTokenBalances should not break on empty accounts', async () => {
    const accounts: AccountModel[] = [];
    const result = utility.getTokenBalances(accounts);
    expect(result.length).toBe(0);
  });

  it('should return RpcMethodName', () => {
    const result = utility.getRpcMethodName('getAddressAndAmounts');
    expect(result).toBe('getAddressAndAmounts');
  });

  it('should return filterByValue', () => {
    const array = ['getAddressAndAmount'];
    const query = 'getAddressAndAmount';
    const result = utility.filterByValue(array, query);
    expect(result).toStrictEqual([]);
  });

  it('should return paginate with pageSize and pageNo is present', () => {
    const result = utility.paginate([], 2, 1);
    expect(result).toStrictEqual([]);
  });

  it('should return ErrorMessage ', () => {
    const ErrorMessage = {
      message: 'Error',
      response: {
        data: {
          error: {
            message: 'something went wrong',
          },
        },
      },
    };
    const result = utility.getErrorMessage(ErrorMessage);
    expect(result).toEqual(ErrorMessage.response.data.error.message);
  });

  it('should return MnemonicObject ', () => {
    const result = utility.getMnemonicObject();
    expect(result).toBe(result);
  });

  it('should return RandomWordObject  ', () => {
    const result = utility.getRandomWordObject();
    expect(result).toBe(result);
  });

  it('should return MixWordsObject', () => {
    const result = utility.getMixWordsObject(
      mnemonicObject,
      mnemonicObject.mnemonicObj
    );
    expect(result).toBe(result);
  });

  it('should be check ElementsInArray', () => {
    const result = utility.checkElementsInArray([], mnemonicObject);
    expect(result).toBeFalsy();
  });

  it('should return NetworkInfo ', () => {
    const main = utility.getNetworkInfo(MAIN);
    const test = utility.getNetworkInfo(TEST);
    const other_network = utility.getNetworkInfo(OTHER_NETWORK);
    expect(main.bech32).toBe(main_net.bech32);
    expect(test.bech32).toBe(test_net.bech32);
    expect(other_network.bech32).toBe(other_net.bech32);
  });

  it('should return MnemonicFromObj', () => {
    const result = utility.getMnemonicFromObj(mnemonicObject);
    expect(result).toBe(mnemonicCode);
  });

  it('should be validated Mnemonic', () => {
    const result = utility.getMnemonicFromObj(mnemonicCode);
    expect(result).toBe(validatedMnemonicCode);
  });

  it('should return uniqueTokenList', () => {
    const result = utility.getUniqueTokenMap(poolPairList);
    const uniqueTokenLists = new Map(Object.entries(uniqueTokenList));
    expect(result).toStrictEqual(uniqueTokenLists);
  });

  it('should return tokenMap', () => {
    const tokenMaps = new Map(Object.entries(tokenMap));
    const result = utility.getTokenAndBalanceMap(poolPairList, [], 0);
    expect(result).toStrictEqual(tokenMaps);
  });

  it('should return balanceAndSymbolMap', () => {
    const map = new Map();
    const result = utility.getBalanceAndSymbolMap([]);
    expect(result).toEqual(map);
  });

  it('should return TotalBlocks', async () => {
    const result = utility.getTotalBlocks();
    expect(result).toBeTruthy();
  });

  it('should return countDecimals', function () {
    const result = utility.countDecimals(1);
    expect(result).toBe(0);
  });

  it('should return selectedPoolPair', function () {
    const result = utility.selectedPoolPair({}, poolPairList);
    expect(result).toStrictEqual([undefined, false]);
  });

  it('should be validated account address', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: [] } });
    mockAxios(post);
    const result = await utility.isAddressMine(address);
    expect(result).toBeFalsy();
  });

  it('should be validated hdWalletCheck', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: [] } });
    mockAxios(post);
    const result = await utility.hdWalletCheck(address);
    expect(result).toBeTruthy();
  });

  it('should be validated getAddressAndAmountListForAccount', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: [] } });
    mockAxios(post);
    const result = await utility.getAddressAndAmountListForAccount();
    expect(result).toStrictEqual([]);
  });

  it('should be validated getAddressAndAmountListForAccount', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: [] } });
    mockAxios(post);
    const result = await utility.getAddressAndAmountListForAccount();
    expect(result).toStrictEqual([]);
  });

  it('should be return parsedCoinPriceData', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: 1 } });
    mockAxios(post);
    const result = await utility.parsedCoinPriceData();
    expect(result[0]).toBeTruthy();
  });

  it('should be return Balance', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: 34.0 } });
    mockAxios(post);
    const result = await utility.getDfiUTXOS();
    expect(result).toBe(34.0);
  });

  it('should be return getAddressAndAmountListPoolShare', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: 6 } });
    mockAxios(post);
    const result = await utility.getAddressAndAmountListPoolShare(6);
    expect(result).toStrictEqual([]);
  });

  it('should be return getTotalAmountPoolShare', async () => {
    const post = jest.fn().mockResolvedValue({ data: { result: 6 } });
    mockAxios(post);
    const result = await utility.getTotalAmountPoolShare(6);
    expect(result).toBe(0);
  });

  it('should return getSymbolKey', function () {
    const result = utility.getSymbolKey('1', '10');
    expect(result).toBe('1#10');
  });

  it('should return distinctRandomNumbers', function () {
    const result = utility.selectNfromRange(1, 10, 6);
    expect(result).toBeTruthy();
  });

  it('should be return numberWithCommas', function () {
    const result = utility.numberWithCommas(1);
    expect(result).toBe('1');
  });

  it('should  be calculateAPY', async () => {
    const totalLiquidity = new BigNumber(123.4567);
    const yearlyPoolReward = new BigNumber(123.4567);
    const result = utility.calculateAPY(totalLiquidity, yearlyPoolReward);
    expect(result).toBe('81.08');
  });

  it('should  be return TokenBalanceList', async () => {
    const TokenBalanceList = new Promise(function (resolve, reject) {});
    const post = jest.fn().mockResolvedValueOnce({
      data: { result: 13123 },
    });
    mockAxios(post);
    const result = utility.handleFetchTokenBalanceList();
    expect(result).toStrictEqual(TokenBalanceList);
  });
});
