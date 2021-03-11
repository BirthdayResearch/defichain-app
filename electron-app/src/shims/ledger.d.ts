declare module '@ledgerhq/hw-transport-node-speculos';
declare module '@ledgerhq/hw-transport-mocker';
declare module '@ledgerhq/hw-transport-node-hid-noevents' {
  import { Device } from 'node-hid';

  export function getDevices(): Device[];
}
declare module '@ledgerhq/devices' {
  export type DeviceModel = {
    id: string;
    productName: string;
    productIdMM: number;
    legacyUsbProductId: number;
    usbOnly: boolean;
    memorySize: number;
    blockSize: number;
    bluetoothSpec?: {
      serviceUuid: string;
      writeUuid: string;
      notifyUuid: string;
    }[];
  };
  export function identifyUSBProductId(usbProductId: number): DeviceModel;
}
