export interface RPCRemoteType {
  rpcuser?: string;
  rpcpassword?: string;
  rpcconnect: string;
  rpcport: string;
  rpcauth: string;
}
export interface AppState {
  readonly isFetching: boolean;
  readonly rpcRemotes: RPCRemoteType[];
  readonly rpcConfig: RPCRemoteType;
  readonly isRunning: boolean;
  readonly rpcConfigError: string;
  readonly nodeError: string;
  readonly configurationData: any;
  readonly isQueueReady: boolean;
  readonly isAppClosing: boolean;
}
