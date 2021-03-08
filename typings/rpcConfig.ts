export interface RPCConfigBody {
  rpcauth?: string;
  rpcbind?: string;
  rpcport?: string;
  rpcconnect?: string;
  testnet?: string;
  regtest?: string | RPCConfigBody;
  rpcuser?: string;
  rpcpassword?: string;
  wallet?: string;
  walletdir?: string;
  masternode_operator?: string[];
  spv?: string;
  gen?: string;
  addnode?: string;
}
export interface RPCConfigItem extends RPCConfigBody {
  main?: RPCConfigBody;
  test?: RPCConfigBody;
}

export enum NetworkTypes {
  MAIN = 'main',
  TEST = 'test',
  REGTEST = 'regtest',
}

export interface RPCRemotes {
  remotes: RPCConfigItem[];
}

export const MASTERNODE_OPERATOR = 'masternode_operator';
export const ADDNODE = 'addnode';

export const CONFIG_ENABLED = '1';
export const CONFIG_DISABLED = '0';
