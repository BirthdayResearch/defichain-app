export interface WalletPageProps {}

export interface WalletPageState {
  activeTab: string;
}

export interface SendPageProps {}

export interface SendPageState {
  walletBalance: number;
  amountToSend: string | number;
  amountToSendDisplayed: number | string;
  toAddress: string;
  scannerOpen: boolean;
  flashed: string;
  showBackdrop: string;
  sendStep: string;
  waitToSend: number;
}

export interface WalletTxnsProps {}

export interface WalletTxnsState {
  txns: Array<{
    id: number;
    type: string;
    time: string;
    hash: string;
    amount: number;
    unit: string;
  }>;
}

export interface ReceivePageProps {}
export interface ReceivePageState {
  amountToReceive: string;
  amountToReceiveDisplayed: number;
  receiveMessage: string;
  showBackdrop: string;
  receiveStep: string;
}

export interface PaymentRequestPageProps {}
export interface PaymentRequestPageState {
  label: string;
  amount: string;
  time: string;
  message: string;
  address: string;
}

export interface RouteProps {
  id: string;
}
