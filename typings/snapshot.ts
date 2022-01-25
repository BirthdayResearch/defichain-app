export const SNAPSHOT_EU =
  'https://defi-snapshots-europe.s3.eu-central-1.amazonaws.com/';
export const SNAPSHOT_ASIA =
  'https://defi-snapshots.s3-ap-southeast-1.amazonaws.com/';
export const SNAPSHOT_AU =
  'https://defi-snapshots-sydney.s3-ap-southeast-2.amazonaws.com/';
export const SNAPSHOT_US = 'https://defi-snapshots-us.s3.amazonaws.com/';
export const SNAPSHOT_INDEX = 'index.txt';
export interface SnapshotInterface {
  SNAPSHOT_BLOCK: string;
  SNAPSHOT_FILENAME: string;
  SNAPSHOT_EXTENSION: string;
}

export let SNAPSHOT_INFO = {
  SNAPSHOT_BLOCK: '1569660',
  SNAPSHOT_FILENAME: 'snapshot-mainnet-',
  SNAPSHOT_EXTENSION: '.zip',
};

export const SNAPSHOT_PROVIDER = 'DeFiChain Foundation';

export const getSnapshotFilename = (): string => {
  const info = SNAPSHOT_INFO;
  return `${info.SNAPSHOT_FILENAME}${info.SNAPSHOT_BLOCK}${info.SNAPSHOT_EXTENSION}`;
};

export interface UnpackSizesModel {
  completionRate: number;
}
export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
  completionRate: number;
  downloadPath: string;
  downloadUrl: string;
  filename: string;
  block: string;
  snapshotDate?: Date;
  unpackModel?: UnpackSizesModel;
}
