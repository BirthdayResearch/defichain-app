export const SNAPSHOT_URI =
  'https://defi-snapshots-europe.s3.eu-central-1.amazonaws.com/';
export const SNAPSHOT_BLOCK = '738700';
export const SNAPSHOT_FILENAME = `snapshot-mainnet-${SNAPSHOT_BLOCK}.zip`;
export const OFFICIAL_SNAPSHOT_URL = `${SNAPSHOT_URI}${SNAPSHOT_FILENAME}`;
export const SNAPSHOT_PROVIDER = 'DeFiChain Foundation';

export interface UnpackSizesModel {
  completionRate: number;
}
export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
  completionRate: number;
  downloadPath: string;
  snapshotDate?: Date;
  unpackModel?: UnpackSizesModel;
}
