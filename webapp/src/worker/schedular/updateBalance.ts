import store from '../../app/rootStore';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
} from '../../containers/WalletPage/reducer';
import { BALANCE_CRON_DELAY_TIME } from '../../constants';

const walletBalanceSchedular = () => {
  console.log('wallet balance schedular called');
  store.dispatch(fetchWalletBalanceRequest());
};

const pendingBalanceSchedular = () => {
  console.log('pending balance schedular called');
  store.dispatch(fetchPendingBalanceRequest());
};

export let walletBalanceTimerID;
export let pendingBalanceTimerID;

export const updateWalletBalanceSchedular = () => {
  walletBalanceTimerID = setInterval(
    walletBalanceSchedular,
    BALANCE_CRON_DELAY_TIME
  );
};

export const updatePendingBalanceSchedular = () => {
  pendingBalanceTimerID = setInterval(
    pendingBalanceSchedular,
    BALANCE_CRON_DELAY_TIME
  );
};
