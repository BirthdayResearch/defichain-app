import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  crypto,
  util,
  SignatureData,
} from 'bitcore-lib-dfi';
import _ from 'lodash';

type CustomTransaction = {
  txType: string;
  customData: any;
  tokenId: string;
};

interface SigsInput {
  signature: Transaction.Signature;
  keyIndex: any;
  hashBuf: Buffer;
}

function createZeroOutputTxFromCustomTx(
  tx: Transaction,
  customTx: CustomTransaction
) {
  const script = new Script();
  script.add(Opcode.map.OP_RETURN);
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
  tx.addOutput(output);
  return tx;
}

function signInputs(tx: Transaction, keyIndex) {
  _.each(getSignatures(tx, keyIndex), (sigsInput) => {
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

function getSignatures(tx: Transaction, keyIndex) {
  const results: SigsInput[] = [];
  _.each(tx.inputs, (input: Transaction.Input, index: number) => {
    _.each(getSigsInputs(tx, index, keyIndex), (signature) => {
      results.push(signature);
    });
  });
  return results;
}

function getSigsInputs(tx: Transaction, index: number, keyIndex): SigsInput {
  const signedTx = signTransaction(
    tx,
    crypto.Signature.SIGHASH_ALL,
    index,
    tx.inputs[index].output.script,
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

function signTransaction(
  tx: Transaction,
  sighashType: number,
  inputIndex: number,
  subscript: Script,
  keyIndex
) {
  let hashBuf = Transaction.Sighash.sighash(
    tx,
    sighashType,
    inputIndex,
    subscript
  );
  hashBuf = util.buffer.reverse(hashBuf);
  // TODO Change function on sign ledger
  // const signature: Buffer = lenderSign(hashBuf, keyIndex);
  return {
    signature: new Buffer(''),
    hashBuf,
    keyIndex,
  };
}

export function createTx(utxo, address, amount, data, keyIndex) {
  let tx = new Transaction().from(utxo).to(address, amount).fee(0);
  tx = createZeroOutputTxFromCustomTx(tx, data);
  tx = signInputs(tx, keyIndex);
  return tx;
}
