import { MasterNodeObject } from './masterNodeInterface';

export interface MasternodesState {
  masternodes: MasterNodeObject[];
  myMasternodes: MasterNodeObject[];
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
