import { MdDone } from "react-icons/md";

export interface SyncStatusProps {}

export interface SyncStatusState {
  status: string;
  syncedAgo: string;
  statusAssets: {
    icon: typeof MdDone;
    label: string;
  };
}
