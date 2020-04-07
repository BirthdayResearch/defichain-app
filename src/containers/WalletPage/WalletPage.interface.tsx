export interface WalletPageProps {}

export interface WalletPageState {
  activeTab: string;
}

export interface SendPageProps {
  sendData: {
    walletBalance: number;
    amountToSend: string | number;
    amountToSendDisplayed: number | string;
    toAddress: string;
    scannerOpen: boolean;
    flashed: string;
    showBackdrop: string;
    sendStep: string;
    waitToSend: number;
  };
  fetchSendData: Function;
}

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

export interface PaymentRequestsProps {
  paymentRequests: Array<{
    id: number;
    time: string;
    amount: number;
    message: string;
    unit: string;
  }>;
  fetchPaymentRequests: Function;
}

export interface PaymentRequestsState {}

export interface WalletTxnsProps {
  walletTxns: Array<{
    id: number;
    type: string;
    time: string;
    hash: string;
    amount: number;
    unit: string;
  }>;
  fetchWalletTxns: Function;
}

export interface WalletTxnsState {}

export interface ReceivePageProps {
  receivedData: {
    amountToReceive: string;
    amountToReceiveDisplayed: number;
    receiveMessage: string;
    showBackdrop: string;
    receiveStep: string;
  };
  fetchReceivedData: Function;
}
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
