import { WalletMap } from '@defi_types/walletMap';
import { IToken } from '../../utils/interfaces';
import { TimeoutLockEnum } from '../SettingsPage/types';

export interface WalletState {
  accountTokens: IToken[];
  isAccountTokensLoaded: boolean;
  isAccountLoadingTokens: boolean;
  accountHistoryCount: string;
  accountHistoryCountLoaded: boolean;
  accountHistoryCountLoading: boolean;
  minBlockHeight: number;
  maxBlockData: any;
  tokens: IToken[];
  isTokensLoaded: boolean;
  isLoadingTokens: boolean;
  walletBalance: number;
  isBalanceFetching: boolean;
  isBalanceError: string;
  utxoDfi: number;
  isUtxoDfiFetching: boolean;
  isUtxoDfiError: string;
  pendingBalance: number;
  isPendingBalanceFetching: boolean;
  isPendingBalanceError: string;
  paymentRequests: [];
  walletTxns: [];
  walletTxnCount: number;
  isWalletTxnsLoading: boolean;
  totalFetchedTxns: [];
  walletPageCounter: number;
  stopPagination: boolean;
  blockChainInfo: any;
  receivedData: {
    amountToReceive: string;
    amountToReceiveDisplayed: number;
    receiveMessage: string;
    showBackdrop: string;
    receiveStep: string;
  };
  sendData: {
    walletBalance: number;
    amountToSend: string;
    amountToSendDisplayed: number;
    toAddress: string;
    scannerOpen: boolean;
    flashed: string;
    showBackdrop: string;
    sendStep: string;
    waitToSend: number;
  };
  isWalletCreating: boolean;
  isErrorCreatingWallet: string;
  isWalletRestoring: boolean;
  isErrorRestoringWallet: string;
  isWalletCreatedFlag: boolean;
  listAccountHistoryData: {
    isLoading: boolean;
    isError: string;
    data: [];
    stop: boolean;
  };
  combineAccountHistoryData: {
    isLoading: boolean;
    isError: string;
    data: [];
  };
  restartCriteria: {
    isLoading: boolean;
    data: true;
    isError: string;
  };
  walletMap: WalletMap;
  walletMapError: string;
  isWalletEncrypted: boolean;
  isErrorUnlockWallet: string;
  isWalletUnlocked: boolean;
  lockedUntil: number;
}

export const defaultWalletMap: WalletMap = {
  paths: [],
  lockTimeout: TimeoutLockEnum.FIVE_MINUTES,
  nodeVersion: '',
};
