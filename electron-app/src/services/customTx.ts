import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  crypto,
  util,
} from 'bitcore-lib-dfi';
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

async function signInputs(
  tx: Transaction,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  const signatures = await getSignatures(tx, keyIndex, DefiLedger);
  signatures.forEach((sigsInput) => {
    tx.inputs[sigsInput.signature.inputIndex].setScript(
      Script.buildPublicKeyHashIn(
        sigsInput.signature.publicKey,
        sigsInput.signature.signature.toDER(),
        sigsInput.signature.sigtype
      )
    );
  });
  return tx;
}

async function getSignatures(
  tx: Transaction,
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  const results: SigsInput[] = [];
  for (const [index] of tx.inputs.entries()) {
    const sigsInputs = await getSigsInputs(tx, index, keyIndex, DefiLedger);
    results.push(...sigsInputs);
  }
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
      // TODO change is bugs
      // @ts-ignore
      tx.inputs[index]._scriptBuffer,
      keyIndex,
      DefiLedger
    );
    const txSig = new Transaction.Signature({
      prevTxId: tx.inputs[index].prevTxId,
      outputIndex: tx.inputs[index].outputIndex,
      inputIndex: index,
      signature: signedTx.signature,
      sigtype: crypto.Signature.SIGHASH_ALL,
      publicKey:
        '0414fae33369bc05ded35edcfebf3c69e63df4d3ee3335b52d4e2800a672397843a827b01967dbfd6c0469e32a1babb5dfed081cd8d2d6ab14d23cfb9d7b5cd4b3', // TODO change is ledger done
    });
    return [
      {
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
    hashBuf = util.buffer.reverse(hashBuf);
    const signature: Buffer = await DefiLedger.sign(keyIndex, hashBuf);
    const transformationSign = await DefiLedger.transformationSign(signature);
    return {
      signature: transformationSign,
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
  keyIndex: number,
  DefiLedger: DefiHwWallet
) {
  let tx = new Transaction().from(utxo).to(address, amount).fee(0);
  tx = createZeroOutputTxFromCustomTx(tx, data);
  tx = await signInputs(tx, keyIndex, DefiLedger);
  return tx;
}
