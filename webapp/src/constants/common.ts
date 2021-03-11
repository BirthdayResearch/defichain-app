import BigNumber from 'bignumber.js';

export interface HighestAmountItem {
  address: string;
  amount: BigNumber;
}

export enum ErrorMessages {
  WALLET_LOCKED = 'Please enter the wallet passphrase with walletpassphrase first',
  WITNESS_MISMATCH = 'Witness program hash mismatch',
  AUTH_TX = 'Add-on auth TX failed',
  UNABLE_TO_SIGN = 'Unable to sign input, invalid stack size (possibly missing key)',
  PASSPHRASE_INCORRECT = 'The wallet passphrase entered was incorrect',
  MEMPOOL = 'mempool',
  UNABLE_TO_SIGN_INPUT = 'Unable to sign input, invalid stack size (possibly missing key)',
}

export enum ResponseMessages {
  WALLET_LOCKED = 'containers.wallet.encryptWalletPage.walletIsLocked',
  WITNESS_MISMATCH = 'containers.wallet.encryptWalletPage.walletIsLocked',
  BLOCKS_PENDING = 'containers.liquidity.liquidityPage.blockTransactionFailed',
  AUTH_TX = 'containers.errors.insufficientFunds',
  UNABLE_TO_SIGN = 'containers.wallet.encryptWalletPage.walletIsLocked',
  PASSPHRASE_INCORRECT = 'containers.settings.incorrectPassphrase',
  MEMPOOL = 'containers.liquidity.liquidityPage.blockTransactionFailed',
  UNABLE_TO_SIGN_INPUT = 'containers.wallet.encryptWalletPage.walletIsLocked',
}
