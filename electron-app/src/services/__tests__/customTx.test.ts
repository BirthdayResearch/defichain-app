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
  it('should return object of transaction at type createToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      new Transaction(transaction),
      createTokenData,
    );
    expect(tx.toObject()).toEqual(transactionResultCreateToken);
  });

  it('should return object of transaction at type MintToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      new Transaction(transaction),
      mintTokenData,
    );
    expect(tx.toObject()).toEqual(transactionResultMintToken);
  });

  it('should return createCustomTx of type createToken', async () => {
    const tx = await createTx(
      utxo,
      createTokenData,
    );
    expect(tx.toObject()).toEqual(resultCreateCustomTxOfCreateToken);
  });

  it('should return createCustomTx of type GovVariable', async () => {
    const tx = await createTx(
      utxo,
      setGovVariableData,
    );
    expect(tx.toObject()).toEqual(resultGovVariable);
  });
});
