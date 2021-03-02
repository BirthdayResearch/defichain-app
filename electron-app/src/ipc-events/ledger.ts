import { ipcMain } from 'electron';
import { Transaction, Address, crypto, PublicKey } from 'bitcore-lib-dfi';
import {
  GET_LEDGER_DEFI_PUB_KEY,
  CONNECT_LEDGER,
  LIST_DEVICES_LEDGER,
  CUSTOM_TX_LEDGER,
  BACKUP_IDXS_LEDGER,
  SIGN_TRANSACTION_LEDGER,
} from '@defi_types/ipcEvents';
import { responseMessage } from '../utils';
// eslint-disable-next-line no-unused-vars
import DefiHwWallet, { AddressFormat } from '../defiHwWallet/defiHwWallet';
import * as log from '../services/electronLogger';
import { createTx } from '../services/customTx';

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
        devices: JSON.stringify(devices),
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
      { utxo, address, amount, data, keyIndex }
    ) => {
      log.info('Generate custom tx of ledger');
      try {
        log.info(`${utxo}, ${address}, ${amount}, ${data}, ${keyIndex}`);
        let tx = createTx(utxo, address, data);
        const { pubkey } = await DefiLedger.getDefiPublicKey(
          keyIndex,
          'legacy'
        );

        const lendgerSign = async (buff: Buffer) => {
          const resSign = await DefiLedger.sign(keyIndex, buff, true);
          return resSign;
        };

        tx = await tx.signWithInterface(
          lendgerSign,
          PublicKey.fromString(pubkey, 'hex'),
          crypto.Signature.SIGHASH_ALL
        );
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
      { utxo, address: toAddress, amount, fromAddress, keyIndex, feeRate, type }
    ) => {
      log.info('Sign Transaction');
      try {
        const toAddressOb = new Address(toAddress);
        const fromAddressOb = new Address(fromAddress);
        log.info(JSON.stringify(toAddressOb));
        const tx = new Transaction()
          .from(utxo)
          .to(toAddressOb, Number((amount * 100000000).toFixed(0)))
          .change(fromAddressOb);
        log.info(`txIN: ${JSON.stringify(tx)}`);

        const { pubkey } = await DefiLedger.getDefiPublicKey(keyIndex, type);

        const lendgerSign = async (buff: Buffer) => {
          const resSign = await DefiLedger.sign(keyIndex, buff, true);
          return resSign;
        };

        const txSigs = await tx.signWithInterface(
          lendgerSign,
          PublicKey.fromString(pubkey, 'hex'),
          crypto.Signature.SIGHASH_ALL
        );
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
