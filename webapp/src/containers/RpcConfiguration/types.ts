import { RPCConfigItem } from '@defi_types/rpcConfig';
export interface AppState {
  readonly isFetching: boolean;
  readonly rpcRemotes: RPCConfigItem[];
  readonly rpcConfig: RPCConfigItem;
  readonly isRunning: boolean;
  readonly rpcConfigError: string;
  readonly nodeError: string;
  readonly isQueueReady: boolean;
  readonly isAppClosing: boolean;
  readonly activeNetwork: string;
}
