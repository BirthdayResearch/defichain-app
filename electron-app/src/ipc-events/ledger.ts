import { ipcMain } from 'electron';
import {
  GET_LEDGER_DEFI_PUB_KEY,
  CONNECT_LEDGER,
  LIST_DEVICES_LEDGER,
  CUSTOM_TX_LEDGER,
  BACKUP_IDXS_LEDGER,
} from '../constants';
import { responseMessage } from '../utils';
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
      utxo: any,
      address: string,
      amount: string,
      data: any,
      keyIndex: number
    ) => {
      log.info('Generate custom tx of ledger');
      try {
        const tx = await createTx(utxo, address, amount, data, 0, DefiLedger);
        event.returnValue = responseMessage(true, {
          tx,
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
};

export default initiateLedger;
