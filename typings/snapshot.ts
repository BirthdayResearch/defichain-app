export const SNAPSHOT_URI =
  'https://defi-snapshots.s3-ap-southeast-1.amazonaws.com/';
export const SNAPSHOT_FILENAME = 'snapshot-mainnet-707207.tar.gz';
export const OFFICIAL_SNAPSHOT_URL = `${SNAPSHOT_URI}${SNAPSHOT_FILENAME}`;

export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
  completionRate: number;
}
