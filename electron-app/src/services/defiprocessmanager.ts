import * as log from './electronLogger';
import * as path from 'path';
import { spawn } from 'child_process';
import {
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  CONFIG_FILE_NAME,
  PID_FILE_NAME,
  STOP_BINARY_INTERVAL,
  REINDEX_ERROR_STRING,
  ACCOUNT_HISTORY_REINDEX_ERROR_STRING,
  NODE_SYNTAX_ERROR,
} from '../constants';
import {
  checkPathExists,
  getFileData,
  getProcesses,
  responseMessage,
  createResponseMessage,
  sleep,
  stopProcesses,
  getIniData,
  deletePeersFile,
  deleteBlocksAndRevFiles,
  deleteBanlist,
} from '../utils';
import { START_DEFI_CHAIN_REPLY } from '@defi_types/ipcEvents';
import {
  DEFAULT_FALLBACK_FEE,
  DEFAULT_RPC_ALLOW_IP,
  MAJOR_VERSION,
  MINOR_VERSION,
  REINDEX_NODE_UPDATE,
} from '@defi_types/settings';
import packageInfo from '../../../package.json';
import { WalletMap } from '../../../typings/walletMap';
import semverDiff from 'semver/functions/diff';
import {
  createOrGetWalletMap,
  overwriteConfigFile,
} from '../controllers/wallets';
import { CONFIG_ENABLED, RPCConfigItem } from '../../../typings/rpcConfig';

const checkIfNodeVersionChanged = (
  ainVersion: string,
  walletMap: WalletMap
) => {
  try {
    if (walletMap) {
      log.info(
        `Current Node: ${walletMap.nodeVersion} New Node: ${ainVersion}`
      );
      const isNodeVersionNull = walletMap.nodeVersion == null;
      const diff = !isNodeVersionNull
        ? semverDiff(walletMap.nodeVersion, ainVersion)
        : '';
      const isMajorOrMinorUpdate = [MAJOR_VERSION, MINOR_VERSION].includes(
        diff
      );
      return isNodeVersionNull || isMajorOrMinorUpdate;
    } else {
      return false;
    }
  } catch (error) {
    log.error(error);
  }
};

const checkIfSPVSyncNeeded = (config: RPCConfigItem, walletMap: WalletMap) => {
  try {
    let isSyncNeeded = false;
    const activeConfig =
      config.testnet === CONFIG_ENABLED ? config.test : config.main;
    if (activeConfig?.spv === CONFIG_ENABLED) {
      if (walletMap) {
        isSyncNeeded = !walletMap.hasSyncSPV;
      }
    }
    return isSyncNeeded;
  } catch (error) {
    log.error(error);
  }
};
export default class DefiProcessManager {
  static isReindexReq: boolean;
  static isStartedNode: boolean = false;

  static async start(params: any, event: Electron.IpcMainEvent) {
    const METHOD_NAME = 'start';
    this.logger('Starting node connection...', METHOD_NAME, false);
    try {
      //* App wallet configurations
      const walletMap: WalletMap = createOrGetWalletMap();

      //* Set config array for initial RPC call
      const configArray = [
        `-conf=${CONFIG_FILE_NAME}`,
        `-rpcallowip=${DEFAULT_RPC_ALLOW_IP}`,
        `-fallbackfee=${DEFAULT_FALLBACK_FEE}`,
        `-pid=${PID_FILE_NAME}`,
      ];

      //* Delete peers file to cleanup nonfunctional peers only when re-index is present
      //* Delete block and rev files for high memory usage
      if (params?.isReindexReq || this.isReindexReq) {
        this.logger('Adding -reindex in configArray', METHOD_NAME, false);
        configArray.push('-reindex');
        if (params?.isDeletePeersAndBlocksreq) {
          deletePeersFile();
          deleteBanlist();
          deleteBlocksAndRevFiles();
        }
        this.isReindexReq = false;
      }

      //* Check if SPV Sync is needed
      if (checkIfSPVSyncNeeded(this.getConfiguration(), walletMap)) {
        this.logger('Adding -spv_resync in configArray', METHOD_NAME, false);
        configArray.push('-spv_resync');
        walletMap.hasSyncSPV = true;
      }

      //* Check if Node changes
      const { ainVersion } = packageInfo;
      if (
        checkIfNodeVersionChanged(ainVersion, walletMap) &&
        !params?.skipVersionCheck
      ) {
        this.logger(REINDEX_NODE_UPDATE, METHOD_NAME, false);
        return event.sender.send(
          START_DEFI_CHAIN_REPLY,
          createResponseMessage(false, {
            message: REINDEX_NODE_UPDATE,
            isReindexReq: true,
            nodeVersion: ainVersion,
            walletMap,
          })
        );
      } else {
        walletMap.nodeVersion = ainVersion;
      }

      //* Check if defi.pid process is existing
      if (checkPathExists(PID_FILE_NAME)) {
        try {
          const pid = getFileData(PID_FILE_NAME);
          const processLists: any = await getProcesses({
            pid: parseInt(pid, 10),
          });
          if (processLists.length) {
            const NODE_RUNNING = 'Node already running';
            this.logger(NODE_RUNNING, METHOD_NAME, false);
            if (event)
              event.sender.send(
                START_DEFI_CHAIN_REPLY,
                createResponseMessage(true, {
                  message: NODE_RUNNING,
                  conf: this.getConfiguration(),
                  walletMap,
                })
              );
            return responseMessage(true, { message: NODE_RUNNING });
          }
        } catch (error) {
          log.error(error);
        }
      }

      const execPath = path.resolve(
        path.join(BINARY_FILE_PATH, BINARY_FILE_NAME)
      );

      if (!checkPathExists(execPath)) {
        throw new Error(`${execPath} file not available`);
      }

      let nodeStarted = false;
      const child = spawn(execPath, configArray);
      this.logger('Node start initiated', METHOD_NAME, false);

      //* When node receives data
      child.stdout.on('data', (data) => {
        if (!nodeStarted) {
          nodeStarted = true;
          this.isStartedNode = true;
          this.logger('Node started', METHOD_NAME, false);
          if (event) {
            this.logger('Sending node started to client', METHOD_NAME, false);
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              createResponseMessage(true, {
                message: 'Node started',
                conf: this.getConfiguration(),
                walletMap,
              })
            );
          }
        }
      });

      //* When node receives any error messages
      child.stderr.on('data', (err) => {
        const regex = new RegExp(REINDEX_ERROR_STRING, 'gi');
        const regex1 = new RegExp(ACCOUNT_HISTORY_REINDEX_ERROR_STRING, 'gi');
        const regex2 = new RegExp(NODE_SYNTAX_ERROR, 'gi');
        const regexCheck = [regex, regex1, regex2];

        const errorString = err?.toString('utf8').trim();
        const shouldReindex = regexCheck.some((reg: RegExp) =>
          reg.test(errorString)
        );
        //* Checks the error message from node if a re-index is needed
        if (shouldReindex) {
          this.isReindexReq = shouldReindex;
        }
        this.logger(
          `Error on node connection: ${errorString}`,
          METHOD_NAME,
          true
        );
        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            createResponseMessage(false, {
              message: errorString,
              isReindexReq: this.isReindexReq,
              walletMap,
            })
          );
      });

