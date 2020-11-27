import TransportHid from '@ledgerhq/hw-transport-node-speculos';
import DefiHwWallet from '../defiHwWallet';

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

  it('there must be a mistake no devices connected', async () => {
    const ledgerTransport = jest
      .spyOn(TransportHid, 'list')
      .mockImplementation(() => Promise.resolve([]));
    await expect(DefiLedger.getDevices()).rejects.toHaveProperty(
      'message',
      'No devices connected'
    );
    ledgerTransport.mockRestore();
  });

  it('should return public key at format legacy', async () => {
    const res = await DefiLedger.getDefiPublicKey(2);
    expect({
      address: res.address,
      pubkey: res.pubkey.toString('hex'),
    }).toEqual({
      pubkey:
        '049a322ab016f2ccb2221ed15bbc8bda25bd10618843adf9fd015a206e0bb3c0db20c29a6c7e82d2b6e674aebec650c2e3da7d8edb622afa665b4f8bee86672c1e',
      address: '8PAX3vszViQW2vZW6uM8b6pqaNvZYDQJZt',
    });
  });

  it('should return public key at format p2sh', async () => {
    const res = await DefiLedger.getDefiPublicKey(2, 'p2sh');
    expect({
      address: res.address,
      pubkey: res.pubkey.toString('hex'),
    }).toEqual({
      pubkey:
        '049a322ab016f2ccb2221ed15bbc8bda25bd10618843adf9fd015a206e0bb3c0db20c29a6c7e82d2b6e674aebec650c2e3da7d8edb622afa665b4f8bee86672c1e',
      address: 'dLKhx5YCqCrUHrRA4BsaQCr3tc2gFwFr54',
    });
  });

  it('should return public key at format bech32', async () => {
    const res = await DefiLedger.getDefiPublicKey(2, 'bech32');
    expect({
      address: res.address,
      pubkey: res.pubkey.toString('hex'),
    }).toEqual({
      pubkey:
        '049a322ab016f2ccb2221ed15bbc8bda25bd10618843adf9fd015a206e0bb3c0db20c29a6c7e82d2b6e674aebec650c2e3da7d8edb622afa665b4f8bee86672c1e',
      address: 'df1qtz32nlzjqw8c2dzcu0k9nvfyl0209hkteseea0',
    });
  });

  it('should return public key at format cashaddr', async () => {
    const res = await DefiLedger.getDefiPublicKey(2, 'cashaddr');
    expect({
      address: res.address,
      pubkey: res.pubkey.toString('hex'),
    }).toEqual({
      pubkey:
        '049a322ab016f2ccb2221ed15bbc8bda25bd10618843adf9fd015a206e0bb3c0db20c29a6c7e82d2b6e674aebec650c2e3da7d8edb622afa665b4f8bee86672c1e',
      address: 'qpv2920u2gpclpf5tr37ckd3ynaafuk7evzlpn6yzw',
    });
  });
});
