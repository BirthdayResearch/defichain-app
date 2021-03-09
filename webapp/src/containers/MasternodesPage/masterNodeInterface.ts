export interface MasterNodeObject {
  hash: string;
  ownerAuthAddress: string;
  operatorAuthAddress: string;
  creationHeight: number;
  resignHeight: number;
  resignTx: string;
  banHeight: number;
  banTx: string;
  state: string;
  mintedBlocks: number;
  isMyMasternode: boolean;
  isEnabled?: boolean;
}
