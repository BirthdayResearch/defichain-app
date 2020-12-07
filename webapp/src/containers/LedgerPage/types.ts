import { StatusLedger } from '@/typings/models';

export interface LedgerConnect {
  status: StatusLedger;
  error: null | Error;
  device: null | string;
}

export interface LedgerState {
  connect: LedgerConnect;
  isShowingInformation: boolean;
  [key: string]: any;
}
