// @ts-nocheck
import { Transaction } from 'bitcore-lib-dfi';
import {
  transaction,
  createTokenData,
  mintTokenData,
  utxo,
  setGovVariableData,
  transactionResultCreateToken,
  transactionResultMintToken,
  resultCreateCustomTxOfCreateToken,
  resultGovVariable
} from './testData.json';
import { createZeroOutputTxFromCustomTx, createTx } from '../customTx';
import DefiHwWallet from '../../defiHwWallet/defiHwWallet';

describe('Custom tx', () => {
  const DefiLedger = new DefiHwWallet();
  const address = 'trC2HdSkUovgTt6NyaktHiSPaHa3hVEmzY';
  const feeRate = 0.01;
  it('should return object of transaction at type createToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      new Transaction(transaction),
      createTokenData,
      address,
      feeRate,
    );
    expect(tx.toObject()).toEqual(transactionResultCreateToken);
  });

  it('should return object of transaction at type MintToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      new Transaction(transaction),
      mintTokenData,
      address,
      feeRate,
    );
    expect(tx.toObject()).toEqual(transactionResultMintToken);
  });

  it('should return createCustomTx of type createToken', async () => {
    const tx = await createTx(
      utxo,
      'tttw7ZHJumuaLG8wSwQLDJ6B6jj2uqFnmR',
      createTokenData,
      0,
      feeRate,
    );
    expect(tx.toObject()).toEqual(resultCreateCustomTxOfCreateToken);
  });

  it('should return createCustomTx of type GovVariable', async () => {
    const tx = await createTx(
      utxo,
      'tttw7ZHJumuaLG8wSwQLDJ6B6jj2uqFnmR',
      setGovVariableData,
      0,
      feeRate,
    );
    expect(tx.toObject()).toEqual(resultGovVariable);
  });
});
