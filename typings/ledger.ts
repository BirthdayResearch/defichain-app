import { CustomTx } from 'bitcore-lib-dfi';
import { ListUnspentModel } from '@defi_types/common';

export interface IDataTxSend {
  toAddress: string;
  fromAddress: string;
  amount: number;
}

export interface IDataCustomTx {
  txType: string;
  customData: CustomTx.CustomData;
  address: string;
}

export interface AddressLedger {
  keyIndex: number;
  address: string;
}

export interface IDataTx<T> {
  utxo: ListUnspentModel[];
  data: T;
  addressesLedger: AddressLedger[]
}
