import * as log from './electronLogger';
import * as path from 'path';
import ini from 'ini';
import { spawn } from 'child_process';
import {
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  CONFIG_FILE_NAME,
  START_DEFI_CHAIN_REPLY,
  PID_FILE_NAME,
  DEFAULT_FALLBACK_FEE,
  DEFAULT_RPC_ALLOW_IP,
  STOP_BINARY_INTERVAL,
  REINDEX_ERROR_STRING,
} from '../constants';
import {
  checkPathExists,
  getFileData,
  getProcesses,
  responseMessage,
  writeFile,
  sleep,
} from '../utils';

// EXCEPTION handling event response inside service
// TODO restructure DefiProcessManager
export default class DefiProcessManager {
  async start(params: any, event: Electron.IpcMainEvent) {
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
      const child = spawn(execPath, [
        `-conf=${CONFIG_FILE_NAME}`,
        `-rpcallowip=${DEFAULT_RPC_ALLOW_IP}`,
        `-fallbackfee=${DEFAULT_FALLBACK_FEE}`,
        `-pid=${PID_FILE_NAME}`,
      ]);
      log.info('Node start initiated');

      // on STDOUT
      child.stdout.on('data', (data) => {
        log.info(data.toString('utf8'));
        if (!nodeStarted) {
          nodeStarted = true;
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
        const regex = new RegExp(REINDEX_ERROR_STRING, 'g');
        const res = regex.test(err?.toString('utf8').trim());
        log.info(`**** ${err.toString('utf8').trim()},  res:${res}`);
        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(false, { message: err.toString('utf8').trim() })
          );
      });

      // on close
      child.on('close', (code) => {
        log.info(`child process exited with code ${code}`);
        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(
              false,
              new Error(`child process exited with code ${code}`)
            )
          );
      });
    } catch (err) {
      log.error(err);
      if (event)
        event.sender.send(START_DEFI_CHAIN_REPLY, responseMessage(false, err));
      return responseMessage(false, err);
    }
  }

  getConfiguration() {
    if (checkPathExists(CONFIG_FILE_NAME)) {
      const data = getFileData(CONFIG_FILE_NAME, 'utf-8');
      return ini.parse(data);
    }
    return {};
  }

  async stop() {
    try {
      const pid = getFileData(PID_FILE_NAME);
      while (true) {
        const processLists: any = await getProcesses({
          pid: parseInt(pid, 10),
        });
        if (Array.isArray(processLists) && processLists.length === 0) {
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

  async restart(args: any, event: Electron.IpcMainEvent) {
    log.info('Restart node started');
    const stopResponse = await this.stop();
    if (args.updatedConf && Object.keys(args.updatedConf).length) {
      const updatedConfigData = ini.encode(args.updatedConf);
      writeFile(CONFIG_FILE_NAME, updatedConfigData, false);
    }
    const startResponse = await this.start({}, event);
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
}
