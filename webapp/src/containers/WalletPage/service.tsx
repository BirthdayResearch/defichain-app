import * as log from '../../utils/electronLogger';
import RpcClient from '../../utils/rpc-client';
import {
  PAYMENT_REQUEST,
  BLOCKCHAIN_INFO_CHAIN_TEST,
  DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
  LIST_TOKEN_PAGE_SIZE,
  LIST_ACCOUNTS_PAGE_SIZE,
  RECIEVE_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  TX_TYPES,
} from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { I18n } from 'react-redux-i18n';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import {
  fetchAccountsDataWithPagination,
  fetchTokenDataWithPagination,
  getAddressAndAmountListForAccount,
  getAddressForSymbol,
  getBalanceForSymbol,
  getErrorMessage,
  getSmallerAmount,
  handleAccountToAccountConversion,
} from '../../utils/utility';
import {
  getMixWordsObject,
  getMnemonicObject,
  getRandomWordObject,
} from '../../utils/utility';
import BigNumber from 'bignumber.js';

const handleLocalStorageName = (networkName) => {
  if (networkName === BLOCKCHAIN_INFO_CHAIN_TEST) {
    return `${PAYMENT_REQUEST}-${BLOCKCHAIN_INFO_CHAIN_TEST}`.toLowerCase();
  }
  return PAYMENT_REQUEST;
};

export const handelGetPaymentRequest = (networkName) => {
  return JSON.parse(
    PersistentStore.get(handleLocalStorageName(networkName)) || '[]'
  );
};

export const handelAddReceiveTxns = (data, networkName) => {
  const localStorageName = handleLocalStorageName(networkName);
  const initialData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  const paymentData = [data, ...initialData];
  PersistentStore.set(localStorageName, paymentData);
  return paymentData;
};

export const handelRemoveReceiveTxns = (id, networkName) => {
  const localStorageName = handleLocalStorageName(networkName);
  const initialData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  const paymentData = initialData.filter(
    (ele) => ele.id && ele.id.toString() !== id.toString()
  );
  PersistentStore.set(localStorageName, paymentData);
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
  const walletBalance = await handleFetchWalletBalance();
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

export const handleFetchRegularDFI = async () => {
  const rpcClient = new RpcClient();
  return rpcClient.getBalance();
};

export const handleFetchAccountDFI = async () => {
  const accountTokens = await handleFetchAccounts();
  const DFIToken = accountTokens.find((token) => token.hash === '0');
  const tempDFI = DFIToken && DFIToken.amount;
  const accountDFI = tempDFI || 0;
  return accountDFI;
};

export const handleFetchWalletBalance = async () => {
  const regularDFI = await handleFetchRegularDFI();
  const accountDFI = await handleFetchAccountDFI();
  return (regularDFI + accountDFI).toFixed(8);
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
  let accountToAccountAmount = new BigNumber(0);
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
      const addressesList = await getAddressAndAmountListForAccount();
      const {
        address: fromAddress,
        amount: maxAmount,
      } = await getAddressForSymbol('0', addressesList);
      if (Number(amount) > maxAmount) {
        accountToAccountAmount = await handleAccountToAccountConversion(
          addressesList,
          fromAddress,
          '0'
        );
      }
      const txId = await rpcClient.sendToAddress(
        fromAddress,
        Number((10 / 100) * amount).toFixed(8),
        subtractfeefromamount
      );
      await getTransactionInfo(txId);
      const balance = await getBalanceForSymbol(fromAddress, '0');
      const finalBalance = getSmallerAmount(
        balance,
        accountToAccountAmount.plus(maxAmount).toFixed(4)
      );
      const hash = await rpcClient.accountToUtxos(
        fromAddress,
        fromAddress,
        `${finalBalance.toFixed(2)}@DFI`
      );
      await getTransactionInfo(hash);
      const regularDFIAfterTxFee = await handleFetchRegularDFI();
      if (regularDFIAfterTxFee < amount) {
        throw new Error('Insufficient DFI in account');
      } else if (regularDFIAfterTxFee === amount) {
        return await sendToAddress(toAddress, amount, true);
      } else {
        return await sendToAddress(toAddress, amount, false);
      }
    } catch (error) {
      log.error(`Got error in sendToAddress: ${error}`);
      throw new Error(I18n.t('containers.wallet.sendPage.sendFailed'));
    }
  }
};

export const accountToAccount = async (
  fromAddress: string | null,
  toAddress: string,
  amount: string
) => {
  try {
    const rpcClient = new RpcClient();
    const txId = await rpcClient.sendToAddress(
      fromAddress,
      DEFAULT_DFI_FOR_ACCOUNT_TO_ACCOUNT,
      true
    );
    await getTransactionInfo(txId);
    const data = await rpcClient.accountToAccount(
      fromAddress,
      toAddress,
      amount
    );
    return data;
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
    addressTypeChecked && params.push('legacy');
    return rpcClient.getNewAddress(label, ...params);
  } catch (err) {
    log.error(`Got error in getNewAddress: ${err}`);
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
            const val = output['amount'] === undefined ? 0 : output['amount'];
            output = { ...item };
            output['amount'] = item.amount + val;
            output['address'] = maxAmountAddress;
            return output;
          }, {})
      );
    }
  );

  return result;
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

export const getListAccountHistory = (query: {
  limit: number;
  blockHeight?: number;
  no_rewards?: boolean;
  token: string;
}) => {
  const rpcClient = new RpcClient();
  return rpcClient.getListAccountHistory(query);
};

export const prepareTxDataRows = (data: any[]) => {
  return data.map((item) => {
    const amounts = item.amounts.map((ele) => ({
      value: new BigNumber(ele.slice(0, ele.indexOf('@'))).toNumber(),
      symbolKey: ele.slice(ele.indexOf('@') + 1),
    }));
    const { category, isValid } = validTrx(item);
    return {
      ...item,
      category,
      isValid,
      amounts: sortBy(amounts, ['value']).reverse(),
    };
  });
};

export const handleBlockData = async (blockHeight: number) => {
  const rpcClient = new RpcClient();
  const blockHash = await rpcClient.getBlockHash(blockHeight);
  const block = await rpcClient.getBlock(blockHash, 1);
  return block;
};

const validTrx = (item) => {
  const SendReceiveValidTxTypeArray = [
    TX_TYPES.UtxosToAccount,
    TX_TYPES.AccountToUtxos,
    TX_TYPES.AccountToAccount,
  ];
  let isValid =
    item.type === TX_TYPES.NonTxRewards || item.type === TX_TYPES.PoolSwap;
  let category = item.type;
  if (!isValid) {
    isValid = SendReceiveValidTxTypeArray.indexOf(item.type) !== 1;
    if (isValid) {
      category = new BigNumber(item.amounts[0].value).gte(0)
        ? RECIEVE_CATEGORY_LABEL
        : SENT_CATEGORY_LABEL;
    }
  }
  return {
    category,
    isValid,
  };
};

export const handleRestartCriteria = async () => {
  const rpcClient = new RpcClient();
  const balance = await rpcClient.getBalance();
  const txCount = await rpcClient.getWalletTxnCount();
  const tokenBalance = await rpcClient.getTokenBalances();
  return (
    new BigNumber(balance).gt(0) ||
    new BigNumber(txCount).gt(0) ||
    tokenBalance.length > 0
  );
};
