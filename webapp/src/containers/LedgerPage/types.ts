import { Device } from 'node-hid';
import { DeviceModel } from '@ledgerhq/devices';
import { StatusLedger, PaymentRequestLedger } from '@/typings/models';

export interface LedgerConnect {
  status: StatusLedger;
  error: null | Error;
  device: null | string;
}

export interface LedgerDevice extends Device {
  deviceModel: DeviceModel;
}

export interface DevicesLedger {
  list: LedgerDevice[];
  error: null | Error;
}

export interface LedgerState {
  connect: LedgerConnect;
  isShowingInformation: boolean;
  devices: DevicesLedger;
  paymentRequests: PaymentRequestLedger[];
  [key: string]: any;
  walletBalance: number;
}
