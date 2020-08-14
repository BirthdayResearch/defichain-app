import * as log from '../../utils/electronLogger';
import RpcClient from '../../utils/rpc-client';
import { PAYMENT_REQUEST } from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { I18n } from 'react-redux-i18n';
import showNotification from '../../utils/notifications';

export const handelGetPaymentRequest = (networkName) => {
  return JSON.parse(
    PersistentStore.get(`${PAYMENT_REQUEST}-${networkName}`) || '[]'
  );
};

export const handelAddReceiveTxns = (data, networkName) => {
  const initialData = JSON.parse(
    PersistentStore.get(`${PAYMENT_REQUEST}-${networkName}`) || '[]'
  );
  const paymentData = [data, ...initialData];
  PersistentStore.set(`${PAYMENT_REQUEST}-${networkName}`, paymentData);
  return paymentData;
};

export const handelRemoveReceiveTxns = (id, networkName) => {
  const initialData = JSON.parse(
    PersistentStore.get(`${PAYMENT_REQUEST}-${networkName}`) || '[]'
  );
  const paymentData = initialData.filter(
    (ele) => ele.id && ele.id.toString() !== id.toString()
  );
  PersistentStore.set(`${PAYMENT_REQUEST}-${networkName}`, paymentData);
  return paymentData;
};

export const handelFetchWalletTxns = async (
  pageNo: number,
  pageSize: number
) => {
  const rpcClient = new RpcClient();
  const walletTxns = await rpcClient.getWalletTxns(pageNo - 1, pageSize);
  const walletTxnCount = await rpcClient.getWalletTxnCount();
  const data = { walletTxns: walletTxns.reverse(), walletTxnCount };
  return data;
};

export const handleSendData = async () => {
  const rpcClient = new RpcClient();
  const walletBalance = await rpcClient.getBalance();
  const data = {
    walletBalance,
    amountToSend: '',
    amountToSendDisplayed: 0,
    toAddress: '',
    scannerOpen: false,
    flashed: '',
    showBackdrop: '',
    sendStep: 'default',
    waitToSend: 5,
  };
  return data;
};

export const handleFetchWalletBalance = async () => {
  const rpcClient = new RpcClient();
  return await rpcClient.getBalance();
};

export const handleFetchPendingBalance = async (): Promise<number> => {
  const rpcClient = new RpcClient();
  return await rpcClient.getPendingBalance();
};

export const isValidAddress = async (toAddress: string) => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.isValidAddress(toAddress);
  } catch (err) {
    log.error(`Got error in isValidAddress: ${err}`);
    return false;
  }
};

export const sendToAddress = async (
  toAddress: string,
  amount: number | string,
  subtractfeefromamount: boolean = false
) => {
  try {
    const rpcClient = new RpcClient();
    const data = await rpcClient.sendToAddress(
      toAddress,
      amount,
      subtractfeefromamount
    );
    return data;
  } catch (err) {
    log.error(`Got error in sendToAddress: ${err}`);
    showNotification(
      I18n.t('alerts.errorOccurred'),
      I18n.t('containers.wallet.sendPage.sendFailed')
    );
    throw new Error(`Got error in sendToAddress: ${err}`);
  }
};

export const getNewAddress = async (label) => {
  const rpcClient = new RpcClient();
  try {
    return rpcClient.getNewAddress(label);
  } catch (err) {
    log.error(`Got error in getNewAddress: ${err}`);
    throw err;
  }
};
