import * as utility from '../utility';
import { rpcResponseSchemaMap } from '../schemas/rpcMethodSchemaMapping';
import * as methodNames from '../../constants/rpcMethods';
import {
  validateSchema,
  getTxnDetails,
  expected,
  listUnspentTwo,
} from './testData.json';
import log from 'loglevel';
import { mockAxios } from '../testUtils/mockUtils';

const DUST_VALUE_DFI = '0.00000546';
const DUST_VALUE_FI = '546';

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
      amount: Math.random() * 100,
    }));
    const data = await utility.getAddressAndAmount(testData);
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
    delete data.result[0].time;
    const isValid = utility.validateSchema(
      rpcResponseSchemaMap.get(methodNames.LIST_TRANSACTIONS),
      data
    );
    expect(isValid).toBeFalsy();
    expect(spy).toBeCalledTimes(1);
  });
});
