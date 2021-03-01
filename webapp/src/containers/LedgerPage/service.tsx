// @ts-nocheck
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import _ from 'lodash';
import { CustomTx } from 'bitcore-lib-dfi';
import * as log from '@/utils/electronLogger';
import { ipcRendererFunc } from '@/utils/isElectron';
import RpcClient from '@/utils/rpc-client';
import {
  BACKUP_IDXS_LEDGER,
  CONNECT_LEDGER,
  CUSTOM_TX_LEDGER,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  GET_LEDGER_DEFI_PUB_KEY,
  IS_SHOWING_INFORMATION_LEDGER,
  LIST_DEVICES_LEDGER,
  LIST_TOKEN_PAGE_SIZE,
} from '@/constants';
import PersistentStore from '@/utils/persistentStore';
import {
  fetchTokenDataWithPagination,
  getAccountsLedger,
  getErrorMessage,
  getMixWordsObject,
  getMnemonicObject,
  getRandomWordObject,
  handelGetPaymentRequestLedger,
  handleLocalStorageNameLedger,
  utxoLedger,
} from '@/utils/utility';
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

export const importAddresses = async (networkName: string) => {
  const paymentRequests = handelGetPaymentRequestLedger(networkName);
  const rpcClient = new RpcClient();
  const queryImportPubKey = paymentRequests.map((paymentRequest) =>
    rpcClient.importPubKey(paymentRequest.pubkey, paymentRequest.label)
  );
  const queryImportAddress = paymentRequests.map((paymentRequest) =>
    rpcClient.importAddress(paymentRequest.address, paymentRequest.label)
  );
  await Promise.all(queryImportPubKey);
  await Promise.all(queryImportAddress);
};

export const loadWallet = async (walletName: string) => {
  const rpcClient = new RpcClient();
  if (walletName === '') {
    await rpcClient.unloadWallet('ledger');
    await rpcClient.loadWallet('');
  } else {
    try {
      await rpcClient.unloadWallet('');
      await rpcClient.loadWallet('ledger');
    } catch (e) {
      await rpcClient.createWallet('ledger');
      await rpcClient.loadWallet('ledger');
    }
  }
};

export const handelFetchWalletTxns = async (
  pageNo: number,
  pageSize: number,
  networkName: string
) => {
  const rpcClient = new RpcClient();
  const addresses = handelGetPaymentRequestLedger(networkName).map(
    (paymentRequest) => paymentRequest.address
  );
  let walletTxnCount = await rpcClient.getWalletTxnCount();
  let walletTxns = await rpcClient.getWalletTxns(0, walletTxnCount, true);
  walletTxns = walletTxns.filter((tx) => tx.involvesWatchonly).reverse();
  walletTxns = walletTxns.filter((tx) => {
    return !(tx.category === 'send' && addresses.includes(tx.address));
  });
  walletTxns = uniqBy(walletTxns, 'txnId');
  walletTxnCount = walletTxns.length;
  walletTxns.splice(
    pageSize * pageNo - 1,
    walletTxnCount -
      (pageSize * pageNo - 1 === pageSize ? pageSize : pageSize * pageNo - 1)
  );
  return { walletTxns, walletTxnCount };
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
  const rpcClient = new RpcClient();
  const data = await rpcClient.getBalances();
  return data.watchonly.trusted;
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
  fromAddress: string | null,
  toAddress: string,
  amount: number,
  keyIndex: number,
  type: 'legacy' | 'p2sh' = 'p2sh'
) => {
  log.info('Service accounttoaccount is started');
  try {
    const rpcClient = new RpcClient();
    const { utxo, amountUtxo } = await utxoLedger(fromAddress, amount);
    const ipcRenderer = ipcRendererFunc();
    const res = await ipcRenderer.sendSync('sign-transaction-ledger', {
      utxo,
      address: toAddress,
      amount,
      fromAddress,
      keyIndex,
      feeRate: amountUtxo - amount - 0.01,
      type,
    });
    if (res.success) {
      const hashTx = await rpcClient.sendRawTransaction(res.data.tx);
      return hashTx;
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    log.error(`Got error in accounttoaccount: ${err}`);
    throw new Error(getErrorMessage(err));
  }
};

export const sendTokensToAddress = async (
  fromAddress: string | null,
  toAddress: string,
  amount: number,
  hash: string,
  keyIndex: number,
) => {
  try {
    const rpcClient = new RpcClient();
    const ipcRenderer = ipcRendererFunc();
    const { utxo, amountUtxo } = await utxoLedger(fromAddress, amount);
    const data = {
      txType: CustomTx.customTxType.anyAccountsToAccounts,
      customData: {
        from: [{ [fromAddress]: {'0': { token: hash, balance: amount }}}],
        to: [{ [toAddress]: { '0': { token: hash, balance: amount }}}],
      }
    };
    const res = await ipcRenderer.sendSync(
      CUSTOM_TX_LEDGER,
      {
        utxo: [utxo[0]],
        address: fromAddress,
        data,
        keyIndex
      }
    );
    if (res.success) {
      return await rpcClient.sendRawTransaction(res.data.tx);
    } else {
      throw new Error(res.message);
    }
  } catch (err) {
    log.error(`Got error in sendTokensToAddress: ${err}`);
    throw new Error(getErrorMessage(err));
  }
}

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

export const importPubKey = async (
  pubKey: string,
  keyIndex: number,
  label: string
) => {
  const rpcClient = new RpcClient();
  try {
    log.info('importPubKey');
    const res = await rpcClient.importPubKey(pubKey, label);
    log.info(`Result importPubKey: ${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    log.error(`Got error in importPubKey: ${err.message}`);
    throw err;
  }
};

export const importAddress = async (
  address: string,
  keyIndex: number,
  label: string
) => {
  const rpcClient = new RpcClient();
  try {
    log.info('importAddress');
    const res = rpcClient.importAddress(address, label);
    log.info(`Result importAddress: ${JSON.stringify(res)}`);
    return res;
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
  const accounts = await getAccountsLedger();
  const tokensData = accounts.map(async (account) => {
    return {
      amount: account.amount,
      address: account.owner.addresses[0],
    };
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
};
