import axios from 'axios';
import store from '../app/rootStore';
import {
  RPC_V,
  REGTEST,
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
} from './../constants';
import * as methodNames from '@defi_types/rpcMethods';
import { rpcResponseSchemaMap } from './schemas/rpcMethodSchemaMapping';
import {
  IAddressAndAmount,
  ITxn,
  IBlock,
  IParseTxn,
  IRawTxn,
  IMasternodeCreatorInfo,
  ITokenCreatorInfo,
  ITokenUpdatorInfo,
  ITokenMintInfo,
} from './interfaces';
import {
  getAddressAndAmount,
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
import { handleFetchWalletBalance } from '../containers/WalletPage/service';
import { BigNumber } from 'bignumber.js';
import {
  CreateNewWalletModel,
  ListUnspentModel,
  PeerInfoModel,
  WalletInfo,
} from '../constants/rpcModel';
import { TimeoutLockEnum } from '../containers/SettingsPage/types';

export default class RpcClient {
  client: any;
  constructor(cancelToken?) {
    const state = store.getState();
    const { rpcauth, rpcconnect } = state.app.rpcConfig;
    const activeNetwork = state.app.rpcConfig[state.app.activeNetwork];
    const rpcport = activeNetwork?.rpcport;

    if (!rpcauth || !rpcconnect || !rpcport) {
      throw new Error('Invalid configuration');
    }
    this.client = axios.create({
      baseURL: `http://${rpcauth}@${rpcconnect}:${rpcport}`,
      headers: {
        'cache-control': 'no-cache',
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
    const { data } = await this.call('/', methodNames.GET_BLOCK_HASH, [
      blockNumber,
    ]);
    return data.result;
  };

  getBlock = async (blockHash: string, verbose: number): Promise<IBlock> => {
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
        `Invalid response from node, ${methodNames.GET_BLOCK}: ${JSON.stringify(
          data
        )}`
      );
    }
    return getBlockDetails(data.result);
  };

  getBlockCount = async (): Promise<number> => {
    const { data } = await this.call('/', methodNames.GET_BLOCK_COUNT, []);
    return data.result;
  };

  getWalletInfo = async (): Promise<WalletInfo> => {
    const { data } = await this.call('/', methodNames.GET_WALLET_INFO, []);
    return data.result;
  };

  getRawTransactionOfBlock = async (
    txid: string,
    verbose: boolean,
    blockHash: string
  ): Promise<IParseTxn> => {
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

    return parsedTxn;
  };

  getRawTransaction = async (
    txid: string,
    verbose: boolean
  ): Promise<IRawTxn> => {
    const { data } = await this.call('/', methodNames.GET_RAW_TRANSACTION, [
      txid,
      verbose,
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

    return data.result;
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
    return data.result;
  };

  getPendingBalance = async (): Promise<number> => {
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
    return data.result.mine.untrusted_pending;
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

  // include addresses that haven't received any payments.
  getReceivingAddressAndAmountList = async (): Promise<IAddressAndAmount[]> => {
    const result = await this.getListreceivedAddress(1);
    const balance = await this.getBalance();
    const addressAndAmountList: IAddressAndAmount[] = getAddressAndAmount(
      result,
      balance
    );
    return addressAndAmountList;
  };

  getReceivingAddressAndTotalAmountList = async (): Promise<
    IAddressAndAmount[]
  > => {
    const result = await this.getListreceivedAddress(1);
    const balance = await handleFetchWalletBalance();
    const addressAndAmountList: IAddressAndAmount[] = getAddressAndAmount(
      result,
      balance
    );
    return addressAndAmountList;
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
    const { data } = await this.call('/', methodNames.GET_TRANSACTION, [txId]);
    return data.result;
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
    subtractfeefromamount: boolean = false
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
    return data.result.isvalid;
  };

  getWalletTxnCount = async () => {
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
    return data.result.txcount;
  };

  getWalletTxns = async (
    pageNo: number = 0,
    pageSize: number = 1
  ): Promise<ITxn[]> => {
    const count = pageSize;
    const skip = pageNo * pageSize;

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
    return txnList;
  };

  listUnspent = async (
    maximumAmount: BigNumber,
    maximumCount?: BigNumber
  ): Promise<ListUnspentModel[]> => {
    const queryOptions = maximumCount
      ? { maximumAmount, maximumCount }
      : { maximumAmount };
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
    return data.result;
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
    const { data } = await this.call('/', methodNames.DECODE_RAW_TRANSACTION, [
      hex,
    ]);

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
    return data.result;
  };

  isInitialBlockDownload = async (): Promise<boolean> => {
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
    // return true for initial block downloaded in regtest network
    if (data.result.chain === REGTEST) {
      return true;
    }
    return !!data.result;
  };

  getDataForCLIQuery = async (query: string) => {
    const methodName = getRpcMethodName(query);
    const params = getParams(query);

    try {
      const { data } = await this.call('/', methodName, params);
      return data.result;
    } catch (e) {
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
    const { data } = await this.call('/', methodNames.GET_TOKEN_NODE, [key]);
    return data.result;
  };

  getTokenBalances = async (): Promise<string[]> => {
    const { data } = await this.call('/', methodNames.GET_TOKEN_BALANCES);
    return data.result;
  };

  listTokens = async (
    start: number,
    includingStart: boolean,
    limit: number
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.LIST_TOKEN, [
      { start, including_start: includingStart, limit },
    ]);
    return data.result;
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

  getAccount = async (ownerAddress: string) => {
    const { data } = await this.call('/', methodNames.GET_ACCOUNT, [
      ownerAddress,
    ]);
    return data.result;
  };

  listAccounts = async (
    includingStart: boolean,
    limit: number,
    start?: string
  ) => {
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
    return data.result;
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

  setHdSeed = async (hdSeed: string, newkeypool: boolean = true) => {
    const { data } = await this.call('/', methodNames.SET_HD_SEED, [
      newkeypool,
      hdSeed,
    ]);
    return data.result;
  };

  getaddressInfo = async (address: string) => {
    const { data } = await this.call('/', methodNames.GET_ADDRESS_INFO, [
      address,
    ]);
    return data.result;
  };

  getListreceivedAddress = async (minConf: number = 0) => {
    const { data } = await this.call(
      '/',
      methodNames.LIST_RECEIVED_BY_ADDRESS,
      [minConf, true]
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
    const { data } = await this.call('/', methodNames.LIST_POOL_PAIRS, [
      { start, including_start, limit },
    ]);
    return data.result;
  };

  listPoolShares = async (
    start: number,
    including_start: boolean,
    limit: number
  ) => {
    const { data } = await this.call('/', methodNames.LIST_POOL_SHARES, [
      { start, including_start, limit },
      true, // verbose
      true, // is mine only
    ]);
    return data.result;
  };

  getPoolPair = async (poolID: string) => {
    const { data } = await this.call('/', methodNames.GET_POOL_PAIR, [poolID]);
    return data.result;
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
    tokenTo: string
  ): Promise<string> => {
    // amount from needs to be a bignumber here
    const { data } = await this.call('/', methodNames.POOL_SWAP, [
      { from, tokenFrom, amountFrom: amountFrom.toFixed(8), to, tokenTo },
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
    ]);
    return data.result;
  };

  getGov = async () => {
    const { data } = await this.call('/', methodNames.GET_GOV, [
      LP_DAILY_DFI_REWARD,
    ]);
    return data.result;
  };

  getListAccountHistory = async (_: {
    blockHeight?: number;
    limit?: number;
    no_rewards?: boolean;
    token: string;
  }) => {
    const { blockHeight, limit, no_rewards, token } = _;
    const { data } = await this.call('/', methodNames.LIST_ACCOUNT_HISTORY, [
      'mine',
      {
        maxBlockHeight: blockHeight,
        limit,
        no_rewards,
        token,
      },
    ]);
    return data.result;
  };

  accountHistoryCount = async (
    no_rewards: boolean,
    token: string
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.ACCOUNT_HISTORY_COUNT, [
      'mine',
      {
        no_rewards,
        token,
      },
    ]);
    return data.result;
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
}
