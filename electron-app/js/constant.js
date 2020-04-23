const path = require("path");
const { app } = require("electron");
const { rootPath } = require("electron-root-path");
const { getPlatform } = require("./utils");

const IS_DEV = process.env.NODE_ENV === "development";

const APP_NAME = "DeFi";
const PRELAUNCH_PREFERENCE_STATUS = "prelaunch-preference-status";
const PRELAUNCH_PREFERENCE_ENABLE = "prelaunch-preference-enable";
const PRELAUNCH_PREFERENCE_DISABLE = "prelaunch-preference-disable";

const GET_CONFIG_DETAILS = "get-config-details";

const START_DEFI_CHAIN = "start-defi-chain";
const START_DEFI_CHAIN_REPLY = "start-defi-chain-reply";
const STOP_DEFI_CHAIN = "stop-defi-chain";

const HOME_PATH = app.getPath("home");
const CONFIG_FILE_NAME = path.join(HOME_PATH, "./.defi/defi.conf");
const UI_CONFIG_FILE_NAME = path.join(HOME_PATH, "./.defi/defi.ui.yaml");

const BINARY_FILE_NAME = "bitcoind";
const BINARY_FILE_PATH =
  IS_DEV ? path.join(rootPath, "./binary", getPlatform())
    : path.join(rootPath, "Contents", "Resources", "binary", getPlatform());

const RANDOM_USERNAME_LENGTH = 8;
const DEFAULT_RPC_BIND = "127.0.0.1";
const DEFAULT_RPC_PORT = 8555;

module.exports = {
  APP_NAME,
  PRELAUNCH_PREFERENCE_STATUS,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_DISABLE,
  GET_CONFIG_DETAILS,
  START_DEFI_CHAIN,
  START_DEFI_CHAIN_REPLY,
  STOP_DEFI_CHAIN,
  CONFIG_FILE_NAME,
  UI_CONFIG_FILE_NAME,
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  RANDOM_USERNAME_LENGTH,
  DEFAULT_RPC_BIND,
  DEFAULT_RPC_PORT
};
