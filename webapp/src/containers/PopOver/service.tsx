import store from '../../app/rootStore';
import { WALLET_UNLOCK_TIMEOUT } from '../../constants';
import RpcClient from '../../utils/rpc-client';
import { enableAutoLockStart } from './reducer';

export let autoLockTimer;

export const handleEncryptWallet = async (passphrase: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.encryptWallet(passphrase);
};

export const handleUnlockWallet = async (passphrase: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.walletPassphrase(passphrase);
};

export const handleLockWallet = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.walletlock();
};

export const enableAutoLock = () => {
  autoLockTimer = setTimeout(
    () => store.dispatch(enableAutoLockStart()),
    WALLET_UNLOCK_TIMEOUT * 1000
  );
};

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
