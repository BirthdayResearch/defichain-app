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
    await expect(DefiLedger.connect()).rejects.toEqual(
      new Error('Transport not supported')
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
    await expect(DefiLedger.getDevices()).rejects.toEqual(
      new Error('Transport not supported')
    );
    ledgerTransport.mockRestore();
  });

  it('there must be a mistake no devices connected', async () => {
    const ledgerTransport = jest
      .spyOn(TransportHid, 'list')
      .mockImplementation(() => Promise.resolve([]));
    await expect(DefiLedger.getDevices()).rejects.toEqual(
      new Error('No devices connected')
    );
    ledgerTransport.mockRestore();
  });
});
