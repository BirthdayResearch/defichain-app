// @ts-nocheck
import { I18n } from 'react-redux-i18n';
import isEmpty from 'lodash/isEmpty';
import _ from 'lodash';
import { CustomTx } from 'bitcore-lib-dfi';
import * as log from '@/utils/electronLogger';
import { ipcRendererFunc } from '@/utils/isElectron';
import RpcClient from '@/utils/rpc-client';
import {
  PAYMENT_REQUEST,
  BLOCKCHAIN_INFO_CHAIN_TEST,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  LIST_TOKEN_PAGE_SIZE,
  LIST_ACCOUNTS_PAGE_SIZE,
  IS_SHOWING_INFORMATION_LEDGER,
  LIST_DEVICES_LEDGER,
  MAXIMUM_AMOUNT,
  DEFAULT_MAXIMUM_AMOUNT,
  MAXIMUM_COUNT,
  DEFAULT_MAXIMUM_COUNT,
  FEE_RATE,
  DEFAULT_FEE_RATE,
  BACKUP_IDXS_LEDGER,
} from '@/constants';
import PersistentStore from '@/utils/persistentStore';
import {
  fetchAccountsDataWithPagination,
  fetchTokenDataWithPagination,
  getErrorMessage,
  getMixWordsObject,
  getMnemonicObject,
  getRandomWordObject,
  getTxnDetails,
  handleLocalStorageNameLedger,
  handelGetPaymentRequestLedger
} from '@/utils/utility';
import {
  GET_LEDGER_DEFI_PUB_KEY,
  CONNECT_LEDGER,
  CUSTOM_TX_LEDGER,
} from '@/constants';
import { PaymentRequestLedger } from '@/typings/models';
import BigNumber from 'bignumber.js';

export const handelAddReceiveTxns = (data, networkName) => {
  const localStorageName = handleLocalStorageNameLedger(networkName);
  const initialData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  const paymentData = [data, ...initialData];
  PersistentStore.set(localStorageName, paymentData);
  return paymentData;
};

export const handelRemoveReceiveTxns = (id, networkName) => {
  const localStorageName = handleLocalStorageNameLedger(networkName);
  const initialData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  const paymentData = initialData.filter(
    (ele) => ele.id && ele.id.toString() !== id.toString()
  );
  PersistentStore.set(localStorageName, paymentData);
  return paymentData;
};

export const handelFetchWalletTxns = async (
  pageNo: number,
  pageSize: number,
  networkName: string,
) => {
  const localStorageName = handleLocalStorageNameLedger(networkName);
  const paymentData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  const addressesLedger = paymentData.map((payment) => payment.address);
  const rpcClient = new RpcClient();
  const listTransactions = await rpcClient.listTransactions(
    pageNo - 1,
    pageSize
  );
  const promiseRawTransactions = listTransactions.filter(
    (tx) =>
      new Promise((resolve, reject) => {
        rpcClient.getRawTransaction(tx.txid, false).then((rawTransaction) => {
          for (const vout of rawTransaction.vout) {
            if (
              vout.scriptPubKey.addresses.some(
                (address) => addressesLedger.indexOf(address) !== -1
              )
            ) {
              resolve(tx);
            }
          }
        });
      })
  );
  const rawTransactions = await Promise.all(promiseRawTransactions);
  const txList = await getTxnDetails(rawTransactions);
  const walletTxnCount = await rpcClient.getWalletTxnCount();
  return { walletTxns: txList.reverse(), walletTxnCount };
};

