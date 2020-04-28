import log from "loglevel";
import * as path from "path";
import { spawn } from "child_process";
import {
  CONFIG_FILE_NAME,
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  START_DEFI_CHAIN_REPLY,
  PID_FILE_NAME,
} from "../constant";
import {
  getBinaryParameter,
  responseMessage,
  getProcesses,
  stopProcesses,
  checkFileExists,
  writeFile,
  deleteFile,
  getFileData,
} from "../utils";

const execPath = path.resolve(path.join(BINARY_FILE_PATH, BINARY_FILE_NAME));

export default class ProcessManager {
  async start(
    params: any,
    event: {
      sender: {
        send: (
          arg0: string,
          arg1:
            | { success: boolean; data: any; message?: undefined }
            | { success: boolean; message: any; data?: undefined }
        ) => void;
      };
    }
  ) {
    try {
      if (checkFileExists(PID_FILE_NAME)) {
        const pid = getFileData(PID_FILE_NAME);
        const processLists: any = await getProcesses({ pid });
        if (processLists.length) {
          event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(true, { message: "Node already running" })
          );
          return responseMessage(true, { message: "Node already running" });
        }
      }

      if (!checkFileExists(execPath)) {
        throw new Error(execPath);
      }
      let nodeStarted = false;
      // TODO run binary with config data ;
      const config = getBinaryParameter(params);
      const child = spawn(execPath, [`-conf=${CONFIG_FILE_NAME}`]);
      log.info("Node start initiated");

      // on STDOUT
      child.stdout.on("data", (data) => {
        if (!nodeStarted) {
          nodeStarted = true;
          writeFile(PID_FILE_NAME, child.pid);
          log.info("Node started");
          if (event)
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(true, { message: "Node started" })
            );
        }
      });

      // on STDERR
      child.stderr.on("data", (err) => {
        log.error(err.toString("utf8").trim());
        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(false, { message: err.toString("utf8").trim() })
          );
      });

      // on close
      child.on("close", (code) => {
        log.info(`child process exited with code ${code}`);
        deleteFile(PID_FILE_NAME);
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
      const processLists: any = await getProcesses({ pid });
      for (let i = 0; i < processLists.length; i++) {
        const eachProcess = processLists[i];
        if (eachProcess.pid) {
          await stopProcesses(eachProcess.pid);
          log.info(`Process killed with pid: ${eachProcess.pid}`);
        }
      }
      return responseMessage(true, {
        message: "Initiated termination of node",
      });
    } catch (err) {
      log.error(err);
      return responseMessage(false, err);
    }
  }
}
