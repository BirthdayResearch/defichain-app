import * as log from '../../utils/electronLogger';
import RpcClient from '../../utils/rpc-client';
import {
  PAYMENT_REQUEST,
  BLOCKCHAIN_INFO_CHAIN_TEST,
  LIST_TOKEN_PAGE_SIZE,
  LIST_ACCOUNTS_PAGE_SIZE,
  RECIEVE_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  TX_TYPES,
  AMOUNT_SEPARATOR,
  DFI_SYMBOL,
} from '../../constants';
import PersistentStore from '../../utils/persistentStore';
import { I18n } from 'react-redux-i18n';
import { IToken } from 'src/utils/interfaces';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import compact from 'lodash/compact';
import { difference } from 'lodash';
import {
  fetchAccountsDataWithPagination,
  fetchTokenDataWithPagination,
  getAddressAndAmountListForAccount,
  getHighestAmountAddressForSymbol,
  getBalanceForSymbol,
  getErrorMessage,
  handleFetchTokenBalanceList,
  hdWalletCheck,
  getNetworkType,
  getNetworkInfo,
} from '../../utils/utility';
import {
  getMixWordsObject,
  getMnemonicObject,
  getRandomWordObject,
} from '../../utils/utility';
import BigNumber from 'bignumber.js';
import { getNetwork } from './saga';
import { element } from 'prop-types';
import { includes } from 'lodash';
import {
  ON_FILE_SELECT_REQUEST,
  ON_WALLET_RESTORE_VIA_BACKUP,
  ON_WRITE_CONFIG_REQUEST,
  ON_FILE_EXIST_CHECK,
} from '../../../../typings/ipcEvents';
import { ipcRendererFunc } from '../../utils/isElectron';
import { backupWallet, updateWalletMap } from '../../app/service';
import { IPCResponseModel } from '@defi_types/common';

const handleLocalStorageName = (networkName) => {
  if (networkName === BLOCKCHAIN_INFO_CHAIN_TEST) {
    return `${PAYMENT_REQUEST}-${BLOCKCHAIN_INFO_CHAIN_TEST}`.toLowerCase();
  }
  return PAYMENT_REQUEST;
};

export const handleGetPaymentRequest = (networkName) => {
  return JSON.parse(
    PersistentStore.get(handleLocalStorageName(networkName)) || '[]'
  );
};

