import BigNumber from 'bignumber.js';

export type StatusLedger = 'connected' | 'notConnected' | 'connecting';

export interface PaymentRequestLedger {
  label: string;
  id: string;
  time: string;
  address: string;
  message: string;
  amount: number;
  unit: string;
  keyIndex: number;
}

export interface WalletTxn {
  txnId: string;
  category: string;
  time: string;
  amount: number;
  unit: string;
  height: number;
}

export interface FormPoolSwap {
  amount1: string;
  hash1: string;
  symbol1: string;
  amount2: string;
  hash2: string;
  symbol2: string;
  balance1: string;
  balance2: string;
  receiveAddress: string;
  receiveLabel: string;
}

export interface IAccount {
  amount: BigNumber;
  key: string;
  owner: {
    addresses: string[];
    asm: string;
    hex: string;
    regSigs: number;
    type: string;
  };
}
