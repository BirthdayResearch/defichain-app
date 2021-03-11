import { Device } from 'node-hid';
import { DeviceModel } from '@ledgerhq/devices';

export interface LedgerDevice extends Device {
  deviceModel: DeviceModel;
}
