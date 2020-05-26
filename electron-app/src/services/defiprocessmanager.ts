import log from 'loglevel';
import * as path from 'path';
import { spawn } from 'child_process';
import {
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  CONFIG_FILE_NAME,
  START_DEFI_CHAIN_REPLY,
  PID_FILE_NAME,
} from '../constants';
import {
  checkPathExists,
  getFileData,
  getProcesses,
  responseMessage,
  stopProcesses,
  writeFile,
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
              responseMessage(true, { message: 'Node already running' })
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
        `-pid=${PID_FILE_NAME}`,
      ]);
      log.info('Node start initiated');

      // on STDOUT
      child.stdout.on('data', () => {
        if (!nodeStarted) {
          nodeStarted = true;
          log.info('Node started');
          if (event)
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(true, { message: 'Node started' })
            );
        }
      });

      // on STDERR
      child.stderr.on('data', (err) => {
        log.error(err.toString('utf8').trim());
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

  async stop() {
    try {
      const pid = getFileData(PID_FILE_NAME);
      const processLists: any = await getProcesses({ pid: parseInt(pid, 10) });
      for (const eachProcess of processLists) {
        if (eachProcess.pid) {
          await stopProcesses(eachProcess.pid);
          log.info(`Process killed with pid: ${eachProcess.pid}`);
        }
      }
      return responseMessage(true, {
        message: 'Initiated termination of node',
      });
    } catch (err) {
      log.error(err);
      return responseMessage(false, err);
    }
  }
}
