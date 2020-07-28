import path from 'path';

export const SITE_URL = 'https://defichain.com/';
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
