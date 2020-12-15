export type StatusLedger = 'connected' | 'notConnected' | 'connecting';

export type PaymentRequest = {
  label: string;
  id: string;
  time: string;
  address: string;
  message: string;
  amount: number;
  unit: string;
};
