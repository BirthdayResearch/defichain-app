import { ipcMain } from 'electron';
import {
  Transaction,
  Script,
  Address,
} from 'bitcore-lib-dfi';
import {
  GET_LEDGER_DEFI_PUB_KEY,
  CONNECT_LEDGER,
  LIST_DEVICES_LEDGER,
  CUSTOM_TX_LEDGER,
  BACKUP_IDXS_LEDGER, SIGN_TRANSACTION_LEDGER,
} from '../constants';
import { responseMessage } from '../utils';
import DefiHwWallet, { AddressFormat } from '../defiHwWallet/defiHwWallet';
import * as log from '../services/electronLogger';
import { createTx, signInputs } from '../services/customTx';

const DefiLedger = new DefiHwWallet();

const initiateLedger = () => {
  ipcMain.on(
    GET_LEDGER_DEFI_PUB_KEY,
    async (
      event: Electron.IpcMainEvent,
      keyIndex: number,
      format: AddressFormat
    ) => {
      try {
        log.info(`keyIndex: ${keyIndex}, format: ${format}`);
        const { pubkey, address } = await DefiLedger.getDefiPublicKey(
          keyIndex,
          format
        );
        log.info(`pubkey: ${pubkey}, address: ${address}`);
        event.returnValue = responseMessage(true, {
          pubkey,
          address,
        });
      } catch (err) {
        event.returnValue = responseMessage(false, {
          message: err.message,
        });
      }
    }
  );

  ipcMain.on(CONNECT_LEDGER, async (event: Electron.IpcMainEvent) => {
    try {
      log.info('Ledger connecting');
      await DefiLedger.connect();
      DefiLedger.onDetach(event.sender);
      event.returnValue = responseMessage(true, {
        isConnected: DefiLedger.connected,
      });
      log.info('Ledger connected');
    } catch (err) {
      log.error(err.message);
      event.returnValue = responseMessage(false, {
        message: err.message,
        isConnected: DefiLedger.connected,
      });
    }
  });

  ipcMain.on(LIST_DEVICES_LEDGER, async (event: Electron.IpcMainEvent) => {
    log.info('Ledger list');
    try {
      const devices = await DefiLedger.getDevices();
      event.returnValue = responseMessage(true, {
        devices,
      });
      log.info(`List devices: ${JSON.stringify(devices)}`);
    } catch (err) {
      log.error(`Error ledger list: ${err.message}`);
      event.returnValue = responseMessage(false, {
        message: err.message,
      });
    }
  });

  ipcMain.on(
    CUSTOM_TX_LEDGER,
    async (
      event: Electron.IpcMainEvent,
      {utxo,
      address,
      amount,
      data,
      keyIndex, feeRate}
    ) => {
      log.info('Generate custom tx of ledger');
      try {
        log.info(`${utxo}, ${address}, ${amount}, ${data}, ${keyIndex}`)
        const tx = await createTx(utxo, address, data, keyIndex, feeRate, DefiLedger);
        log.info(JSON.stringify(tx.toString()));
        event.returnValue = responseMessage(true, {
          tx: tx.toString(),
        });
      } catch (err) {
        log.error(`Error custom tx of ledger: ${err.message}`);
        event.returnValue = responseMessage(false, {
          message: err.message,
        });
      }
    }
  );

  ipcMain.on(BACKUP_IDXS_LEDGER, async (event: Electron.IpcMainEvent) => {
    log.info('Ledger backup idxs');
    try {
      const indexes = await DefiLedger.getBackupIndexes();
      event.returnValue = responseMessage(true, {
        indexes,
      });
      log.info(`Ledger backup: ${JSON.stringify(indexes)}`);
    } catch (err) {
      log.error(`Error ledger backup: ${err.message}`);
      event.returnValue = responseMessage(false, {
        message: err.message,
      });
    }
  });

  ipcMain.on(
    SIGN_TRANSACTION_LEDGER,
    async (
      event: Electron.IpcMainEvent,
      {utxo,
        address,
        amount,
        fromAddress,
        keyIndex, feeRate}
    ) => {
      log.info('Sign Transaction');
      try {
        const a = new Address(address);
        log.info(JSON.stringify(a));
        let tx = new Transaction().from(utxo);
        const toAddress = new Address(address);
        // @ts-ignore
        const outputOne = new Transaction.Output({
          script: toAddress.type === 'scripthash' ?
            // @ts-ignore
            Script.buildScriptHashOut(toAddress) :
            // @ts-ignore
            Script.buildPublicKeyHashOut(toAddress),
          tokenId: 0,
          satoshis: amount * 100000000,
        });
        tx =  tx.addOutput(outputOne);
        const outputOne1 = new Transaction.Output({
          // @ts-ignore
          script: Script.buildPublicKeyHashOut(new Address(fromAddress)),
          tokenId: 0,
          // @ts-ignore
          satoshis: (feeRate * 100000000).toFixed(8),
        });
        tx =  tx.addOutput(outputOne1);
        log.info(`txIN: ${JSON.stringify(tx)}`)
        const txSigs = await signInputs(tx, keyIndex, DefiLedger);
        log.info(`ooooo ${txSigs.toString()}`);
        event.returnValue = responseMessage(true, {
          tx: txSigs.toString(),
        });
      } catch (err) {
        log.error(`Error sign tx of ledger: ${err.message}`);
        event.returnValue = responseMessage(false, {
          message: err.message,
        });
      }
    }
  );
};

export default initiateLedger;
