// @ts-nocheck
import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  crypto,
  util, Address,
} from 'bitcore-lib-dfi';
import DefiHwWallet from '../defiHwWallet/defiHwWallet';
import * as log from '../services/electronLogger';

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
  customTx: CustomTransaction,
  address: string,
  feeRate: number,
) {
  let transaction;
  let outputZero;
  let outputOne;
  let keys = [];
  const script = new Script().add(Opcode.map.OP_RETURN);
  switch (customTx.txType) {
    case CustomTx.customTxType.createMasternode:
      script.add(new CustomTx.CreateMasternode(customTx.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 1000000*100000000,
      });
      transaction =  tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        // @ts-ignore
        script: Script.buildScriptHashOut(new Address(address)),
        tokenId: 0,
        satoshis: 100000000,
      });
      break;
    case CustomTx.customTxType.resignMasternode:
      script.add(new CustomTx.ResignMasternode(customTx.customData));
      break;
    case CustomTx.customTxType.createToken:
      script.add(new CustomTx.CreateToken(customTx.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 100*100000000,
      });
      transaction =  tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        script: new Script(new Address(address)),
        tokenId: 0,
        satoshis: 100000000,
      });
      transaction = transaction.addOutput(outputOne);
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
      keys = Object.keys(customTx.customData.to);
      outputZero =  new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: customTx.customData.to[keys[0]]['0'].balance  * 100000000,
      });
      transaction =  new Transaction(tx).addOutput(outputZero);
      break;
    case CustomTx.customTxType.accountToUtxos:
      script.add(new CustomTx.AccountToUtxos(customTx.customData));
      break;
    case CustomTx.customTxType.accountToAccount:
      script.add(new CustomTx.AccountToAccount(customTx.customData));
       keys = Object.keys(customTx.customData.to);
      outputZero =  new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: customTx.customData.to[keys[0]]['0'].balance * 100000000,
      });
      transaction = new Transaction(tx).addOutput(outputZero);
      break;
    case CustomTx.customTxType.setGovVariable:
      script.add(new CustomTx.SetGovVariable(customTx.customData));
      break;
    default:
      break;
  }
  // outputOne = new Transaction.Output({
  //   script: new Script(new Address(address)),
  //   tokenId: 0,
  //   satoshis: (feeRate*100000000).toFixed(8),
  // });
  return transaction.addOutput(outputOne);
}

export async function signInputs(
  tx: Transaction,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  const signatures = await getSignatures(tx, keyIndex, DefiLedger);
  signatures.forEach((sigsInput) => {
    // const script = new Script();
    // script.add(sigsInput.signature.signature.toDER());
    // script.add(tx.inputs[sigsInput.signature.inputIndex].output.script.chunks[1].buf);
    // tx.inputs[sigsInput.signature.inputIndex].setScript(script);
    tx.inputs[sigsInput.signature.inputIndex].setScript(Script.buildPublicKeyHashIn(
      sigsInput.signature.publicKey,
      sigsInput.signature.signature.toDER(),
      sigsInput.signature.sigtype,
    ));
    // const interpreter = new Script.Interpreter();
    // const check = interpreter.verify(scriptSig, scriptPubkey, tx, sigsInput.signature.inputIndex, flags, witnesses, tx.inputs[sigsInput.signature.inputIndex].output.satoshis);
    // log.info(`check: ${check}`);
    // if (!check) {
    //   throw new Error('Signature not verify transaction');
    // }
  });
  return tx;
}

async function getSignatures(
  tx: Transaction,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  const results: SigsInput[] = [];
  for (let index=0; index < tx.inputs.length; index++) {
    const res = await getSigsInputs(tx, index, keyIndex, DefiLedger);
    results.push(...res);
  }
  log.info(`getSignatures: ${JSON.stringify(results)}`);
  return results;
}

async function getSigsInputs(
  tx: Transaction,
  index: number,
  keyIndex: number,
  DefiLedger: DefiHwWallet
): Promise<SigsInput[]> {
  try {
    const signedTx = await signTransaction(
      tx,
      crypto.Signature.SIGHASH_ALL,
      index,
      // @ts-ignore
      tx.inputs[index].output.script,
      keyIndex,
      DefiLedger
    );
    const { pubkey } = await DefiLedger.getDefiPublicKey(keyIndex);
    log.info(`pubkey: ${pubkey}`);
    const txSig = new Transaction.Signature({
      prevTxId: tx.inputs[index].prevTxId,
      outputIndex: tx.inputs[index].outputIndex,
      inputIndex: index,
      signature: crypto.Signature.fromBuffer(signedTx.signature),
      sigtype: crypto.Signature.SIGHASH_ALL,
      publicKey: pubkey,
    });
    // @ts-ignore
    log.info(`getSigsInputs txSig: ${txSig.signature.toBuffer()}`);
    log.info(`gpubkey: ${new Buffer(pubkey)}`);
    return [
      {
        // @ts-ignore
        signature: txSig,
        keyIndex: signedTx.keyIndex,
        hashBuf: signedTx.hashBuf,
      },
    ];
  } catch (e) {
    throw new Error(e);
  }
}

async function signTransaction(
  tx: Transaction,
  sighashType: number,
  inputIndex: number,
  subscript: Script,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  try {
    let hashBuf = Transaction.Sighash.sighash(
      tx,
      sighashType,
      inputIndex,
      subscript
    );
    log.info(`hashBuf1: ${JSON.stringify(hashBuf.toString('hex'))}`);
    hashBuf = util.buffer.reverse(hashBuf);
    log.info(`hashBuf: ${JSON.stringify(hashBuf.toString('hex'))}`);
    const signature: Buffer = await DefiLedger.sign(keyIndex, hashBuf, sighashType);
    // const transformationSign = await DefiLedger.transformationSign(signature);
    log.info(`transformationSign: ${signature}`);
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
  data: any,
  keyIndex: number,
  feeRate: number,
  DefiLedger: DefiHwWallet
) {
  log.info('Custom TX')
  let tx = new Transaction().from(utxo);
  log.info(`tx: ${tx}`)
  tx = createZeroOutputTxFromCustomTx(tx, data, address, feeRate);
  log.info(`tx: ${tx.toString()}`)
  tx = await signInputs(tx, keyIndex, DefiLedger);
  return tx;
}
