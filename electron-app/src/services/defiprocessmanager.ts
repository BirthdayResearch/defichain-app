import * as log from './electronLogger';
import * as path from 'path';
import ini from 'ini';
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
  writeFile,
  sleep,
  stopProcesses,
  getIniData,
  deletePeersFile,
} from '../utils';
import { START_DEFI_CHAIN_REPLY } from '@defi_types/ipcEvents';
import {
  DEFAULT_FALLBACK_FEE,
  DEFAULT_RPC_ALLOW_IP,
} from '@defi_types/settings';

// EXCEPTION handling event response inside service
// TODO restructure DefiProcessManager
export default class DefiProcessManager {
  static isReindexReq: boolean;
  static isStartedNode: boolean = false;

  static async start(params: any, event: Electron.IpcMainEvent) {
    try {
      // TODO Harsh run binary with config data
      // const config = getBinaryParameter(params)
      const configArray = [
        `-conf=${CONFIG_FILE_NAME}`,
        `-rpcallowip=${DEFAULT_RPC_ALLOW_IP}`,
        `-fallbackfee=${DEFAULT_FALLBACK_FEE}`,
        `-pid=${PID_FILE_NAME}`,
        // `-acindex`,
        // `-reindex-chainstate`
      ];
      // * Delete peers file to cleanup nonfunctional peers only when re-index is present
      if (params?.isReindexReq) {
        configArray.push('-reindex');
        deletePeersFile();
      }
      if (checkPathExists(PID_FILE_NAME)) {
        try {
          const pid = getFileData(PID_FILE_NAME);
          const processLists: any = await getProcesses({
            pid: parseInt(pid, 10),
          });
          if (processLists.length) {
            const NODE_RUNNING = 'Node already running';
            log.info(NODE_RUNNING);
            if (event)
              event.sender.send(
                START_DEFI_CHAIN_REPLY,
                responseMessage(true, {
                  message: NODE_RUNNING,
                  conf: this.getConfiguration(),
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
      log.info('Node start initiated');

      // on STDOUT
      child.stdout.on('data', (data) => {
        if (!nodeStarted) {
          nodeStarted = true;
          this.isStartedNode = true;
          log.info('Node started');
          if (event)
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(true, {
                message: 'Node started',
                conf: this.getConfiguration(),
              })
            );
        }
      });

      // on STDERR
      child.stderr.on('data', (err) => {
        const regex = new RegExp(REINDEX_ERROR_STRING, 'gi');
        const regex1 = new RegExp(ACCOUNT_HISTORY_REINDEX_ERROR_STRING, 'gi');
        // any syntax errors from node side, force a reindex to avoid stoppage of app.
        const nodeRegexSyntax = new RegExp(NODE_SYNTAX_ERROR, 'gi');
        const regexCheck = [regex, regex1, nodeRegexSyntax];

        const errorString = err?.toString('utf8').trim();
        const shouldReindex = regexCheck.some((reg: RegExp) =>
          reg.test(errorString)
        );
        // change value of isReindexReq variable based on regex evaluation
        if (shouldReindex) {
          this.isReindexReq = shouldReindex;
        }

        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(false, { message: err.toString('utf8').trim() })
          );
      });

      // on close
      child.on('close', (code) => {
        log.info(`DefiProcessManager close with code ${code}`);
        if (code !== 0) {
          const reindexErrorMessage =
            'Corrupted block database detected. Please restart with -reindex or -reindex-chainstate to recover.';
          if (event && this.isReindexReq) {
            log.info(reindexErrorMessage);
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(false, {
                message: reindexErrorMessage,
                isReindexReq: this.isReindexReq,
              })
            );
          }

          if (event) {
            log.info(`Error occurred while running binary with code: ${code}`);
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(
                false,
                new Error(
                  `Error occurred while running binary with code: ${code}`
                )
              )
            );
          }
        }
      });
    } catch (err) {
      log.error(err);
      if (event)
        event.sender.send(START_DEFI_CHAIN_REPLY, responseMessage(false, err));
      return responseMessage(false, err);
    }
  }

  static getConfiguration() {
    return getIniData(CONFIG_FILE_NAME);
  }

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
      const updatedConfigData = ini.encode(args.updatedConf);
      writeFile(CONFIG_FILE_NAME, updatedConfigData, false);
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
