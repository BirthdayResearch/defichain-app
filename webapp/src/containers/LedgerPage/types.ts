import { StatusLedger, PaymentRequestLedger } from '@/typings/models';
import { IToken } from '@/utils/interfaces';

export interface LedgerConnect {
  status: StatusLedger;
  error: null | Error;
  device: null | string;
}

export interface DevicesLedger {
  list: any[];
  error: null | Error;
}

export interface IndexesKeyLedger {
  data: any;
  isLoading: boolean;
  error: null | Error;
}

export interface IAccountTokensState {
  data: IToken[],
  isLoading: boolean;
  isLoaded: boolean;
}

export interface LedgerState {
  connect: LedgerConnect;
  isShowingInformation: boolean;
  devices: DevicesLedger;
  paymentRequests: PaymentRequestLedger[];
  [key: string]: any;
  walletBalance: number;
  indexesKeyLedger: IndexesKeyLedger;
  accountTokens: IAccountTokensState;
}
