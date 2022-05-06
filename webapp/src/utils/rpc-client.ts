import axios from 'axios';
import store from '../app/rootStore';
import {
  RPC_V,
  MAX_TXN_SIZE,
  MAXIMUM_COUNT,
  MAXIMUM_AMOUNT,
  FEE_RATE,
  DEFAULT_MAXIMUM_AMOUNT,
  DEFAULT_MAXIMUM_COUNT,
  DEFAULT_FEE_RATE,
  MASTERNODE_PARAMS_INCLUDE_FROM_START,
  MASTERNODE_PARAMS_MASTERNODE_LIMIT,
  LP_DAILY_DFI_REWARD,
  DEFAULT_BTC_FEE,
} from './../constants';
import * as methodNames from '@defi_types/rpcMethods';
import { rpcResponseSchemaMap } from './schemas/rpcMethodSchemaMapping';
import {
  ITxn,
  IBlock,
  IParseTxn,
  IMasternodeCreatorInfo,
  ITokenCreatorInfo,
  ITokenUpdatorInfo,
  ITokenMintInfo,
} from './interfaces';
import {
  validateSchema,
  getTxnDetails,
  getBlockDetails,
  parseTxn,
  getRpcMethodName,
  getParams,
  getTxnSize,
} from './utility';
import { getFullRawTxInfo } from './transactionProcessor';
import { construct } from './cutxo';
import PersistentStore from './persistentStore';
import { BigNumber } from 'bignumber.js';
import {
  CreateNewWalletModel,
  ListUnspentModel,
  PeerInfoModel,
  SPVSendModel,
  WalletInfo,
} from '../constants/rpcModel';
import { TimeoutLockEnum } from '../containers/SettingsPage/types';
import { PaymentRequestModel } from '@defi_types/rpcConfig';
import lruCache from './lruCache';

export default class RpcClient {
  client: any;

  constructor(cancelToken?) {
    const state = store.getState();
    const { rpcuser, rpcpassword, rpcconnect } = state.app.rpcConfig;
    const activeNetwork = state.app.rpcConfig[state.app.activeNetwork];
    const rpcport = activeNetwork?.rpcport;

    if (!rpcuser || !rpcpassword || !rpcconnect || !rpcport) {
      throw new Error('Invalid configuration');
    }
    this.client = axios.create({
      baseURL: `http://${rpcconnect}:${rpcport}`,
      auth: {
        username: rpcuser,
        password: rpcpassword,
      },
      cancelToken: cancelToken,
    });
  }

  call = async (path: string, method: string, params: any[] = []) => {
    return await this.client.post(path, {
      jsonrpc: RPC_V,
      id: Math.random().toString().substr(2),
      method,
      params,
    });
  };

