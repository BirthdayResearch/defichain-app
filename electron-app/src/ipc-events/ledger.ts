import { ipcMain } from 'electron';
import { Address, crypto, PublicKey, Transaction } from 'bitcore-lib-dfi';
import {
  BACKUP_IDXS_LEDGER,
  CONNECT_LEDGER,
  CUSTOM_TX_LEDGER,
  GET_LEDGER_DEFI_PUB_KEY,
  LIST_DEVICES_LEDGER,
  SEND_TOKEN_TX_LEDGER,
} from '@defi_types/ipcEvents';
import { responseMessage } from '../utils';
// eslint-disable-next-line no-unused-vars
import DefiHwWallet, { AddressFormat } from '../defiHwWallet/defiHwWallet';
import * as log from '../services/electronLogger';
import { createTx, ONE_DFI_SATOSHIS } from '../services/customTx';
import { ListUnspentModel } from '@defi_types/common';
import { IDataTx, AddressLedger, IDataTxSend, IDataCustomTx } from '@defi_types/ledger';

const DefiLedger = new DefiHwWallet();

const signTx = async (
  tx: Transaction,
  utxo: ListUnspentModel[],
  addressesLedger: AddressLedger[]
): Promise<Transaction> => {
  const utxoAddresses = utxo
    .map((item) => item.address)
    .filter((el, i, a) => i === a.indexOf(el));

  for (const u of utxoAddresses) {
    const keyIndex = addressesLedger.find((a: any) => a.address === u).keyIndex;
    const { pubkey } = await DefiLedger.getDefiPublicKey(keyIndex);

    const lendgerSign = async (buff: Buffer) => {
      return await DefiLedger.sign(keyIndex, buff, true);
    };

    tx = await tx.signWithInterface(
      lendgerSign,
      PublicKey.fromString(pubkey, 'hex'),
      crypto.Signature.SIGHASH_ALL
    );
  }
  return tx;
};

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
      {
        utxo,
        data,
        addressesLedger,
      }: IDataTx<IDataCustomTx>
    ) => {
      log.info('Generate custom tx of ledger');
      try {
        let tx = createTx(utxo, data);
        tx = await signTx(tx, utxo, addressesLedger);

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
    SEND_TOKEN_TX_LEDGER,
    async (
      event: Electron.IpcMainEvent,
      { utxo, data, addressesLedger }: IDataTx<IDataTxSend>
    ) => {
      log.info('Sign Transaction');
      try {
        const toAddressOb = new Address(data.toAddress);
        const fromAddressOb = new Address(data.fromAddress);
        log.info(JSON.stringify(toAddressOb));
        const tx = new Transaction()
          .from(utxo)
          .to(toAddressOb, Number((data.amount * ONE_DFI_SATOSHIS).toFixed(0)))
          .change(fromAddressOb);
        log.info(`txIN: ${JSON.stringify(tx)}`);

        const txSigs = await signTx(tx, utxo, addressesLedger);
        log.info(`tx sign ${txSigs.toString()}`);

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
