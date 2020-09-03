import store from '../../app/rootStore';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from '../../containers/WalletPage/reducer';
import { BALANCE_CRON_DELAY_TIME } from '../../constants';
import { setIntervalSynchronous } from '../../utils/utility';

const walletBalanceSchedular = () => {
  store.dispatch(fetchWalletBalanceRequest());
};

const pendingBalanceSchedular = () => {
  store.dispatch(fetchPendingBalanceRequest());
};

export const updateWalletBalanceSchedular = () =>
  setIntervalSynchronous(walletBalanceSchedular, BALANCE_CRON_DELAY_TIME);

export const updatePendingBalanceSchedular = () =>
  setIntervalSynchronous(pendingBalanceSchedular, BALANCE_CRON_DELAY_TIME);