  getBlockHash = async (blockNumber: number): Promise<string> => {
    const cacheKey = `rpc.getBlockHash.${blockNumber}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_BLOCK_HASH, [
        blockNumber,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getBlock = async (blockHash: string, verbose: number): Promise<IBlock> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getBlock.${bestBlockHash}.${blockHash}.${verbose}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_BLOCK, [
        blockHash,
        verbose,
      ]);
      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.GET_BLOCK),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.GET_BLOCK
          }: ${JSON.stringify(data)}`
        );
      }
      const blockDetails = getBlockDetails(data.result);
      lruCache.put(cacheKey, blockDetails);
      return blockDetails;
    }
    return result;
  };

  getWalletInfo = async (): Promise<WalletInfo> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getWalletInfo.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_WALLET_INFO, []);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getRawTransactionOfBlock = async (
    txid: string,
    verbose: boolean,
    blockHash: string
  ): Promise<IParseTxn> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getRawTransactionOfBlock.${bestBlockHash}.${txid}.${verbose}.${blockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_RAW_TRANSACTION, [
        txid,
        verbose,
        blockHash,
      ]);

      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.GET_RAW_TRANSACTION),
        data
      );

      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.GET_RAW_TRANSACTION
          }: ${JSON.stringify(data)}`
        );
      }

      const fullRawTx = getFullRawTxInfo(data.result);
      const parsedTxn = parseTxn(fullRawTx);
      lruCache.put(cacheKey, parsedTxn);
      return parsedTxn;
    }
    return result;
  };

  getLatestSyncedBlock = async (): Promise<number> => {
    const { data } = await this.call('/', methodNames.GET_BLOCK_COUNT, []);
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.GET_BLOCK_COUNT),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.GET_BLOCK_COUNT
        }: ${JSON.stringify(data)}`
      );
    }
    return data.result;
  };

  getPeerInfo = async (
    shouldAllowEmptyPeers?: boolean
  ): Promise<PeerInfoModel[]> => {
    const { data } = await this.call('/', methodNames.GET_PEER_INFO, []);
    const schema = rpcResponseSchemaMap.get(methodNames.GET_PEER_INFO) as any;
    if (shouldAllowEmptyPeers && schema?.properties?.result?.minItems) {
      schema.properties.result.minItems = 0;
    }
    const isValid = validateSchema(schema, data);
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.GET_PEER_INFO
        }: ${JSON.stringify(data)}`
      );
    }
    return data.result;
  };

  getBalance = async (): Promise<number> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getBalance.wallet.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_BALANCE, ['*']);
      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.GET_BALANCE),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.GET_BALANCE
          }: ${JSON.stringify(data)}`
        );
      }
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getPendingBalance = async (): Promise<number> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getPendingBalance.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_BALANCES, []);
      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.GET_BALANCES),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.GET_BALANCES
          }: ${JSON.stringify(data)}`
        );
      }
      lruCache.put(cacheKey, data.result.mine.untrusted_pending);
      return data.result.mine.untrusted_pending;
    }
    return result;
  };

  getNewAddress = async (label, addressType = ''): Promise<string> => {
    const params = [label];
    if (!!addressType && addressType.length > 0) {
      params.push(addressType);
    }
    const { data } = await this.call('/', methodNames.GET_NEW_ADDRESS, params);
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.GET_NEW_ADDRESS),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.GET_NEW_ADDRESS
        }: ${JSON.stringify(data)}`
      );
    }
    return data.result;
  };

  accountToUtxos = async (
    fromAddress: string | null,
    toAddress: string,
    amount: string
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.ACCOUNT_TO_UTXOS, [
      fromAddress,
      {
        [toAddress]: amount,
      },
      [],
    ]);
    return data.result;
  };

  utxosToAccount = async (toAddress: string, amount: string) => {
    const { data } = await this.call('/', methodNames.UTXOS_TO_ACCOUNT, [
      {
        [toAddress]: amount,
      },
    ]);
    return data.result;
  };

  getTransaction = async (txId: string): Promise<any> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getTransaction.${bestBlockHash}.${txId}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_TRANSACTION, [
        txId,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  setLabel = async (address: string, label: string): Promise<any> => {
    const { data } = await this.call('/', methodNames.SET_LABEL, [
      address,
      label,
    ]);
    return data.result;
  };

  sendToAddress = async (
    toAddress: string | null,
    amount: BigNumber,
    subtractfeefromamount = false
  ): Promise<string> => {
    const txnSize = await getTxnSize();
    if (txnSize >= MAX_TXN_SIZE) {
      await construct({
        maximumAmount: new BigNumber(
          PersistentStore.get(MAXIMUM_AMOUNT) || DEFAULT_MAXIMUM_AMOUNT
        ),
        maximumCount: new BigNumber(
          PersistentStore.get(MAXIMUM_COUNT) || DEFAULT_MAXIMUM_COUNT
        ),
        feeRate: new BigNumber(
          PersistentStore.get(FEE_RATE) || DEFAULT_FEE_RATE
        ),
      });
    }

    const { data } = await this.call('/', methodNames.SEND_TO_ADDRESS, [
      toAddress,
      amount.toFixed(8),
      '',
      '',
      subtractfeefromamount,
    ]);
    return data.result;
  };

  sendMany = async (amounts: any) => {
    const { data } = await this.call('/', methodNames.SEND_MANY, ['', amounts]);
    return data.result;
  };

  accountToAccount = async (
    fromAddress: string | null,
    toAddress: string,
    amount: string
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.ACCOUNT_TO_ACCOUNT, [
      fromAddress,
      {
        [toAddress]: amount,
      },
      [],
    ]);
    return data.result;
  };

  sendTokensToAddress = async (
    toAddress: string,
    amount: string
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.SEND_TOKENS_TO_ADDRESS, [
      {},
      {
        [toAddress]: amount,
      },
    ]);
    return data.result;
  };

  isValidAddress = async (address: string): Promise<boolean> => {
    const cacheKey = `rpc.isValidAddress.${address}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.VALIDATE_ADDRESS, [
        address,
      ]);

      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.VALIDATE_ADDRESS),
        data
      );

      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.VALIDATE_ADDRESS
          }: ${JSON.stringify(data.result)}`
        );
      }
      lruCache.put(cacheKey, data.result.isvalid);
      return data.result.isvalid;
    }
    return result;
  };

  getWalletTxnCount = async () => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getWalletTxnCount.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_WALLET_INFO, []);

      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.GET_WALLET_INFO),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.GET_WALLET_INFO
          }: ${JSON.stringify(data.result)}`
        );
      }
      lruCache.put(cacheKey, data.result.txcount);
      return data.result.txcount;
    }
    return result;
  };

  getWalletTxns = async (pageNo = 0, pageSize = 1): Promise<ITxn[]> => {
    const count = pageSize;
    const skip = pageNo * pageSize;
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getWalletTxns.${bestBlockHash}.${pageNo}.${pageSize}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_TRANSACTIONS, [
        '*',
        count,
        skip,
      ]);

      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.LIST_TRANSACTIONS),
        data
      );

      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.LIST_TRANSACTIONS
          }: ${JSON.stringify(data.result)}`
        );
      }

      const txnList: ITxn[] = await getTxnDetails(data.result);
      lruCache.put(cacheKey, txnList);
      return txnList;
    }
    return result;
  };

  listUnspent = async (
    maximumAmount: BigNumber,
    maximumCount?: BigNumber
  ): Promise<ListUnspentModel[]> => {
    const queryOptions = maximumCount
      ? { maximumAmount, maximumCount }
      : { maximumAmount };

    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.listUnspent.${bestBlockHash}.${maximumAmount}.${maximumCount}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_UNSPENT, [
        1,
        9999999,
        [],
        true,
        queryOptions,
      ]);
      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.LIST_UNSPENT),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.LIST_UNSPENT
          }: ${JSON.stringify(data.result)}`
        );
      }
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  // need to look into psbt rpc calls where used and why we are using those
  walletCreateFundedPsbt = async (inputs, outputs, feeRate) => {
    const { data } = await this.call(
      '/',
      methodNames.WALLET_CREATE_FUNDED_PSBT,
      [
        inputs,
        outputs,
        0,
        {
          subtractFeeFromOutputs: [0],
          feeRate,
        },
      ]
    );

    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.WALLET_CREATE_FUNDED_PSBT),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.WALLET_CREATE_FUNDED_PSBT
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  walletProcessPsbt = async (psbt: string) => {
    const { data } = await this.call('/', methodNames.WALLET_PROCESS_PSBT, [
      psbt,
    ]);

    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.WALLET_PROCESS_PSBT),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.WALLET_PROCESS_PSBT
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  finalizePsbt = async (psbt: string) => {
    const { data } = await this.call('/', methodNames.FINALIZE_PSBT, [psbt]);

    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.FINALIZE_PSBT),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.FINALIZE_PSBT
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  decodeRawTransaction = async (hex: string) => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.decodeRawTransaction.${bestBlockHash}.${hex}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call(
        '/',
        methodNames.DECODE_RAW_TRANSACTION,
        [hex]
      );
      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.DECODE_RAW_TRANSACTION),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.DECODE_RAW_TRANSACTION
          }: ${JSON.stringify(data.result)}`
        );
      }
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getDataForCLIQuery = async (query: string) => {
    const methodName = getRpcMethodName(query);
    const params = getParams(query);

    try {
      const { data } = await this.call('/', methodName, params);
      return data.result;
    } catch (e: any) {
      throw new Error(
        (e.response &&
          e.response.data &&
          e.response.data.error &&
          e.response.data.error.message) ||
          'Bad Request'
      );
    }
  };

  createMasterNode = async (
    masternodeCreatorInfo: IMasternodeCreatorInfo,
    tx: any = []
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.CREATE_MASTER_NODE, [
      masternodeCreatorInfo.collateralAddress,
      masternodeCreatorInfo.operatorAuthAddress,
      tx,
    ]);
    return data.result;
  };

  resignMasterNode = async (
    masternodeCreatorInfo: string,
    tx: any = []
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.RESIGN_MASTER_NODE, [
      masternodeCreatorInfo,
      tx,
    ]);
    return data.result;
  };

  listMasterNodes = async (): Promise<string> => {
    const { data } = await this.call('/', methodNames.LIST_MASTER_NODE, [
      {
        including_start: MASTERNODE_PARAMS_INCLUDE_FROM_START,
        limit: MASTERNODE_PARAMS_MASTERNODE_LIMIT,
      },
    ]);
    return data.result;
  };

  createToken = async (
    tokenCreatorInfo: ITokenCreatorInfo,
    tx: any = []
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.CREATE_TOKEN, [
      tokenCreatorInfo,
    ]);
    return data.result;
  };

  mintToken = async (
    tokenMintInfo: ITokenMintInfo,
    tx: any = []
  ): Promise<string> => {
    // no need to d it here but need to make changes in service accepts amount this way 10@symbol
    const { hash, amount } = tokenMintInfo;
    const { data } = await this.call('/', methodNames.MINT_TOKEN, [
      `${amount}@${hash}`,
    ]);
    return data.result;
  };

  updateToken = async (
    tokenUpdatorInfo: ITokenUpdatorInfo,
    tx: any = []
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.UPDATE_TOKEN, [
      tokenUpdatorInfo,
    ]);
    return data.result;
  };

  destroyToken = async (tokenId: string, tx: any = []): Promise<string> => {
    // it can be removed as it is no longer available
    const { data } = await this.call('/', methodNames.DESTROY_TOKEN, [tokenId]);
    return data.result;
  };

  tokenInfo = async (key: string): Promise<any> => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.tokenInfo.${blockhash}.${key}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_TOKEN_NODE, [key]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getTokenBalances = async (): Promise<string[]> => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getTokenBalances.${blockhash}`;
    const result = lruCache.get(cacheKey);

    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_TOKEN_BALANCES);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  listTokens = async (
    start: number,
    includingStart: boolean,
    limit: number
  ): Promise<string> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.listTokens.${bestBlockHash}.${start}.${includingStart}.${limit}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_TOKEN, [
        { start, including_start: includingStart, limit },
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getBlockChainInfo = async () => {
    const { data } = await this.call('/', methodNames.GET_BLOCKCHAIN_INFO, []);
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.GET_BLOCKCHAIN_INFO),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.GET_BLOCKCHAIN_INFO
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  getBestBlockHash = async (): Promise<string> => {
    const cacheKey = 'rpc.getBestBlockHash';
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_BEST_BLOCK_HASH);
      // 5 sec cash time
      lruCache.put(cacheKey, data.result, 5000);
      return data.result;
    }
    return result;
  };

  getAccount = async (ownerAddress: string) => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getAccount.${bestBlockHash}.${ownerAddress}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_ACCOUNT, [
        ownerAddress,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  listAccounts = async (
    includingStart: boolean,
    limit: number,
    start?: string
  ) => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.listAccounts.${bestBlockHash}.${start}.${includingStart}.${limit}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_ACCOUNTS, [
        {
          start,
          including_start: includingStart,
          limit,
        },
        true,
        true,
        true,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  dumpPrivKey = async (address: string) => {
    const { data } = await this.call('/', methodNames.DUMP_PRIV_KEY, [address]);
    return data.result;
  };

  importPrivKey = async (address: string) => {
    const { data } = await this.call('/', methodNames.IMPORT_PRIV_KEY, [
      address,
    ]);
    return data.result;
  };

  setHdSeed = async (hdSeed: string, newkeypool = true) => {
    const { data } = await this.call('/', methodNames.SET_HD_SEED, [
      newkeypool,
      hdSeed,
    ]);
    return data.result;
  };

  getaddressInfo = async (address: string) => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getaddressInfo.${blockhash}.${address}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_ADDRESS_INFO, [
        address,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getListreceivedAddress = async (
    minConf = 0,
    allAddresses = true
  ): Promise<PaymentRequestModel[]> => {
    const { data } = await this.call(
      '/',
      methodNames.LIST_RECEIVED_BY_ADDRESS,
      [minConf, allAddresses]
    );
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.LIST_RECEIVED_BY_ADDRESS),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.LIST_RECEIVED_BY_ADDRESS
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  stop = async () => {
    const { data } = await this.call('/', methodNames.STOP, []);
    return data.result;
  };

  encryptWallet = async (passphrase: string) => {
    const { data } = await this.call('/', methodNames.ENCRYPT_WALLET, [
      passphrase,
    ]);
    return data.result;
  };

  walletPassphrase = async (passphrase: string, timeout?: number) => {
    const { data } = await this.call('/', methodNames.WALLET_PASSPHRASE, [
      passphrase,
      timeout || TimeoutLockEnum.FIVE_MINUTES,
    ]);
    return data.result;
  };

  changeWalletPassphrase = async (
    currentPassphrase: string,
    newPassphrase: string
  ): Promise<string> => {
    const { data } = await this.call(
      '/',
      methodNames.WALLET_PASSPHRASE_CHANGE,
      [currentPassphrase, newPassphrase]
    );
    return data.result;
  };

  walletlock = async () => {
    const { data } = await this.call('/', methodNames.WALLET_LOCK, []);
    return data.result;
  };

  // LP RPC call

  listPoolPairs = async (
    start: number,
    including_start: boolean,
    limit: number
  ) => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.listPoolPairs.${blockhash}.${start}.${including_start}.${limit}`;
    const result = lruCache.get(cacheKey);

    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_POOL_PAIRS, [
        { start, including_start, limit },
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  listPoolShares = async (
    start: number,
    including_start: boolean,
    limit: number
  ) => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.listPoolShares.${blockhash}.${start}.${including_start}.${limit}`;
    const result = lruCache.get(cacheKey);

    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_POOL_SHARES, [
        { start, including_start, limit },
        true, // verbose
        true, // is mine only
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getPoolPair = async (poolID: string) => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getPoolPair.${blockhash}.${poolID}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_POOL_PAIR, [
        poolID,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  /**
   *
   * @param address1
   * @param amount1 - Amount is in format "1.0@1"
   * @param address2
   * @param amount2 - Amount is in format "1.0@1"
   * @param shareAddress
   */
  addPooLiquidity = async (
    address1: string,
    amount1: string,
    address2: string,
    amount2: string,
    shareAddress: string
  ): Promise<string> => {
    const from =
      address1 === address2
        ? { [address1]: [amount1, amount2] }
        : { [address1]: amount1, [address2]: amount2 };

    const { data } = await this.call('/', methodNames.ADD_POOL_LIQUIDITY, [
      from,
      shareAddress,
    ]);
    return data.result;
  };

  poolSwap = async (
    from: string,
    tokenFrom: string,
    amountFrom: BigNumber,
    to: string,
    tokenTo: string,
    maxPrice: BigNumber
  ): Promise<string> => {
    // amount from needs to be a bignumber here
    const { data } = await this.call('/', methodNames.POOL_SWAP, [
      {
        from,
        tokenFrom,
        amountFrom: amountFrom.toFixed(8),
        to,
        tokenTo,
        maxPrice: maxPrice.toFixed(8),
      },
      [],
    ]);
    return data.result;
  };

  removePoolLiquidity = async (from: string, amount: string) => {
    //1.0@LpSymbol no need to do it here need to make this changes in service
    const { data } = await this.call('/', methodNames.REMOVE_POOL_LIQUIDITY, [
      from,
      amount,
      [],
    ]);
    return data.result;
  };

  testPoolSwap = async (
    from: string,
    tokenFrom: string,
    amountFrom: BigNumber,
    to: string,
    tokenTo: string
  ) => {
    // amountfrom will need to be in the bigNumber
    const { data } = await this.call('/', methodNames.TEST_POOL_SWAP, [
      { from, tokenFrom, amountFrom, to, tokenTo },
      'auto',
    ]);
    return data.result;
  };

  getGov = async () => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getGov.${blockhash}.LP_DAILY_DFI_REWARD`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_GOV, [
        LP_DAILY_DFI_REWARD,
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getListAccountHistory = async (params: {
    blockHeight?: number;
    limit?: number;
    no_rewards?: boolean;
    token: string;
  }) => {
    const { blockHeight, limit, no_rewards, token } = params;
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getListAccountHistory.${blockhash}.${blockHeight}.${limit}.${no_rewards}.${token}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.LIST_ACCOUNT_HISTORY, [
        'mine',
        {
          maxBlockHeight: blockHeight,
          limit,
          no_rewards,
          token,
        },
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  accountHistoryCount = async (
    no_rewards: boolean,
    token: string
  ): Promise<string> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.accountHistoryCount.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.ACCOUNT_HISTORY_COUNT, [
        'mine',
        {
          no_rewards,
          token,
        },
      ]);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  createWallet = async (
    walletPath: string,
    passphrase: string
  ): Promise<CreateNewWalletModel> => {
    const { data } = await this.call('/', methodNames.CREATE_WALLET, [
      walletPath,
      false,
      false,
      passphrase,
    ]);
    return data?.result;
  };

  getSPVBalance = async (): Promise<number> => {
    const blockhash = await this.getBestBlockHash();
    const cacheKey = `rpc.getSPVBalance.${blockhash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.SPV_GETBALANCE, []);
      lruCache.put(cacheKey, data?.result);
      return data?.result;
    }
    return result;
  };

  listReceivedBySPVAddresses = async (
    minConf = 0
  ): Promise<PaymentRequestModel[]> => {
    const { data } = await this.call(
      '/',
      methodNames.SPV_LISTRECEIVEDBYADDRESS,
      [minConf]
    );
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.LIST_RECEIVED_BY_ADDRESS),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.SPV_LISTRECEIVEDBYADDRESS
        }: ${JSON.stringify(data.result)}`
      );
    }
    return data.result;
  };

  isValidSPVAddress = async (address: string): Promise<boolean> => {
    const cacheKey = `rpc.isValidSPVAddress.${address}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.SPV_VALIDATEADDRESS, [
        address,
      ]);

      const isValid = validateSchema(
        rpcResponseSchemaMap.get(methodNames.VALIDATE_ADDRESS),
        data
      );
      if (!isValid) {
        throw new Error(
          `Invalid response from node, ${
            methodNames.SPV_VALIDATEADDRESS
          }: ${JSON.stringify(data.result)}`
        );
      }
      lruCache.put(cacheKey, data.result.isvalid);
      return data.result.isvalid;
    }
    return result;
  };

  getNewSPVAddress = async (): Promise<string> => {
    const { data } = await this.call('/', methodNames.SPV_GETNEWADDRESS);
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.GET_NEW_ADDRESS),
      data
    );
    if (!isValid) {
      throw new Error(
        `Invalid response from node, ${
          methodNames.SPV_GETNEWADDRESS
        }: ${JSON.stringify(data)}`
      );
    }
    return data.result;
  };

  sendSPVToAddress = async (
    toAddress: string,
    amount: BigNumber,
    fee = new BigNumber(DEFAULT_BTC_FEE)
  ): Promise<SPVSendModel> => {
    const { data } = await this.call('/', methodNames.SPV_SENDTOADDRESS, [
      toAddress,
      amount.toFixed(8),
      fee.toNumber(),
    ]);
    return data.result;
  };

  getAllSPVAddress = async (): Promise<string> => {
    const bestBlockHash = await this.getBestBlockHash();
    const cacheKey = `rpc.getAllSPVAddress.${bestBlockHash}`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.SPV_GETALLADDRESSES);
      lruCache.put(cacheKey, data.result);
      return data.result;
    }
    return result;
  };

  getNodeVersion = async (): Promise<string> => {
    const cacheKey = `rpc.getNodeVersion`;
    const result = lruCache.get(cacheKey);
    if (result === undefined) {
      const { data } = await this.call('/', methodNames.GET_NETWORK_INFO);
      lruCache.put(cacheKey, data?.result?.subversion);
      return data?.result?.subversion;
    }
    return result;
  };
}
