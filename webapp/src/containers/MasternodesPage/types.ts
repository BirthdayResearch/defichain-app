export interface MasternodesState {
  masternodes: [];
  isMasternodesLoaded: boolean;
  isLoadingMasternodes: boolean;
  masternodesLoadError: string;
  isMasterNodeCreating: boolean;
  createdMasterNodeData: any;
  isErrorCreatingMasterNode: string;
  isMasterNodeResigning: boolean;
  resignedMasterNodeData: string;
  isErrorResigningMasterNode: string;
  isRestartNode: boolean;
}
