const path = require("path");
const { app } = require("electron");

const APP_NAME = "DeFi";
const PRELAUNCH_PREFERENCE_STATUS = "prelaunch-preference-status";
const PRELAUNCH_PREFERENCE_ENABLE = "prelaunch-preference-enable";
const PRELAUNCH_PREFERENCE_DISABLE = "prelaunch-preference-disable";

const GET_CONFIG_DETAILS = "get-config-details";
const CONFIG_FILE_NAME = path.join(app.getPath("home"), "./.defi/defi.conf");
const UI_CONFIG_FILE_NAME = path.join(app.getPath("home"), "./.defi/defi.ui.yaml");
const RANDOM_USERNAME_LENGTH = 8;
const DEFAULT_RPC_BIND = "127.0.0.1";
const DEFAULT_RPC_PORT = 8555;

module.exports = {
  APP_NAME,
  PRELAUNCH_PREFERENCE_STATUS,
  PRELAUNCH_PREFERENCE_ENABLE,
  PRELAUNCH_PREFERENCE_DISABLE,
  GET_CONFIG_DETAILS,
  CONFIG_FILE_NAME,
  UI_CONFIG_FILE_NAME,
  RANDOM_USERNAME_LENGTH,
  DEFAULT_RPC_BIND,
  DEFAULT_RPC_PORT
}
