import store from '../../app/rootStore';
import RpcClient from '../../utils/rpc-client';
import { enableAutoLockStart } from '../WalletPage/reducer';

export let autoLockTimer;

export const handleEncryptWallet = async (passphrase: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.encryptWallet(passphrase);
};

export const handleUnlockWallet = async (
  passphrase: string,
  timeout: number
) => {
  const rpcClient = new RpcClient();
  return rpcClient.walletPassphrase(passphrase, timeout);
};

export const handleLockWallet = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.walletlock();
};

export const enableAutoLock = (timeout: number) => {
  autoLockTimer = setTimeout(
    () => store.dispatch(enableAutoLockStart()),
    timeout * 1000
  );
};

export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