export const handelAddReceiveTxns = async (data, networkName) => {
  const localStorageName = handleLocalStorageName(networkName);
  const initialData = JSON.parse(PersistentStore.get(localStorageName) || '[]');
  data.hdSeed = await hdWalletCheck(data.address);
  const paymentData = [data, ...initialData];
  if (!data.automaticallyGenerateNewAddress) {
    const rpcClient = new RpcClient();
    await rpcClient.setLabel(data.address, data.label);
  }
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

export const getInitialTokenInfo = () => {
  return JSON.parse(PersistentStore.get('tokenInfo') || '{}');
};

export const handleAddToken = (tokenData) => {
  const networkType = getNetworkType();
  const initialData = getInitialTokenInfo();
  const keyData = [...(initialData[networkType] || []), tokenData];
  initialData[networkType] = keyData;
  PersistentStore.set('tokenInfo', initialData);
  return initialData[networkType];
};

export const handleRemoveToken = (tokenData) => {
  const networkType = getNetworkType();
  const initialData = getInitialTokenInfo();
  const keyData = (initialData[networkType] || []).filter(
    (data) => data.symbol !== tokenData.symbol
  );
  initialData[networkType] = keyData;
  PersistentStore.set('tokenInfo', initialData);
  return initialData[networkType];
};

export const handleCheckToken = (tokenData) => {
  const initialTokenData = getWalletToken();
  const data = initialTokenData.find(
    (data) => data.symbol === tokenData.symbol
  );
  if (data) {
    return !!Number(tokenData.amount);
  }
  return true;
};

export const getWalletToken = () => {
  const networkType = getNetworkType();
  const initialData = getInitialTokenInfo();
  return initialData[networkType] || [];
};

export const updateWalletToken = (clone) => {
  const allTokenArray = clone.map((token) => token.symbolKey);
  if (allTokenArray.length !== [...new Set(allTokenArray)].length) {
    const duplicateArray = allTokenArray.filter(
      (value, index) => allTokenArray.indexOf(value) === index
    );
    const networkType = getNetworkType();
    const initialData = getInitialTokenInfo();
    const filteredData = initialData[networkType].filter(
      (element) => !duplicateArray.includes(element.symbolKey)
    );
    initialData[networkType] = filteredData;
    PersistentStore.set('tokenInfo', initialData);
  }
};

export const getTokenForWalletDropDown = (totalTokenData, tokenData) => {
  const existingTokenArray = totalTokenData.map((value) => value.symbolKey);
  const filteredTokenMap = new Map<string, any>();
  tokenData.forEach((value, key) => {
    if (!existingTokenArray.includes(key)) {
      filteredTokenMap.set(key, value);
    }
  });
  return filteredTokenMap;
};

export const isWalletDropdown = (totalTokenData, tokenData) => {
  const existingTokenArray = totalTokenData.map((value) => value.symbolKey);
  let tokenDataArray: any[] = [];
  tokenData.forEach((value) => {
    tokenDataArray = [...tokenDataArray, value.symbolKey];
  });
  const differenceArray = difference(existingTokenArray, tokenData);
  return differenceArray.length > 1;
};

export const getVerifiedTokens = (tokens, accountTokens) => {
  const accountTokenSymbol = accountTokens.map((t) => t.symbolKey);
  const verifiedTokens = cloneDeep<IToken[]>(tokens || []).filter((t) => {
    t.amount = 0;
    return t.isDAT && !t.isLPS && !accountTokenSymbol.includes(t.symbolKey);
  });
  return verifiedTokens;
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
  const regularDFI = await rpcClient.getBalance();
  return new BigNumber(regularDFI);
};

export const handleFetchAccountDFI = async () => {
  const accountTokens = await handleFetchAccounts();
  const DFIToken = accountTokens.find((token) => token.hash === DFI_SYMBOL);
  const tempDFI = DFIToken && DFIToken.amount;
  const accountDFI = tempDFI || 0;
  return new BigNumber(accountDFI);
};

export const handleFetchWalletBalance = async () => {
  const regularDFI = await handleFetchRegularDFI();
  const accountDFI = await handleFetchAccountDFI();
  return new BigNumber(regularDFI).plus(accountDFI).toFixed(8);
};

export const handleFetchPendingBalance = async (): Promise<number> => {
  const rpcClient = new RpcClient();
  return await rpcClient.getPendingBalance();
};

export const getTransactionInfo = async (txId): Promise<any> => {
  const rpcClient = new RpcClient();
  const txInfo = await rpcClient.getTransaction(txId);
  if (!txInfo.blockhash && txInfo.confirmations === 0) {
    await sleep(1000);
    await getTransactionInfo(txId);
  } else {
    return;
  }
};

export const sendToAddress = async (
  toAddress: string,
  amount: BigNumber,
  subtractfeefromamount: boolean = false
) => {
  const rpcClient = new RpcClient();
  const regularDFI = await handleFetchRegularDFI();

  log.info({
    toAddress,
    sendAmount: amount,
    subtractfeefromamount,
    utxoDFI: regularDFI,
  });
  if (amount.lte(regularDFI)) {
    try {
      const data = await rpcClient.sendToAddress(
        toAddress,
        amount,
        subtractfeefromamount
      );
      log.info(`sent dfi successfull=======${data}`);
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  } else {
    try {
      const accountBalance = await handleFetchAccountDFI();
      const addressesList = await getAddressAndAmountListForAccount();
      const {
        address: fromAddress,
        amount: maxAmount,
      } = getHighestAmountAddressForSymbol(DFI_SYMBOL, addressesList);
      log.info({ address: fromAddress, maxAmount, accountBalance });

      //* Consolidate tokens to a single address
      if (amount.gt(maxAmount)) {
        try {
          const txHash = await sendTokensToAddress(
            fromAddress,
            `${accountBalance.toFixed(8)}@DFI`
          );
          log.info({ accountBalance, sendTokenTxHash: txHash });
          await getTransactionInfo(txHash);
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          log.error(errorMessage, `sendTokensToAddress`);
        }
      }

      const balance = await getBalanceForSymbol(fromAddress, DFI_SYMBOL);
      log.info({ consolidateAccountBalance: balance });

      const hash = await rpcClient.accountToUtxos(
        fromAddress,
        fromAddress,
        `${balance}@DFI`
      );
      log.info(`account to utxo tx id=======${hash}`);
      await getTransactionInfo(hash);
      const regularDFIAfterTxFee = await handleFetchRegularDFI();
      log.info({ regularDFIAfterTxFee });
      if (new BigNumber(regularDFIAfterTxFee).lt(amount)) {
        throw new Error('Insufficient DFI in account');
      } else if (new BigNumber(regularDFIAfterTxFee).isEqualTo(amount)) {
        return await sendToAddress(toAddress, amount, true);
      } else {
        return await sendToAddress(toAddress, amount, false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
};

export const handleFallbackSendToken = async (
  sendAddress: string,
  sendAmount: BigNumber,
  hash: string
): Promise<string> => {
  try {
    const addressesList = await getAddressAndAmountListForAccount();
    const {
      address: fromAddress,
      amount: maxAmount,
    } = await getHighestAmountAddressForSymbol(hash, addressesList, sendAmount);
    if (new BigNumber(maxAmount).gte(sendAmount)) {
      try {
        const txHash = await accountToAccount(
          fromAddress,
          sendAddress,
          `${sendAmount.toFixed(8)}@${hash}`
        );
        log.info({ handleFallbackSendToken: txHash });
        return txHash;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        log.error(errorMessage, `handleFallbackSendToken`);
        throw new Error(
          `Got error in accountToAccount - handleFallbackSendToken: ${errorMessage}`
        );
      }
    } else {
      throw new Error('Insufficient token in account');
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    log.error(`${errorMessage}`, 'handleFallbackSendToken');
    throw new Error(`Got error in handleFallbackSendToken: ${errorMessage}`);
  }
};

export const accountToAccount = async (
  fromAddress: string | null,
  toAddress: string,
  amount: string
) => {
  try {
    const rpcClient = new RpcClient();

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

export const sendTokensToAddress = async (
  toAddress: string,
  amount: string
) => {
  try {
    const rpcClient = new RpcClient();
    const data = await rpcClient.sendTokensToAddress(toAddress, amount);
    return data;
  } catch (err) {
    log.error(`Got error in sendTokensToAddress: ${err}`);
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

export const handleFetchAccountHistoryCount = async (no_rewards, token) => {
  const rpcClient = new RpcClient();
  const count = await rpcClient.accountHistoryCount(no_rewards, token);
  return count;
};

export const handleFetchAccounts = async () => {
  const rpcClient = new RpcClient();
  const accounts = await fetchAccountsDataWithPagination(
    '',
    LIST_ACCOUNTS_PAGE_SIZE,
    rpcClient.listAccounts
  );

  const tokensData = accounts.map(async (account) => {
    return {
      amount: account.amount,
      address: account.owner.addresses[0],
    };
  });

  const resolvedData: any = compact(await Promise.all(tokensData));

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
  token: string;
  no_rewards?: boolean;
  cancelToken?: string;
  blockHeight?: number;
}) => {
  const rpcClient = new RpcClient(query.cancelToken);
  return rpcClient.getListAccountHistory(query);
};

export const prepareTxDataRows = (data: any[]) => {
  return data.map((item) => {
    const amounts = item.amounts.map((ele) => ({
      value: new BigNumber(
        ele.slice(0, ele.indexOf(AMOUNT_SEPARATOR))
      ).toFixed(),
      symbolKey: ele.slice(ele.indexOf(AMOUNT_SEPARATOR) + 1),
    }));
    const { category, isValid } = validTrx(item);
    return {
      ...item,
      category,
      isValid,
      amounts: orderBy(amounts, 'value', 'desc'),
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
  const tokenBalance = await handleFetchTokenBalanceList();
  return (
    new BigNumber(balance).gt(0) ||
    new BigNumber(txCount).gt(0) ||
    tokenBalance.length > 0
  );
};

export const startRestoreViaBackup = async (network: string) => {
  try {
    const ipcRenderer = ipcRendererFunc();
    const resp = ipcRenderer.sendSync(ON_WALLET_RESTORE_VIA_BACKUP, network);
    if (resp?.success && resp?.data) {
      updateWalletMap(resp.data);
    }
    return resp;
  } catch (error) {
    log.error(error, 'handleRestoreWalletViaBackup');
    return {
      success: false,
      message: error?.message,
    };
  }
};

export const checkRestoreRecentIfExisting = async (path: string) => {
  try {
    const ipcRenderer = ipcRendererFunc();
    const resp = ipcRenderer.sendSync(ON_FILE_EXIST_CHECK, path);
    if (!resp?.success) {
      updateWalletMap(path, true);
    }
    return resp;
  } catch (error) {
    log.error(error, 'checkRestoreIfExisting');
    return {
      success: false,
      message: error?.message,
    };
  }
};

export const startRestoreViaRecent = async (path: string, network: string) => {
  try {
    const ipcRenderer = ipcRendererFunc();
    const resp = ipcRenderer.sendSync(ON_WRITE_CONFIG_REQUEST, path, network);
    if (resp?.success) {
      updateWalletMap(path);
    }
    return resp;
  } catch (error) {
    log.error(error, 'startRestoreViaRecent');
    return {
      success: false,
      message: error?.message,
    };
  }
};

export const startBackupViaExitModal = async () => {
  try {
    const ipcRenderer = ipcRendererFunc();
    const resp = ipcRenderer.sendSync(ON_FILE_SELECT_REQUEST);
    if (resp?.success) {
      await backupWallet(resp?.data?.paths);
    }
    return resp;
  } catch (error) {
    log.error(error, 'startRestoreViaRecent');
    return {
      success: false,
      message: error?.message,
    };
  }
};

export const createNewWallet = async (
  passphrase: string,
  network: string
): Promise<IPCResponseModel<string>> => {
  try {
    const ipcRenderer = ipcRendererFunc();
    const resp = ipcRenderer.sendSync(ON_FILE_SELECT_REQUEST, false, true);
    const walletDir = resp?.data?.paths;
    const walletPath = resp?.data?.walletPath;
    if (resp?.success && walletPath) {
      const rpcClient = new RpcClient();
      const createWalletResp = await rpcClient.createWallet(
        walletDir,
        passphrase
      );
      if (createWalletResp.warning == null || createWalletResp.warning == '') {
        return startRestoreViaRecent(walletPath, network);
      } else {
        throw new Error(createWalletResp.warning);
      }
    }
    return resp;
  } catch (error) {
    log.error(error, 'createNewWallet');
    return {
      success: false,
      message: error?.message,
    };
  }
};
