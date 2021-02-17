import BigNumber from 'bignumber.js';

export interface HighestAmountItem {
  address: string;
  amount: BigNumber;
}

export enum ErrorMessages {
  WALLET_LOCKED = 'Please enter the wallet passphrase with walletpassphrase first',
  WITNESS_MISMATCH = 'Witness program hash mismatch',
}

export enum ResponseMessages {
  WALLET_LOCKED = 'containers.wallet.encryptWalletPage.walletIsLocked',
  BLOCKS_PENDING = 'containers.liquidity.liquidityPage.blockTransactionFailed',
}
