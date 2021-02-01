export interface UpdateCheckResult {
  readonly updateInfo: UpdateInfo;
  readonly downloadPromise?: Promise<Array<string>> | null;
}

export interface UpdateInfo {
  /**
   * The version.
   */
  readonly version: string;
  readonly files: Array<any>;
  /**
   * The release name.
   */
  releaseName?: string | null;
  /**
   * The release notes. List if `updater.fullChangelog` is set to `true`, `string` otherwise.
   */
  releaseNotes?: string | Array<ReleaseNoteInfo> | null;
  /**
   * The release date.
   */
  releaseDate: string;
  /**
   * The [staged rollout](/auto-update#staged-rollouts) percentage, 0-100.
   */
  readonly stagingPercentage?: number;
}

export interface ReleaseNoteInfo {
  /**
   * The version.
   */
  readonly version: string;
  /**
   * The note.
   */
  readonly note: string | null;
}
