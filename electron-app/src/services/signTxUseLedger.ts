import {
  Transaction,
  Script,
  crypto,
  util, PublicKey,
} from 'bitcore-lib-dfi';
import DefiHwWallet from '../defiHwWallet/defiHwWallet';
import * as log from '../services/electronLogger';

interface SigsInput {
  signature: Transaction.Signature;
  keyIndex: number;
  address: string;
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
    const hashBuf = Transaction.Sighash.sighash(
      tx,
      sighashType,
      inputIndex,
      subscript
    );
    const signature = await DefiLedger.sign(keyIndex, util.buffer.reverse(hashBuf));
    return {
      signature,
      hashBuf,
      keyIndex,
    };
  } catch (e) {
    throw new Error(e);
  }
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
      tx.inputs[index].output.script,
      keyIndex,
      DefiLedger
    );
    const { pubkey, address } = await DefiLedger.getDefiPublicKey(keyIndex);
    log.info(`Pubkey: ${pubkey}`)
    const txSig = new Transaction.Signature({
      prevTxId: tx.inputs[index].prevTxId,
      outputIndex: tx.inputs[index].outputIndex,
      inputIndex: index,
      signature: crypto.Signature.fromBuffer(signedTx.signature),
      sigtype: crypto.Signature.SIGHASH_ALL,
      publicKey: new PublicKey(pubkey),
    });
    return [
      {
        signature: txSig,
        keyIndex: signedTx.keyIndex,
        address,
      },
    ];
  } catch (e) {
    throw new Error(e);
  }
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

export async function signInputs(
  tx: Transaction,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  const signatures = await getSignatures(tx, keyIndex, DefiLedger);
  signatures.forEach((sigsInput) => {
    const { inputIndex } = sigsInput.signature;
    if (tx.inputs[inputIndex].output.script.isScriptHashOut()) {
      // @ts-ignore
      tx.inputs[inputIndex] = new Transaction.Input.MultiSigScriptHash(
        tx.inputs[inputIndex],
        [sigsInput.signature.publicKey],
        1,
        [sigsInput.signature],
        true
      )._updateScript()
    } else if (tx.inputs[inputIndex].output.script.isPublicKeyHashOut()) {
      const script = Script.buildPublicKeyHashIn(
        sigsInput.signature.publicKey,
        sigsInput.signature.signature.toDER(),
        crypto.Signature.SIGHASH_ALL,
      );
      tx.inputs[inputIndex].setScript(script);
    } else {
      throw new Error('Not supported input format')
    }
  });
  return tx;
}