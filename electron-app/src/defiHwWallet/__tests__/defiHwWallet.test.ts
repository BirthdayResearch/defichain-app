import DefiHwWallet from '../defiHwWallet';

describe('DefiHwWallet', () => {
  it('should connect at ledger', async () => {
    const DefiLedger = new DefiHwWallet();
    await DefiLedger.connect();
    expect(DefiLedger.connected).toEqual(true);
  });

  it('should error at connect ledger', async () => {
    const DefiLedger = new DefiHwWallet();
    await DefiLedger.connect();
    expect(DefiLedger.connected).toEqual(false);
  });
});
