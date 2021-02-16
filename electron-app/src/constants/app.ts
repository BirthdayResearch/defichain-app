import path from 'path';

export const ICON = path.join(
  __dirname,
  '/electron-app/assets/icon/icon-512.png'
);
export const BACKGROUND_COLOR = '#F4F3F6';
export const TITLE_BAR_STYLE = 'hiddenInset';
export const READY = 'ready';
export const WINDOW_ALL_CLOSED = 'window-all-closed';
export const ACTIVATE = 'activate';
export const CLOSE = 'close';
export const CLOSED = 'closed';
export const SECOND_INSTANCE = 'second-instance';

export const DARWIN = 'darwin';
export const MAC = 'mac';
export const WIN = 'win';
export const WIN_32 = 'win32';
export const LINUX = 'linux';
export const AIX = 'aix';
export const FREEBSD = 'freebsd';
export const OPENBSD = 'openbsd';
export const ANDROID = 'android';
export const SUNOS = 'sunos';
export const DEFAULT_ELECTRON_LOG_SIZE = 5; // IN MBs
export const DEFAULT_ELECTRON_LOG_BASE_UNIT = 1048576;
export const DEFAULT_ELECTRON_FORMAT =
  '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [IPC-MAIN-{level}] {text}';
export const DISCLAIMER_DIALOG_TIMER = 10000;
export const STOP_BINARY_INTERVAL = 500;
export const REINDEX_ERROR_STRING = 'restart with -reindex';
export const ACCOUNT_HISTORY_REINDEX_ERROR_STRING =
  'Account history needs rebuild';
export const NODE_SYNTAX_ERROR = '.cpp';
// * 5 Minutes
export const APP_SHUTDOWN_TIMEOUT = 300000;
