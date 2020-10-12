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
} from './../constants';
import * as methodNames from '../constants/rpcMethods';
import { rpcResponseSchemaMap } from './schemas/rpcMethodSchemaMapping';
import {
  IAddressAndAmount,
  ITxn,
  IBlock,
  IParseTxn,
  IRawTxn,
  IMasternodeCreatorInfo,
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

export default class RpcClient {
  client: any;
  constructor() {
    const state = store.getState();
    const { rpcauth, rpcconnect, rpcport } = state.app.rpcConfig;

    if (!rpcauth || !rpcconnect || !rpcport) {
      throw new Error('Invalid configuration');
    }
    this.client = axios.create({
      baseURL: `http://${rpcauth}@${rpcconnect}:${rpcport}`,
      headers: {
        'cache-control': 'no-cache',
      },
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

  getPeerInfo = async (): Promise<number> => {
    const { data } = await this.call('/', methodNames.GET_PEER_INFO, []);
    const isValid = validateSchema(
      rpcResponseSchemaMap.get(methodNames.GET_PEER_INFO),
      data
    );
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
    const addressAndAmountList: IAddressAndAmount[] = getAddressAndAmount(
      result
    );
    return addressAndAmountList;
  };

  sendToAddress = async (
    toAddress: string,
    amount: number | string,
    subtractfeefromamount: boolean = false
  ): Promise<string> => {
    const txnSize = await getTxnSize();
    if (txnSize >= MAX_TXN_SIZE) {
      await construct({
        maximumAmount:
          PersistentStore.get(MAXIMUM_AMOUNT) || DEFAULT_MAXIMUM_AMOUNT,
        maximumCount:
          PersistentStore.get(MAXIMUM_COUNT) || DEFAULT_MAXIMUM_COUNT,
        feeRate: PersistentStore.get(FEE_RATE) || DEFAULT_FEE_RATE,
      });
    }

    const { data } = await this.call('/', methodNames.SEND_TO_ADDRESS, [
      toAddress,
      amount,
      '',
      '',
      subtractfeefromamount,
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

  listUnspent = async (maximumAmount: number, maximumCount?: number) => {
    const queryOptions = maximumCount
      ? { maximumAmount, maximumCount: Number(maximumCount) }
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
    const { data } = await this.call('/', methodNames.LIST_MASTER_NODE);
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
}
