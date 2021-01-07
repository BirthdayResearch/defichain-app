import * as log from './electronLogger';
import { app } from 'electron';
import * as path from 'path';
import ini from 'ini';
import { spawn } from 'child_process';
import {
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  CONFIG_FILE_NAME,
  PID_FILE_NAME,
  DEFAULT_FALLBACK_FEE,
  DEFAULT_RPC_ALLOW_IP,
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
} from '../utils';
import { START_DEFI_CHAIN_REPLY } from '@defi_types/ipcEvents';

// EXCEPTION handling event response inside service
// TODO restructure DefiProcessManager
export default class DefiProcessManager {
  static isReindexReq: boolean;
  static isStartedNode: boolean = false;

  static async start(params: any, event: Electron.IpcMainEvent) {
    try {
      if (checkPathExists(PID_FILE_NAME)) {
        const pid = getFileData(PID_FILE_NAME);
        const processLists: any = await getProcesses({
          pid: parseInt(pid, 10),
        });
        if (processLists.length) {
          if (event)
            event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(true, {
                message: 'Node already running',
                conf: this.getConfiguration(),
              })
            );
          return responseMessage(true, { message: 'Node already running' });
        }
      }

      const execPath = path.resolve(
        path.join(BINARY_FILE_PATH, BINARY_FILE_NAME)
      );

      if (!checkPathExists(execPath)) {
        throw new Error(`${execPath} file not available`);
      }

      let nodeStarted = false;
      // TODO Harsh run binary with config data
      // const config = getBinaryParameter(params)
      const configArray = [
        `-conf=${CONFIG_FILE_NAME}`,
        `-rpcallowip=${DEFAULT_RPC_ALLOW_IP}`,
        `-fallbackfee=${DEFAULT_FALLBACK_FEE}`,
        `-pid=${PID_FILE_NAME}`,
        `-acindex`,
        // `-reindex-chainstate`
      ];

      if (params && params.isReindexReq) {
        configArray.push('-reindex');
      }

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
        if (event && this.isReindexReq) {
          log.info(
            'Corrupted block database detected. Please restart with -reindex or -reindex-chainstate to recover.'
          );
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(false, {
              message:
                'Corrupted block database detected. Please restart with -reindex or -reindex-chainstate to recover.',
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
      const pid = getFileData(PID_FILE_NAME);
      while (true) {
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
    log.info('Restart node started');
    const stopResponse = await this.stop();
    if (args && args.updatedConf && Object.keys(args.updatedConf).length) {
      const updatedConfigData = ini.encode(args.updatedConf);
      writeFile(CONFIG_FILE_NAME, updatedConfigData, false);
    }
    const startResponse = await this.start(args || {}, event);
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

  static async closeApp() {
    app.quit();
  }

  static async forceClose() {
    try {
      log.info('Force close defid');
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
