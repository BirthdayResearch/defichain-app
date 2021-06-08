export interface SyncStatusState {
  isLoading: boolean;
  syncedPercentage: number;
  latestBlock: number;
  latestSyncedBlock: number;
  syncingError: string;
  isPeersLoading: boolean;
  peers: number;
  peersError: string;
}
