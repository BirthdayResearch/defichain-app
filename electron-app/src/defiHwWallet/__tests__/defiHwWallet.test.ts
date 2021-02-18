import TransportHid from '@ledgerhq/hw-transport-node-hid';
import { getDevices } from '@ledgerhq/hw-transport-node-hid-noevents';
import DefiHwWallet from '../defiHwWallet';
jest.mock('../../services/electronLogger');
describe('DefiHwWallet', () => {
  const DefiLedger = new DefiHwWallet();

  it('should connect at ledger', async () => {
    await DefiLedger.connect();
    expect(DefiLedger.connected).toEqual(true);
  });

  it('should error at connect ledger', async () => {
    const ledgerTransport = jest
      .spyOn(TransportHid, 'isSupported')
      .mockImplementation(() => Promise.resolve(false));
    await expect(DefiLedger.connect()).rejects.toHaveProperty(
      'message',
      'Transport not supported'
    );
    expect(DefiLedger.connected).toEqual(false);
    ledgerTransport.mockRestore();
  });

  it('should one device in list', async () => {
    await expect(DefiLedger.getDevices()).resolves.toHaveLength(1);
  });

  it('should one device in list', async () => {
    await expect(DefiLedger.getDevices()).resolves.toHaveLength(1);
  });

  it('should call error not supported in list devices ', async () => {
    const ledgerTransport = jest
      .spyOn(TransportHid, 'isSupported')
      .mockImplementation(() => Promise.resolve(false));
    await expect(DefiLedger.getDevices()).rejects.toHaveProperty(
      'message',
      'Transport not supported'
    );
    ledgerTransport.mockRestore();
  });

  it('should return public key at format legacy', async () => {
    const res = await DefiLedger.getDefiPublicKey(2);
    expect(res).toEqual({
      pubkey:
        '03cafc9f4bbffc37418359abe142d056d562e2f0cbaa585b680a8c0be7cd476a95',
      address: '789QuskTNNdt1psxeMopoKHac82SjAN6ZV',
      chainCode: '38d4f3f5e013144ca4f836302a39a34fe83b81fc9c0c142c3e79869ff31e15df'
    });
  });

  it('should return public key at format p2sh', async () => {
    const res = await DefiLedger.getDefiPublicKey(2, 'p2sh');
    expect(res).toEqual({
      pubkey:
        '03cafc9f4bbffc37418359abe142d056d562e2f0cbaa585b680a8c0be7cd476a95',
      address: 'ttVsZL1vmt25hWC2WKzJZcPEXAiMQrKpVA',
      chainCode: '38d4f3f5e013144ca4f836302a39a34fe83b81fc9c0c142c3e79869ff31e15df'
    });
  });

  it('should return sign signature in format TVL', async () => {
    const rawTVLSignature = await DefiLedger.sign(1, new Buffer('message'));
    expect(rawTVLSignature.toString('hex')).toEqual(
      '30440220705b0ae5486ffd388c33da24aa6fc4b7a5082b1a73a8a5a4adb5e1c8331da61402207803223f084d56464a41558454dd8b8ffcc21ed065ffee8d01fbf78fcbd3d179'
    );
  });

  it('should return transform sign', async () => {
    const rawTVLSignature = await DefiLedger.sign(3, new Buffer('message'));
    expect(
      DefiLedger.transformationSign(rawTVLSignature).toString('hex')
    ).toEqual(
      '2824877c80308a84382d2f605eaf74a1c775e5b9341e93c3ffbdc5fb0275375e76d3478a4f8abaf660cdeccb8ea806b541707e37922b30851e6fbe5ac1a5035800'
    );
  });

  it('should return empty array getBackupIndexes', async () => {
    const indexes = await DefiLedger.getBackupIndexes();
    expect(
      indexes
    ).toEqual(
      []
    );
  });
});
