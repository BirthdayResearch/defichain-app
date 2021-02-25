import { Reducer } from 'react';
import { I18nState } from 'react-redux-i18n';
import { BlockchainState } from '../containers/BlockchainPage/types';
import { ConsolePageState } from '../containers/ConsolePage/types';
import { LiquidityPageState } from '../containers/LiquidityPage/types';
import { MasternodesState } from '../containers/MasternodesPage/types';
import { PopoverState } from '../containers/PopOver/types';
import { AppState } from '../containers/RpcConfiguration/types';
import { SettingsState } from '../containers/SettingsPage/types';
import { SwapPageState } from '../containers/SwapPage/types';
import { SyncStatusState } from '../containers/SyncStatus/types';
import { TokensState } from '../containers/TokensPage/types';
import { WalletState } from '../containers/WalletPage/types';

export interface RootState {
  app: AppState;
  wallet: WalletState;
  settings: SettingsState;
  blockchain: BlockchainState;
  masterNodes: MasternodesState;
  tokens: TokensState;
  syncstatus: SyncStatusState;
  i18n: Reducer<I18nState, any>;
  cli: ConsolePageState;
  popover: PopoverState;
  swap: SwapPageState;
  liquidity: LiquidityPageState;
}
