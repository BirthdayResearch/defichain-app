import { BigNumber } from 'bignumber.js';
import { IVout, IRawTxn } from './interfaces';

const getVoutForTransaction = (vouts: IVout[]) => {
  const vout: IVout[] = vouts.map(vout => {
    const { value, n, scriptPubKey } = vout;
    return { value, n, scriptPubKey };
  });

  const valueOut: BigNumber = vouts.reduce((valueOut: BigNumber, vout) => {
    return valueOut.plus(vout.value);
  }, new BigNumber(0));

  return { vout, valueOut };
};

export const getFullRawTxInfo = (rawTx: IRawTxn) => {
  const { vout, valueOut } = getVoutForTransaction(rawTx.vout);
  const { hash, blocktime, blockhash } = rawTx;

  const fullRawTransaction = {
    vout,
    valueOut,
    hash,
    blocktime,
    blockhash,
  };
  return fullRawTransaction;
};
