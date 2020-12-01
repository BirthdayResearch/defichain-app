import {
  transaction,
  createTokenData,
  mintTokenData,
  utxo,
} from './testData.json';
import { createZeroOutputTxFromCustomTx, createTx } from '../customTx';

describe('Custom tx', () => {
  it('should return object of transaction at type createToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      transaction as any,
      createTokenData
    );
    expect(tx.toObject()).toEqual({
      hash: '5653b49511a3917407a7125740459e029b4f2489e4b0ae75e13f177fa268f52c',
      inputs: [
        {
          output: {
            satoshis: 0,
            script: '76a91488d9931ea73d60eaf7e5671efc0552b912911f2a88ac',
          },
          outputIndex: 0,
          prevTxId:
            '983afbde01a436823054aae561f973e4261ce1e331482eb85c462981e99138a3',
          script: '',
          scriptString: '',
          sequenceNumber: 4294967295,
        },
      ],
      nLockTime: 0,
      outputs: [
        {
          satoshis: 0,
          script: 'a9145630ddb88cfdd2ef4b780dfd538ad67292601d6687',
        },
        {
          satoshis: 0,
          script: '6a1944665478540841686d6564546f6b0008000000000000000003',
        },
      ],
      version: 4,
    });
  });

  it('should return object of transaction at type MintToken', () => {
    const tx = createZeroOutputTxFromCustomTx(
      transaction as any,
      mintTokenData
    );
    expect(tx.toObject()).toEqual({
      hash: '5f5dbd447101d88801dbd459d29e897d7e2bcd0aa3f39332dca344062a4ef04d',
      inputs: [
        {
          output: {
            satoshis: 0,
            script: '76a91488d9931ea73d60eaf7e5671efc0552b912911f2a88ac',
          },
          outputIndex: 0,
          prevTxId:
            '983afbde01a436823054aae561f973e4261ce1e331482eb85c462981e99138a3',
          script: '',
          scriptString: '',
          sequenceNumber: 4294967295,
        },
      ],
      nLockTime: 0,
      outputs: [
        {
          satoshis: 0,
          script: 'a9145630ddb88cfdd2ef4b780dfd538ad67292601d6687',
        },
        {
          satoshis: 0,
          script: '6a12446654784d01820000000000000000000000',
        },
      ],
      version: 4,
    });
  });

  it('should createCustomTx', async () => {
    const tx = await createTx(
      utxo,
      'tttw7ZHJumuaLG8wSwQLDJ6B6jj2uqFnmR',
      0,
      createTokenData,
      0
    );
    expect(tx.toObject()).toEqual({
      hash: 'fb04d5844c85ab6407de91f74902557fe9306b57b1e4e927c641df2fba5a5928',
      inputs: [
        {
          outputIndex: 0,
          prevTxId:
            '983afbde01a436823054aae561f973e4261ce1e331482eb85c462981e99138a3',
          script: '',
          scriptString: '',
          sequenceNumber: 4294967295,
        },
      ],
      nLockTime: 0,
      outputs: [
        {
          satoshis: 0,
          script: 'a914f844de65447a18e05384425a68b56813c20d99cf87',
        },
        {
          satoshis: 0,
          script: '6a1944665478540841686d6564546f6b0008000000000000000003',
        },
      ],
      version: 4,
    });
  });
});
