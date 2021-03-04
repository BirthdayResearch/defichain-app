import {
  Transaction,
  Script,
  Opcode,
  CustomTx,
  Address,
} from 'bitcore-lib-dfi';
import * as log from '../services/electronLogger';
import { IDataCustomTx } from '@defi_types/ledger';

export const ONE_DFI_SATOSHIS = 100000000;

export function createZeroOutputTxFromCustomTx(
  tx: Transaction,
  data: IDataCustomTx
) {
  let transaction;
  let outputZero;
  let outputOne;
  let keys = [];
  const addressOb = new Address(data.address);
  const scriptAddress =
    addressOb.type === 'scripthash'
      ? Script.buildScriptHashOut(addressOb)
      : Script.buildPublicKeyHashOut(addressOb);
  const script = new Script().add(Opcode.map.OP_RETURN);
  switch (data.txType) {
    case CustomTx.customTxType.createMasternode:
      script.add(new CustomTx.CreateMasternode(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 1000000 * ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        script: scriptAddress,
        tokenId: 0,
        satoshis: ONE_DFI_SATOSHIS,
      });
      break;
    case CustomTx.customTxType.resignMasternode:
      script.add(new CustomTx.ResignMasternode(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.createToken:
      script.add(new CustomTx.CreateToken(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 100 * ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
      outputOne = new Transaction.Output({
        script: scriptAddress,
        tokenId: 0,
        satoshis: ONE_DFI_SATOSHIS,
      });
      transaction = transaction.addOutput(outputOne);
      break;
    case CustomTx.customTxType.mintToken:
      script.add(new CustomTx.MintToken(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 100 * ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.updateToken:
      script.add(new CustomTx.UpdateToken(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.updateTokenAny:
      script.add(new CustomTx.UpdateTokenAny(data.customData));
      break;
    case CustomTx.customTxType.createPoolPair:
      script.add(new CustomTx.CreatePoolPair(data.customData));
      break;
    case CustomTx.customTxType.updatePoolPair:
      script.add(new CustomTx.UpdatePoolPair(data.customData));
      break;
    case CustomTx.customTxType.poolSwap:
      script.add(new CustomTx.PoolSwap(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      transaction = tx.to(
        data.address,
        (data.customData as CustomTx.PoolSwapData).amountFrom * ONE_DFI_SATOSHIS
      );
      break;
    case CustomTx.customTxType.addPoolLiquidity:
      script.add(new CustomTx.AddPoolLiquidity(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.removePoolLiquidity:
      script.add(new CustomTx.RemovePoolLiquidity(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.utxosToAccount:
      script.add(new CustomTx.UtxosToAccount(data.customData));
      keys = Object.keys((data.customData as CustomTx.UtxosToAccountData).to);
      outputZero = new Transaction.Output({
        script,
        tokenId: (data.customData as CustomTx.UtxosToAccountData).to[keys[0]][0]
          .token,
        satoshis:
          (data.customData as CustomTx.UtxosToAccountData).to[keys[0]][0]
            .balance * ONE_DFI_SATOSHIS,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.accountToUtxos:
      script.add(new CustomTx.AccountToUtxos(data.customData));
      break;
    case CustomTx.customTxType.accountToAccount:
      script.add(new CustomTx.AccountToAccount(data.customData));
      keys = Object.keys((data.customData as CustomTx.AccountToAccountData).to);
      outputZero = new Transaction.Output({
        script,
        tokenId: (data.customData as CustomTx.AccountToAccountData).to[keys[0]][
          '0'
        ].token,
        satoshis: (
          (data.customData as CustomTx.AccountToAccountData).to[keys[0]]['0']
            .balance * ONE_DFI_SATOSHIS
        ).toFixed(),
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.setGovVariable:
      script.add(new CustomTx.SetGovVariable(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    case CustomTx.customTxType.anyAccountsToAccounts:
      script.add(new CustomTx.AnyAccountsToAccounts(data.customData));
      outputZero = new Transaction.Output({
        script,
        tokenId: 0,
        satoshis: 0,
      });
      transaction = tx.addOutput(outputZero);
      break;
    default:
      break;
  }
  return transaction.change(data.address);
}

export function createTx(utxo: any, data: IDataCustomTx): Transaction {
  log.info('Custom TX');
  let tx = new Transaction().from(utxo);
  log.info(`tx: ${tx}`);
  tx = createZeroOutputTxFromCustomTx(tx, data);
  return tx;
}