      //* When node closes
      child.on('close', (code) => {
        this.logger(`Node is closed with code ${code}`, METHOD_NAME, false);
        if (code !== 0) {
          if (event) {
            const message = `Error occurred while closing node with code: ${code}`;
            this.logger(message, METHOD_NAME, true);
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              createResponseMessage(false, {
                message,
                walletMap,
              })
            );
          }
        }
      });
    } catch (err) {
      log.error(err);
      if (event)
        event.sender.send(
          START_DEFI_CHAIN_REPLY,
          createResponseMessage(false, err)
        );
      return responseMessage(false, err);
    }
  }

  static logger(message: string, method: string, isError: boolean = false) {
    const logType = isError ? log.error : log.info;
    logType(`[${method}] - ${message}`);
  }

  static getConfiguration() {
    return getIniData(CONFIG_FILE_NAME);
  }

  /**
   *
   * @description - App triggers the closing of RPC. This method just waits for all processes to close before sending a response.
   */
  static async stop() {
    try {
      log.info('[Stop Node] Start DeFiProcessManager shutdown...');
      const pid = getFileData(PID_FILE_NAME);
      while (true) {
        log.info('Attempting Defi Process Manager Stop...');
        const processLists: any = await getProcesses({
          pid: parseInt(pid, 10),
        });
        if (Array.isArray(processLists) && processLists.length === 0) {
          this.isStartedNode = false;
          return responseMessage(true, {
            message: 'Node is successfully terminated',
          });
        } else {
          await sleep(STOP_BINARY_INTERVAL);
        }
      }
    } catch (err) {
      log.error(err);
      return responseMessage(false, err);
    }
  }

  static async restart(args: any, event: Electron.IpcMainEvent) {
    log.info('[Restart Node] Starting');
    const stopResponse = await this.stop();
    log.info('[Restart Node] Stop completed');
    if (args && args.updatedConf && Object.keys(args.updatedConf).length) {
      overwriteConfigFile(args.updatedConf);
    }
    log.info('[Restart Node] Restarting DefiProcessManager');
    const startResponse = await this.start(args || {}, event);
    log.info('[Restart Node] Start completed');
    if (
      stopResponse &&
      startResponse &&
      stopResponse.success &&
      startResponse.success
    ) {
      return responseMessage(true, {
        message: 'Restart Node Success',
      });
    } else {
      return responseMessage(true, {
        message: 'Restart Node Failure',
      });
    }
  }

  static async forceClose() {
    try {
      log.info('Force Close DeFi Process Manager');
      const pid = getFileData(PID_FILE_NAME);
      const processLists: any = await getProcesses({
        pid: parseInt(pid, 10),
      });

      if (Array.isArray(processLists)) {
        await Promise.all(processLists.map((item) => stopProcesses(item.pid)));
        this.isStartedNode = false;
        return responseMessage(true, {
          message: 'Node is successfully terminated',
        });
      }
    } catch (err) {
      log.info(err);
      return responseMessage(false, {
        message: err.message,
      });
    }
  }
}
