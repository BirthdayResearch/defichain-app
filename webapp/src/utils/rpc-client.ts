import axios from 'axios';
import _ from 'lodash';

import store from '../app/rootStore';
import { RPC_V } from './../constants';

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

  isInitialBlockDownload = async (): Promise<boolean> => {
    const { data } = await this.call('/', 'getblockchaininfo', []);
    return data.result.initialblockdownload;
  };
}