export const handleSendData = async (addresses) => {
  const walletBalance = await handleFetchWalletBalance(addresses);
  return {
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
};

export const handleFetchRegularDFI = async () => {
  const rpcClient = new RpcClient();
  return await rpcClient.getBalance();
};

export const handleFetchAccountDFI = async () => {
  const accountTokens = await handleFetchAccounts();
  const DFIToken = accountTokens.find((token) => token.hash === '0');
  const tempDFI = DFIToken && DFIToken.amount;
  const accountDFI = tempDFI || 0;
  return accountDFI;
};

export const handleFetchWalletBalance = async (addresses: string[]) => {
  log.info('handleFetchWalletBalance');
  const amountsPromise = addresses.map(async (address) => {
    return await getReceivedByAddress(address);
  });
  const amounts = await Promise.all(amountsPromise);
  let count = 0;
  amounts.forEach((amount) => {
    count += amount;
  })
  return count;
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

export const getTransactionInfo = async (txId): Promise<any> => {
  const rpcClient = new RpcClient();
  const txInfo = await rpcClient.getTransaction(txId);
  if (!txInfo.blockhash && txInfo.confirmations === 0) {
    await sleep(3000);
    await getTransactionInfo(txId);
  } else {
    return;
  }
};

export const sendToAddress = async (
  toAddress: string,
  amount: any,
  subtractfeefromamount: boolean = false
) => {
  const rpcClient = new RpcClient();
  const regularDFI = await handleFetchRegularDFI();
  if (regularDFI >= amount) {
    try {
      const data = await rpcClient.sendToAddress(
        toAddress,
        amount,
        subtractfeefromamount
      );
      return data;
    } catch (err) {
      log.error(`Got error in sendToAddress: ${err}`);
      throw new Error(I18n.t('containers.wallet.sendPage.sendFailed'));
    }
  } else {
    try {
      const accountTokens = await handleFetchAccounts();
      const DFIObj = accountTokens.find((token) => token.hash === '0');
      const fromAddress = DFIObj.address;
      const txId = await rpcClient.sendToAddress(
        fromAddress,
        (10 / 100) * amount,
        subtractfeefromamount
      );
      await getTransactionInfo(txId);
      const hash = await rpcClient.accountToUtxos(
        fromAddress,
        fromAddress,
        `${(amount - regularDFI).toFixed(4)}@DFI`
      );
      await getTransactionInfo(hash);
      const regularDFIAfterTxFee = await handleFetchRegularDFI();
      const transferAmount =
        regularDFIAfterTxFee < amount ? regularDFIAfterTxFee : amount;
      await sendToAddress(toAddress, transferAmount, true);
    } catch (error) {
      log.error(`Got error in sendToAddress: ${error}`);
      throw new Error(I18n.t('containers.wallet.sendPage.sendFailed'));
    }
  }
};

export const accountToAccount = async (
  fromAddress: string | null,
  toAddress: string,
  amount: number,
  token: string,
  keyIndex: number,
  addresses: string[],
) => {
  log.info('Service accounttoaccount is started');
  try {
    const rpcClient = new RpcClient();
    const txId = await rpcClient.sendToAddress(
      fromAddress,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    const cutxo = await rpcClient.listUnspent(1, 9999999,addresses);
    const data = {
      txType: CustomTx.customTxType.accountToAccount,
      customData: {
        from: fromAddress,
        to: {
          [toAddress]: { '0': { balance: amount, token } },
        },
      }
    };
    const ipcRenderer = ipcRendererFunc();
    const res = await ipcRenderer.sendSync(
      CUSTOM_TX_LEDGER,
      {utxo: cutxo,
      address: toAddress,
      amount,
      data,
      keyIndex}
    );
    if (res.success) {
      await rpcClient.sendRawTransaction(res.data.tx);
      return res.data.tx;
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    log.error(`Got error in accounttoaccount: ${err}`);
    throw new Error(getErrorMessage(err));
  }
};

export const getNewAddress = async (
  label: string,
  addressTypeChecked: boolean
) => {
  const rpcClient = new RpcClient();
  try {
    const params: string[] = [];
    if (addressTypeChecked) {
      params.push('legacy');
    }
    return rpcClient.getNewAddress(label, ...params);
  } catch (err) {
    log.error(`Got error in getNewAddress: ${err}`);
    throw err;
  }
};

export const importPubKey = async (pubKey: string, keyIndex: number, label: string) => {
  const rpcClient = new RpcClient();
  try {
    log.info('importPubKey');
    return rpcClient.importPubKey(pubKey, label);
  } catch (err) {
    log.error(`Got error in importPubKey: ${err}`);
    throw err;
  }
};

export const importAddress = async (address: string, keyIndex: number, label: string) => {
  const rpcClient = new RpcClient();
  try {
    log.info('importAddress');
    return rpcClient.importAddress(address, label);
  } catch (err) {
    log.error(`Got error in importAddress: ${err}`);
    throw err;
  }
};

export const handleFetchTokens = async () => {
  const rpcClient = new RpcClient();
  return await fetchTokenDataWithPagination(
    0,
    LIST_TOKEN_PAGE_SIZE,
    rpcClient.listTokens
  );
};

export const handleFetchToken = async (id: string) => {
  const rpcClient = new RpcClient();
  const tokens = await rpcClient.tokenInfo(id);
  if (isEmpty(tokens)) {
    return {};
  }
  const transformedData = Object.keys(tokens).map((item) => ({
    hash: item,
    ...tokens[item],
  }));

  return transformedData[0];
};

export const handleAccountFetchTokens = async (ownerAddress) => {
  const rpcClient = new RpcClient();
  const tokens = await rpcClient.getAccount(ownerAddress);
  if (isEmpty(tokens)) {
    return [];
  }

  const transformedData = Object.keys(tokens).map(async (item) => {
    let data = {};
    async function getData() {
      data = await handleFetchToken(item);
    }
    await getData();
    return {
      ...data,
      amount: tokens[item],
    };
  });

  return await Promise.all(transformedData);
};

export const handleFetchAccounts = async () => {
  const rpcClient = new RpcClient();
  const accounts = await fetchAccountsDataWithPagination(
    '',
    LIST_ACCOUNTS_PAGE_SIZE,
    rpcClient.listAccounts
  );

  const tokensData = accounts.map(async (account) => {
    const addressInfo = await getAddressInfo(account.owner.addresses[0]);

    if (addressInfo.ismine && !addressInfo.iswatchonly) {
      return {
        amount: account.amount,
        address: account.owner.addresses[0],
      };
    }
  });

  const resolvedData: any = _.compact(await Promise.all(tokensData));

  const transformedData: any =
    resolvedData &&
    resolvedData.map(async (item) => {
      let data = {};
      async function getData() {
        data = await handleFetchToken(Object.keys(item.amount)[0]);
      }
      await getData();
      return {
        ...data,
        amount: item.amount[Object.keys(item.amount)[0]],
        address: item.address,
      };
    });

  const transformedDataResolved: any = await Promise.all(transformedData);

  const result: any = [];
  Array.from(new Set(transformedDataResolved.map((x) => x.hash))).forEach(
    (x: any) => {
      let maxAmountAddress;
      let maxAmount = 0;
      result.push(
        transformedDataResolved
          .filter((y) => y.hash === x)
          .reduce((output, item) => {
            if (item.amount > maxAmount) {
              maxAmount = item.amount;
              maxAmountAddress = item.address;
            }
            const val = output.amount === undefined ? 0 : output.amount;
            output = { ...item };
            output.amount = item.amount + val;
            output.address = maxAmountAddress;
            return output;
          }, {})
      );
    }
  );

  return result;
};

export const accountToAccountConversion = async (
  addressList: PaymentRequestLedger[],
  toAddress: string,
  hash: string
) => {
  log.info('accountToAccountConversion ledger');
  const rpcClient = new RpcClient();
  const amounts = {};
  for (const obj of addressList) {
    const tokenSymbol = obj.unit;
    if (tokenSymbol === hash && obj.address !== toAddress) {
      amounts[obj.address] = DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT;
    }
  }

  if (!isEmpty(amounts)) {
    const refreshUtxoTxId = await rpcClient.sendMany(amounts);
    await getTransactionInfo(refreshUtxoTxId);
  }

  const accountToAccountTxHashes: any[] = [];
  let amountTransfered = new BigNumber(0);
  for (const obj of addressList) {
    const tokenSymbol = obj.unit;
    const amount = Number(obj.amount).toFixed(8);

    if (tokenSymbol === hash && obj.address !== toAddress) {
      const data = {
        from: fromAddress,
        to: {
          [toAddress]: { '0': amount },
        },
      };
      const ipcRenderer = ipcRendererFunc();
      const res = await ipcRenderer.sendSync(
        CUSTOM_TX_LEDGER,
        cutxo,
        toAddress,
        amount,
        data,
        keyIndex
      );
      if (res.success) {
        const txId = rpcClient.sendRawTransaction(res.data.tx);
        const promiseHash = getTransactionInfo(txId);
        accountToAccountTxHashes.push(promiseHash);
        amountTransfered = amountTransfered.plus(new BigNumber(amount));
      } else {
        log.error(`accountToAccountConversion error: ${res.message}`);
        throw new Error(res.message);
      }
    }
  }
  await Promise.all(accountToAccountTxHashes);
  return amountTransfered;
};

export const initialIsShowingInformation = () => {
  log.info(`localStorage: ${JSON.stringify(localStorage)}`);
  return PersistentStore.get(IS_SHOWING_INFORMATION_LEDGER) !== 'false';
};

export const setIsShowingInformation = (isViewInformation: boolean) => {
  PersistentStore.set(IS_SHOWING_INFORMATION_LEDGER, isViewInformation);
};

export const getAddressInfo = (address) => {
  const rpcClient = new RpcClient();
  return rpcClient.getaddressInfo(address);
};

export const getBlockChainInfo = () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBlockChainInfo();
};

export const setHdSeed = (hdSeed: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.setHdSeed(hdSeed);
};

export const importPrivKey = (privKey: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.importPrivKey(privKey);
};

export const getReceivedByAddress = (address: string) => {
  const rpcClient = new RpcClient();
  return rpcClient.getReceivedByAddress(address);
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const getMnemonic = () => {
  return getMnemonicObject();
};

export const getRandomWords = () => {
  return getRandomWordObject();
};

export const getMixWords = (mnemonicObject: any, randomWordObject: any) => {
  return getMixWordsObject(mnemonicObject, randomWordObject);
};

export const getPubKeyLedger = async (keyIndex: number, format?: string) => {
  const ipcRenderer = ipcRendererFunc();
  return ipcRenderer.sendSync(GET_LEDGER_DEFI_PUB_KEY, keyIndex, format);
};

export const connectLedger = async () => {
  const ipcRenderer = ipcRendererFunc();
  return ipcRenderer.sendSync(CONNECT_LEDGER);
};

export const getListDevicesLedger = async () => {
  const ipcRenderer = ipcRendererFunc();
  return ipcRenderer.sendSync(LIST_DEVICES_LEDGER);
};

export const getBackupIndexesLedger = async () => {
  const ipcRenderer = ipcRendererFunc();
  return ipcRenderer.sendSync(BACKUP_IDXS_LEDGER);
}
