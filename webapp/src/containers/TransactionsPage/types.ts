import { WalletMap } from '@defi_types/walletMap';
import { IToken } from '../../utils/interfaces';
import { TimeoutLockEnum } from '../SettingsPage/types';

export interface TransactionState {
  accountTokens: IToken[];

  accountHistoryCount: string;
  accountHistoryCountLoaded: boolean;
  accountHistoryCountLoading: boolean;
  listAccountHistoryData: {
    isLoading: boolean;
    isError: string;
    data: [];
    stop: boolean;
  };
  minBlockHeight: number;
  maxBlockData: any;
  combineAccountHistoryData: {
    isLoading: boolean;
    isError: string;
    data: [];
  };
  isWalletTxnsLoading: boolean;
  walletTxns: [];
  totalFetchedTxns: [];
  walletTxnCount: number;
  walletPageCounter: number;
  stopPagination: boolean;
}

export const defaultWalletMap: WalletMap = {
  paths: [],
  lockTimeout: TimeoutLockEnum.FIVE_MINUTES,
  nodeVersion: '',
};
