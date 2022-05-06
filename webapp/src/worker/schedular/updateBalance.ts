import store from '../../app/rootStore';
import {
  fetchWalletBalanceRequest,
  fetchPendingBalanceRequest,
  fetchAccountTokensRequest,
  getSPVBalance,
} from '../../containers/WalletPage/reducer';
import { BALANCE_CRON_DELAY_TIME } from '../../constants';
import { setIntervalSynchronous } from '../../utils/utility';
import RpcClient from 'src/utils/rpc-client';

const walletBalanceSchedular = () => {
  store.dispatch(fetchWalletBalanceRequest());
};

const pendingBalanceSchedular = () => {
  store.dispatch(fetchPendingBalanceRequest());
};

const walletTokenBalanceSchedular = () => {
  store.dispatch(fetchAccountTokensRequest());
};

//* TODO update to flags instead of polling
const bitcoinBalancePoll = () => {
  store.dispatch(getSPVBalance());
};

const pendingAndWalletBalance = () => {
  const rpcClient = new RpcClient();
  rpcClient.getBestBlockHash().finally(() => {
    walletBalanceSchedular();
    walletTokenBalanceSchedular();
    pendingBalanceSchedular();
    bitcoinBalancePoll();
  });
};

export const updateBalanceScheduler = () =>
  setIntervalSynchronous(pendingAndWalletBalance, BALANCE_CRON_DELAY_TIME);
