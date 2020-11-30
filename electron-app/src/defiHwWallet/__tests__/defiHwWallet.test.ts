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

  it('should return sign signature in format TVL', async () => {
    const rawTVLSignature = await DefiLedger.sign(1, new Buffer('message'));
    expect(rawTVLSignature.toString('hex')).toEqual(
      '314402207e4ac4c697bdb1d768337b56657ceea424441620746069215508bb1e753fab9d02207327983321d4e866f9dc465658ffaedbfebd0f080162516a623df2b2188cc5c8'
    );
  });

  it('should return transform sign', async () => {
    const rawTVLSignature = await DefiLedger.sign(3, new Buffer('message'));
    expect(
      DefiLedger.transformationSign(rawTVLSignature).toString('hex')
    ).toEqual(
      'b8b6d9e46338d9a2be0821b57d9499fb16eda801fd24f131d869191338386b4c7c9a638c9db7bee29f15d487d622f8e381af0914a5046100af7e9a26f1609e5400'
    );
  });
});
