import { PaymentRequestModel } from './rpcConfig';

export interface WalletMap {
  paths: string[];
  lockTimeout: number;
  nodeVersion: string;
  hasSyncSPV?: boolean;
  paymentRequests?: PaymentRequestModel[];
  spvPaymentRequests?: PaymentRequestModel[];
  hasRescan?: boolean;
}
