export type StatusLedger = 'connected' | 'notConnected' | 'connecting';

export interface PaymentRequest {
  label: string;
  id: string;
  time: string;
  address: string;
  message: string;
  amount: number;
  unit: string;
}

export interface WalletTxn {
  txnId: string;
  category: string;
  time: string;
  amount: number;
  unit: string;
  height: number;
}
