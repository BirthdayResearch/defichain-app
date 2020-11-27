import TransportHid from '@ledgerhq/hw-transport-node-speculos';
import DefiHwWallet from '../defiHwWallet';

describe('DefiHwWallet', () => {
  it('should connect at ledger', async () => {
    const DefiLedger = new DefiHwWallet();
    await DefiLedger.connect();
    expect(DefiLedger.connected).toEqual(true);
  });

  it('should error at connect ledger', async () => {
    const ledgerTransport = jest.spyOn(TransportHid, 'isSupported').mockImplementation(() => Promise.resolve(false));
    const DefiLedger = new DefiHwWallet();
    await expect(DefiLedger.connect()).rejects.toEqual(new Error('Transport not supported'));
    expect(DefiLedger.connected).toEqual(false);
    ledgerTransport.mockRestore();
  });
});
