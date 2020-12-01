import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  crypto,
  util,
} from 'bitcore-lib-dfi';
import * as _ from 'lodash';
import DefiHwWallet from '../defiHwWallet/defiHwWallet';

type CustomTransaction = {
  txType: string;
  customData: any;
  tokenId: number;
};

interface SigsInput {
  signature: Transaction.Signature;
  keyIndex: number;
  hashBuf: Buffer;
}

export function createZeroOutputTxFromCustomTx(
  tx: Transaction,
  customTx: CustomTransaction
) {
  const script = new Script().add(Opcode.map.OP_RETURN);
  switch (customTx.txType) {
    case CustomTx.customTxType.createMasternode:
      script.add(new CustomTx.CreateMasternode(customTx.customData));
      break;
    case CustomTx.customTxType.resignMasternode:
      script.add(new CustomTx.ResignMasternode(customTx.customData));
      break;
    case CustomTx.customTxType.createToken:
      script.add(new CustomTx.CreateToken(customTx.customData));
      break;
    case CustomTx.customTxType.mintToken:
      script.add(new CustomTx.MintToken(customTx.customData));
      break;
    case CustomTx.customTxType.updateToken:
      script.add(new CustomTx.UpdateToken(customTx.customData));
      break;
    case CustomTx.customTxType.updateTokenAny:
      script.add(new CustomTx.UpdateTokenAny(customTx.customData));
      break;
    case CustomTx.customTxType.createPoolPair:
      script.add(new CustomTx.CreatePoolPair(customTx.customData));
      break;
    case CustomTx.customTxType.updatePoolPair:
      script.add(new CustomTx.UpdatePoolPair(customTx.customData));
      break;
    case CustomTx.customTxType.poolSwap:
      script.add(new CustomTx.PoolSwap(customTx.customData));
      break;
    case CustomTx.customTxType.addPoolLiquidity:
      script.add(new CustomTx.AddPoolLiquidity(customTx.customData));
      break;
    case CustomTx.customTxType.removePoolLiquidity:
      script.add(new CustomTx.RemovePoolLiquidity(customTx.customData));
      break;
    case CustomTx.customTxType.utxosToAccount:
      script.add(new CustomTx.UtxosToAccount(customTx.customData));
      break;
    case CustomTx.customTxType.accountToUtxos:
      script.add(new CustomTx.AccountToUtxos(customTx.customData));
      break;
    case CustomTx.customTxType.accountToAccount:
      script.add(new CustomTx.AccountToAccount(customTx.customData));
      break;
    case CustomTx.customTxType.setGovVariable:
      script.add(new CustomTx.SetGovVariable(customTx.customData));
      break;
    default:
      break;
  }
  const output = new Transaction.Output({
    script,
    tokenId: customTx.tokenId,
    satoshis: 0,
  });
  return new Transaction(tx).addOutput(output);
}

async function signInputs(tx: Transaction, keyIndex: number) {
  _.each(await getSignatures(tx, keyIndex), (sigsInput: any) => {
    tx.inputs[sigsInput.signature.inputIndex].setScript(
      Script.buildPublicKeyHashIn(
        sigsInput.signature.publicKey,
        sigsInput.signature.toDER(),
        sigsInput.signature.sigtype
      )
    );
  });
  return tx;
}

async function getSignatures(tx: Transaction, keyIndex: number) {
  const results: SigsInput[] = [];
  _.each(tx.inputs, async (input: Transaction.Input, index: number) => {
    _.each(await getSigsInputs(tx, index, keyIndex), (signature: any) => {
      results.push(signature);
    });
  });
  return results;
}

async function getSigsInputs(
  tx: Transaction,
  index: number,
  keyIndex: number
): Promise<SigsInput> {
  const signedTx = await signTransaction(
    tx,
    crypto.Signature.SIGHASH_ALL,
    index,
    // TODO change is bugs
    tx.inputs[index]._scriptBuffer,
    keyIndex
  );
  const txSig = new Transaction.Signature({
    prevTxId: tx.inputs[index].prevTxId,
    outputIndex: tx.inputs[index].outputIndex,
    inputIndex: index,
    signature: signedTx.signature,
    sigtype: crypto.Signature.SIGHASH_ALL,
    publicKey: '', // TODO change is ledger done
  });
  return {
    signature: txSig,
    keyIndex: signedTx.keyIndex,
    hashBuf: signedTx.hashBuf,
  };
}

async function signTransaction(
  tx: Transaction,
  sighashType: number,
  inputIndex: number,
  subscript: Script,
  keyIndex: number
) {
  try {
    let hashBuf = Transaction.Sighash.sighash(
      tx,
      sighashType,
      inputIndex,
      subscript
    );
    hashBuf = util.buffer.reverse(hashBuf);
    const wallet = new DefiHwWallet();
    await wallet.connect();
    let signature: Buffer = await wallet.sign(keyIndex, hashBuf);
    signature = await wallet.transformationSign(signature);
    return {
      signature,
      hashBuf,
      keyIndex,
    };
  } catch (e) {
    throw new Error(e);
  }
}

export async function createTx(
  utxo: any,
  address: any,
  amount: any,
  data: any,
  keyIndex: number
) {
  let tx = new Transaction().from(utxo).to(address, amount).fee(0);
  tx = createZeroOutputTxFromCustomTx(tx, data);
  tx = await signInputs(tx, keyIndex);
  return tx;
}
