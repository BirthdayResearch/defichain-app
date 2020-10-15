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

const pendingAndWalletBalance = () => {
  walletBalanceSchedular();
  pendingBalanceSchedular();
};

export const updateBalanceScheduler = () =>
  setIntervalSynchronous(pendingAndWalletBalance, BALANCE_CRON_DELAY_TIME);
