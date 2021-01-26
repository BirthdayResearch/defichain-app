import BigNumber from 'bignumber.js';
import * as log from './electronLogger';

import RpcClient from './rpc-client';

const BN = BigNumber.clone({ DECIMAL_PLACES: 8 });

export const construct = async ({
  maximumAmount,
  maximumCount,
  feeRate,
}: {
  maximumAmount: BigNumber;
  maximumCount: BigNumber;
  feeRate: BigNumber;
}) => {
  const rpcClient = new RpcClient();

  const unspent = await rpcClient.listUnspent(maximumAmount, maximumCount);
  const inputsTotal = unspent.length;

  if (unspent.length === 0) {
    throw new Error('No suitable UTXO found');
  }

  const address = await rpcClient.getNewAddress('');

  let amount;
  let fee;
  let hex;
  let vsize;
  let start = 0;
  let end = unspent.length;
  let sliceTo = end;
  let success = false;

  while (!success) {
    let res;
    const unspentSlice = unspent.slice(0, sliceTo);
    const inputs = unspentSlice.map((u) => ({
      txid: u.txid,
      vout: u.vout,
    }));
    amount = unspentSlice
      .reduce((prev, { amount }) => prev.plus(amount), new BN(0))
      .toNumber();
    const outputs = [{ [address]: amount }];

    try {
      const fR = new BN(feeRate).times(1024).div(1e8).toNumber();
      res = await rpcClient.walletCreateFundedPsbt(inputs, outputs, fR);
    } catch (e) {
      if (
        e.message === 'Transaction too large' ||
        e.response.data.error.message === 'Transaction too large'
      ) {
        end = sliceTo;
        sliceTo = start + Math.floor((end - start) / 2);
        continue;
      }
      log.error(e);
      throw e;
    }
    fee = res.fee;

    // signing psbt
    res = await rpcClient.walletProcessPsbt(res.psbt);
    if (!res.complete) {
      throw new Error('Error during walletprocesspsbt');
    }

    // converting psbt to hex
    res = await rpcClient.finalizePsbt(res.psbt);
    if (!res.complete) {
      throw new Error('Error during finalizePsbt');
    }
    hex = res.hex;

    // checking tx vsize show be below 100000
    res = await rpcClient.decodeRawTransaction(hex);
    vsize = res.vsize;

    if (sliceTo === end || end - start <= 1) {
      success = true;
    } else {
      start = sliceTo;
      sliceTo = start + Math.floor((end - start) / 2);
    }
  }

  const amountOutput = new BN(amount).minus(fee).toNumber();

  return {
    address,
    amountInput: amount,
    amountOutput,
    fee,
    hex,
    inputsUsed: sliceTo,
    inputsTotal,
  };
};
