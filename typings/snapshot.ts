export const SNAPSHOT_EU =
  'https://defi-snapshots-europe.s3.eu-central-1.amazonaws.com/';
export const SNAPSHOT_ASIA =
  'https://defi-snapshots.s3-ap-southeast-1.amazonaws.com/';
export const SNAPSHOT_BLOCK = '835791';
export const SNAPSHOT_FILENAME = `snapshot-mainnet-${SNAPSHOT_BLOCK}.zip`;
export const OFFICIAL_SNAPSHOT_URL = `${SNAPSHOT_EU}${SNAPSHOT_FILENAME}`;
export const SNAPSHOT_PROVIDER = 'DeFiChain Foundation';
export const SNAPSHOT_LINKS = [
  {
    label: 'Europe',
    value: `${SNAPSHOT_EU}${SNAPSHOT_FILENAME}`,
  },
  {
    label: 'Asia',
    value: `${SNAPSHOT_ASIA}${SNAPSHOT_FILENAME}`,
  },
];

export interface UnpackSizesModel {
  completionRate: number;
}
export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
  completionRate: number;
  downloadPath: string;
  downloadUrl: string;
  snapshotDate?: Date;
  unpackModel?: UnpackSizesModel;
}
