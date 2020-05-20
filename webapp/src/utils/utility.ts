import Ajv from 'ajv';
import log from 'loglevel';
import moment from 'moment';
import { DATE_FORMAT } from '../constants';
import { IAddressAndAmount, ITxn } from './interfaces';

export const validateSchema = (schema, data) => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    log.error(validate.errors);
  }
  return valid;
};

export const getAddressAndAmount = async addresses => {
  const addressAndAmount: IAddressAndAmount[] = [];
  for (const addressObj of addresses) {
    addressAndAmount.push({
      address: addressObj.address,
      amount: addressObj.amount,
    });
  }
  return addressAndAmount;
};

export const getTransactionURI = (
  unit: string,
  address: string,
  extraData: any
) => {
  Object.keys(extraData).forEach(
    key =>
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

export const getFromPersistentStorage = path => {
  return localStorage.getItem(path);
};

export const setToPersistentStorage = (path, data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  localStorage.setItem(path, data);
  return data;
};

export const getTxnDetails = async txns => {
  const txnList: ITxn[] = [];
  for (const txn of txns) {
    const fee = txn.category === 'send' ? txn.fee : 0;
    const blockHash = txn.category === 'orphan' ? '' : txn.blockhash;
    txnList.push({
      address: txn.address,
      category: txn.category,
      amount: txn.amount,
      fee,
      confirmations: txn.confirmations,
      blockHash,
      txnId: txn.txid,
      time: convertEpochToDate(txn.time),
      timeReceived: convertEpochToDate(txn.timereceived),
      unit: 'DFI',
    });
  }
  return txnList;
};

export const convertEpochToDate = epoch => {
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
