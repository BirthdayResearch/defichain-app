export interface MasterNodeObject {
  hash: string;
  ownerAuthAddress: string;
  operatorAuthAddress: string;
  creationHeight: number;
  resignHeight: number;
  resignTx: string;
  banHeight: number;
  state: string;
  mintedBlocks: number;
  isMyMasternode: boolean;
  isEnabled?: boolean;
  ownerIsMine: boolean;
  operatorIsMine: boolean;
}
