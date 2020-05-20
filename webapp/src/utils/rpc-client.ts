import axios from 'axios';
import _ from 'lodash';
import store from '../app/rootStore';
import { RPC_V } from './../constants';
import * as methodNames from '../constants/rpcMethods';
import { rpcResponseSchemaMap } from './schemas/rpcMethodSchemaMapping';
import { IAddressAndAmount, ITxn } from './interfaces';
import { getAddressAndAmount, validateSchema, getTxnDetails } from './utility';

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
      id: Math.random()
        .toString()
        .substr(2),
      method,
      params,
    });
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
    const {data} = await this.call("/", methodNames.GET_BALANCES, []);
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
  }

  getNewAddress = async (label): Promise<string> => {
    const { data } = await this.call('/', methodNames.GET_NEW_ADDRESS, [label]);
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
    const { data } = await this.call(
      '/',
      methodNames.LIST_RECEIVED_BY_ADDRESS,
      [1, true]
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
    const addressAndAmountList: IAddressAndAmount[] = await getAddressAndAmount(
      data.result
    );
    return addressAndAmountList;
  };

  sendToAddress = async (
    toAddress: string,
    amount: number
  ): Promise<string> => {
    const { data } = await this.call('/', methodNames.SEND_TO_ADDRESS, [
      toAddress,
      amount,
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
    return data.result.initialblockdownload;
  };
}
