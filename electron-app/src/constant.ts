import path from "path";
import { app } from "electron";
import { rootPath } from "electron-root-path";
import { getPlatform } from "./utils";

export const IS_DEV = process.env.NODE_ENV === "development";
export const IS_PACKAGED =
  process.mainModule.filename.indexOf("app.asar") !== -1;

export const APP_NAME = "DeFi";
export const YAML_COMMENT = "managed by DeFi Blockchain UI";
export const PRELAUNCH_PREFERENCE_STATUS = "prelaunch-preference-status";
export const PRELAUNCH_PREFERENCE_ENABLE = "prelaunch-preference-enable";
export const PRELAUNCH_PREFERENCE_DISABLE = "prelaunch-preference-disable";

export const GET_CONFIG_DETAILS = "get-config-details";

export const START_DEFI_CHAIN = "start-defi-chain";
export const START_DEFI_CHAIN_REPLY = "start-defi-chain-reply";
export const STOP_DEFI_CHAIN = "stop-defi-chain";

export const HOME_PATH = app.getPath("home");
export const CONFIG_FILE_NAME = path.join(HOME_PATH, "./.defi/defi.conf");
export const UI_CONFIG_FILE_NAME = path.join(HOME_PATH, "./.defi/defi.ui.yaml");
export const PID_FILE_NAME = path.join(HOME_PATH, "./.defi/pid");

export const BINARY_FILE_NAME = "bitcoind";
export const BINARY_FILE_PATH = IS_DEV
  ? path.join(rootPath, "./binary", getPlatform())
  : IS_PACKAGED
  ? path.join(rootPath, "Contents", "Resources", "binary", getPlatform())
  : path.join(rootPath, "../", "binary", getPlatform());

export const RANDOM_USERNAME_LENGTH = 8;
export const DEFAULT_RPC_BIND = "127.0.0.1";
export const DEFAULT_RPC_PORT = 8555;
