import DefiHwWallet from './defiHwWallet';

const hw = async () => {
  const defiHwWallet = new DefiHwWallet();
  await defiHwWallet.connect();
  console.log('connectHwWallet');
  for (let i = 0; i < 1; i++) {
    let ret: { pubkey: Buffer; address: string };
    ret = await defiHwWallet.getDefiPublicKey(i, 'legacy');
    console.log('legacy addr: ' + ret.address);
    ret = await defiHwWallet.getDefiPublicKey(i, 'p2sh');
    console.log('p2sh addr: ' + ret.address);
    ret = await defiHwWallet.getDefiPublicKey(i, 'bech32');
    console.log('bech32 addr: ' + ret.address);
    ret = await defiHwWallet.getDefiPublicKey(i, 'cashaddr');
    console.log('cashaddr addr: ' + ret.address);
  }
}

hw();
