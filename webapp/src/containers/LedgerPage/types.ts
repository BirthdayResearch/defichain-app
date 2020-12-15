import { StatusLedger, PaymentRequest } from '@/typings/models';

export interface LedgerConnect {
  status: StatusLedger;
  error: null | Error;
  device: null | string;
}

export interface DevicesLedger {
  list: any[];
  error: null | Error;
}

export interface LedgerState {
  connect: LedgerConnect;
  isShowingInformation: boolean;
  devices: DevicesLedger;
  paymentRequests: PaymentRequest[];
  [key: string]: any;
}
