import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  Address,
} from 'bitcore-lib-dfi';
import * as log from '../services/electronLogger';

type CustomTransaction = {
  txType: string;
  customData: any;
  tokenId: number;
};
const ONE_DFI_SATOSHIS = 100000000;

export function createZeroOutputTxFromCustomTx(
  tx: Transaction,
  customTx: CustomTransaction,
  address: string,
) {
  let transaction;
  let outputZero;
  let outputOne;
  let keys = [];
  const addressOb = new Address(address);
  const scriptAddress = addressOb.type === 'scripthash'
    ? Script.buildScriptHashOut(addressOb)
    : Script.buildPublicKeyHashOut(addressOb);
  const script = new Script().add(Opcode.map.OP_RETURN);
  switch (customTx.txType) {
    case CustomTx.customTxType.createMasternode:
      script.add(new CustomTx.CreateMasternode(customTx.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 1000000*ONE_DFI_SATOSHIS,
      });
      transaction =  tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        script: scriptAddress,
        tokenId: 0,
        satoshis: ONE_DFI_SATOSHIS,
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
        satoshis: 100*ONE_DFI_SATOSHIS,
      });
      transaction =  tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        script: scriptAddress,
        tokenId: 0,
        satoshis: ONE_DFI_SATOSHIS,
      });
      transaction = transaction.addOutput(outputOne);
      break;
    case CustomTx.customTxType.mintToken:
      script.add(new CustomTx.MintToken(customTx.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 100*ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
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
      outputZero =  new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction =  tx.addOutput(outputZero);
      transaction = tx.to(address, customTx.customData.amountFrom * ONE_DFI_SATOSHIS);
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
        tokenId: customTx.customData.to[keys[0]][0].token,
        satoshis: customTx.customData.to[keys[0]][0].balance * ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.accountToUtxos:
      script.add(new CustomTx.AccountToUtxos(customTx.customData));
      break;
    case CustomTx.customTxType.accountToAccount:
      script.add(new CustomTx.AccountToAccount(customTx.customData));
       keys = Object.keys(customTx.customData.to);
      outputZero =  new Transaction.Output({
        script,
        tokenId: customTx.customData.to[keys[0]]['0'].token,
        satoshis: customTx.customData.to[keys[0]]['0'].balance * ONE_DFI_SATOSHIS,
      });
      transaction = new Transaction(tx).addOutput(outputZero);
      break;
    case CustomTx.customTxType.setGovVariable:
      script.add(new CustomTx.SetGovVariable(customTx.customData));
      outputZero =  new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction =  new Transaction(tx).addOutput(outputZero);
      break;
    default:
      break;
  }
  return transaction.change(address);
}

export function createTx(
  utxo: any,
  address: any,
  data: any,
): Transaction {
  log.info('Custom TX')
  let tx = new Transaction().from(utxo);
  log.info(`tx: ${tx}`)
  tx = createZeroOutputTxFromCustomTx(tx, data, address);
  return tx;
}
