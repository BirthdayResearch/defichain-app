import TransportHid from '@ledgerhq/hw-transport-node-hid';
// import TransportBle from "@ledgerhq/hw-transport-node-ble";
import {
  Subscription,
  DescriptorEvent,
  Observer,
  getAltStatusMessage,
  StatusCodes,
} from '@ledgerhq/hw-transport';

const CLA = 0xe0;

const INS_EXIT = 0xff;
const INS_GET_VERSION = 0x01;
const INS_GET_PUBKEY = 0x02;
const INS_SIGN_MSG = 0x04;
const INS_VERIFY_MSG = 0x08;
// not implemented yet
// INS_GET_TXN_HASH = 0x10;

// Get pubkey params
const GET_PUBKEY_P1_NO_DISPLAY = 0x00;
const GET_PUBKEY_P1_DISPLAY_ADDRESS = 0x01;
const GET_PUBKEY_P1_DISPLAY_PUBKEY = 0x02;
const GET_PUBKEY_P1_DISPLAY_BOTH = 0x03;

/**
 * address format is one of legacy | p2sh | bech32 | cashaddr
 */
export type AddressFormat = 'legacy' | 'p2sh' | 'bech32' | 'cashaddr';

const GET_PUBKEY_P2_LEGACY = 0x00;
const GET_PUBKEY_P2_SEGWIT = 0x01;
const GET_PUBKEY_P2_NATIVE_SEGWIT = 0x02;
const GET_PUBKEY_P2_CASHADDR = 0x03;

function addressFormatToP2(format: AddressFormat): number {
  switch (format) {
    case 'legacy':
      return GET_PUBKEY_P2_LEGACY;
    case 'p2sh':
      return GET_PUBKEY_P2_SEGWIT;
    case 'bech32':
      return GET_PUBKEY_P2_NATIVE_SEGWIT;
    case 'cashaddr':
      return GET_PUBKEY_P2_CASHADDR;
  }
}

// Sign/Verify params
const SIGN_VERIFY_P1_NEED_HASH = 0x00;
const SIGN_VERIFY_P1_ALREADY_HASHED = 0x01;
/*
  P2 is a bitmask
  1st bit:
      if set - expect more apdus,
      else - last apdu.
  2nd bit:
      if set - first apdu with 4bytes key index,
      else - data contain only msg data
*/
const SIGN_VERIFY_P2_LAST = 0x00;
const SIGN_VERIFY_P2_MORE = 0x01;
const SIGN_VERIFY_P2_FIRST = 0x02;

function checkStatusCode(response: Buffer): { code: number; status: string } {
  let status: string;
  const code: number =
    (response[response.length - 2] << 8) |
    (response[response.length - 1] & 0xff);
  if (code !== StatusCodes.OK) status = getAltStatusMessage(code);
  else status = 'Ok';
  return { code, status };
}

export default class DefiHwWallet {
  transport: any;
  connected: boolean;

  async getDevices(): Promise<readonly string[]> {
    if (!(await TransportHid.isSupported())) {
      console.log('Transport not supported');
      return;
    }
    let devs = await TransportHid.list();
    if (devs.length === 0) {
      console.log('No devices connected');
      return undefined;
    }
    console.log('Devices avaible:');
    devs.forEach((element) => {
      console.log(element);
    });
    return devs;
  }

  async connect(path?: string) {
    try {
      if (!(await TransportHid.isSupported())) {
        console.log('Transport not supported');
        return;
      }
      this.transport = await TransportHid.open(path !== undefined ? path : '');
      this.connected = true;
      console.log(this.transport.info);
    } catch (e) {
      this.connected = false;
      console.log('Error: ' + e.message);
    }
  }

  async getDefiAppVersion(): Promise<string> {
    if (!this.connected) return '';
    try {
      let apdu = Buffer.from([CLA, INS_GET_VERSION, 0x00, 0x00, 0x00]);
      let response = await this.transport.exchange(apdu);
      let { code, status } = checkStatusCode(response);

      if (code !== StatusCodes.OK) {
        console.log(status);
        return '';
      }

      return response.slice(0, response.length - 2);
    } catch (e) {
      console.log('Error: ' + e.message);
    }
  }

  async getDefiPublicKey(
    index: number,
    format?: AddressFormat
  ): Promise<{ pubkey: Buffer; address: string }> {
    if (!format) format = 'legacy';

    let apdu: Buffer = Buffer.from([
      CLA,
      INS_GET_PUBKEY,
      GET_PUBKEY_P1_DISPLAY_ADDRESS,
      addressFormatToP2(format),
    ]);
    // key index lenght
    apdu.writeUInt8(4, apdu.length);
    // add 4 bytes index to buffer
    apdu.writeInt32LE(index, apdu.length);

    console.log('apdu: ' + apdu.toString('hex'));

    let respone = await this.transport.exchange(apdu);
    let pubkeyLen = respone[0];
    let pubkey = respone.slice(1, 1 + pubkeyLen);
    console.log('Pubkey: ' + pubkey.toString('hex'));
    let addrOffset = 1 + pubkeyLen + 1;
    let addrLen = respone[addrOffset - 1];
    let address = respone
      .slice(addrOffset, addrOffset + addrLen)
      .toString('utf-8');
    console.log('Address: ' + address);

    return { pubkey, address };
  }

  /*
  // Not works
  async getHwWalletVersion() {
    if (!this.connected)
      throw Error("Device unconnected");

    let result: { targetId: Number, osVersion: String, flags: Number, mcuVersion: String, mcuHash?: String };

    let response: Buffer = await this.transport.exchange(Buffer.from([CLA, 0x00, 0x00, 0x00, 0x01, 0x10]));

    let {code, status} = checkStatusCode(response);

    if (code !== StatusCodes.OK)
      throw Error(status);

    let offset = 0;
    result.targetId = (response[offset] << 24) | (response[offset + 1] << 16) | (response[offset + 2] << 8) | response[offset + 3];
    console.log("targetId: " + result.targetId.toString(16));
    offset += 4
    result.osVersion = response.slice(offset + 1, offset + 1 + response[offset]).toString('utf-8');
    console.log("osVersion: " + result.osVersion);
    offset += 1 + response[offset]
    offset += 1
    result.flags = (response[offset] << 24) | (response[offset + 1] << 16) | (response[offset + 2] << 8) | response[offset + 3]
    console.log("flags: " + result.flags.toString(16));
    offset += 4
    result.mcuVersion = response.slice(offset + 1, offset + 1 + response[offset] - 1).toString('utf-8')
    console.log("mcuVersion: " + result.mcuVersion);
    offset += 1 + response[offset]
    if (offset < response.length) {
      result.mcuHash = response.slice(offset, offset + 32).toString('utf-8');
      console.log("mcuHash: " + result.mcuHash);
    }
    return result;
  }

  async listHwWalletApps() {

  }
  */
}
