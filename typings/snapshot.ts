export const SNAPSHOT_URI =
  'https://defi-snapshots.s3-ap-southeast-1.amazonaws.com/';
export const SNAPSHOT_BLOCK = '707207';
export const SNAPSHOT_FILENAME = `snapshot-mainnet-${SNAPSHOT_BLOCK}.tar.gz`;
export const OFFICIAL_SNAPSHOT_URL = `${SNAPSHOT_URI}${SNAPSHOT_FILENAME}`;

export interface FileSizesModel {
  remoteSize: number;
  localSize: number;
  completionRate: number;
  downloadPath: string;
}
