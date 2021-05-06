import { MasterNodeObject } from '../MasternodesPage/masterNodeInterface';

export enum DownloadSnapshotSteps {
  SnapshotRequest,
  DownloadSnapshot,
  ApplyingSnapshot,
  SnapshotApplied,
}

import { FileSizesModel } from '@defi_types/snapshot';
export interface PopoverState {
  isOpen: boolean;
  isRestart: boolean;
  showWarning: boolean;
  isUpdateModalOpen: boolean;
  isUpdateStarted: boolean;
  isUpdateError: string;
  updateAppInfo: any;
  postUpdateFlag: boolean;
  showUpdateAvailable: boolean;
  isReIndexModelOpen: boolean;
  isReIndexRestart: boolean;
  isMinimized: boolean;
  updateAvailableBadge: boolean;
  backupWalletIsOpen: boolean;
  openBackupWalletDatModal: boolean;
  openResetWalletDatModal: boolean;
  isBackupWalletWarningModelOpen: boolean;
  isEncryptWalletModalOpen: boolean;
  isWalletPassphraseModalOpen: boolean;
  isWalletRestart: boolean;
  isWalletReplace: boolean;
  isQueueResetRoute: boolean;
  isRestoreWalletOpen: boolean;
  filePath: string;
  isExitWalletOpen: boolean;
  isWalletEncrypting: boolean;
  isErrorEncryptingWallet: string;
  isEncryptFromModal: boolean;
  isPostEncryptBackupModalOpen: boolean;
  reIndexMessage: string;
  isMasternodeWarningModalOpen: boolean;
  isMasternodeUpdateRestartModalOpen: boolean;
  updatedMasternode?: Partial<MasterNodeObject>;
  updateMasternodeCallback?: () => void;
  isSnapshotDownloadOpen: boolean;
  snapshotDownloadSteps: DownloadSnapshotSteps;
  snapshotDownloadData: FileSizesModel;
  isBalanceTooltipOpen: boolean;
}
