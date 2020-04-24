import * as path from "path";
import { spawn } from "child_process";
import {
  CONFIG_FILE_NAME,
  BINARY_FILE_NAME,
  BINARY_FILE_PATH,
  START_DEFI_CHAIN_REPLY,
} from "../constant";
import {
  getBinaryParameter,
  responseMessage,
  getProcesses,
  stopProcesses,
  checkFileExists,
} from "../utils";

const execPath = path.resolve(path.join(BINARY_FILE_PATH, BINARY_FILE_NAME));

export default class DefiNode {
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
      const processLists: any = await getProcesses({ command: execPath });
      if (processLists.length) {
        event.sender.send(
          START_DEFI_CHAIN_REPLY,
          responseMessage(true, { message: "Node already running" })
        );
        return responseMessage(true, { message: "Node already running" });
      }
      if (!checkFileExists(execPath)) {
        throw new Error(execPath);
      }
      let nodeStarted = false;
      // TODO run binary with config data ;
      const config = getBinaryParameter(params);
      const child = spawn(execPath, [`-conf=${CONFIG_FILE_NAME}`]);
      child.stdout.on("data", (data) => {
        if (!nodeStarted) {
          nodeStarted = true;
          console.log("Node started");
          if (event)
            return event.sender.send(
              START_DEFI_CHAIN_REPLY,
              responseMessage(true, { message: "Node started" })
            );
        }
      });
      child.stderr.on("data", (err) => {
        console.log(err.toString("utf8").trim());
        if (event)
          return event.sender.send(
            START_DEFI_CHAIN_REPLY,
            responseMessage(false, { message: err.toString("utf8").trim() })
          );
      });
      child.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
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
      console.log(err);
      event.sender.send(START_DEFI_CHAIN_REPLY, responseMessage(false, err));
      return responseMessage(false, err);
    }
  }
  async stop() {
    try {
      const processLists: any = await getProcesses({ command: execPath });
      for (let i = 0; i < processLists.length; i++) {
        const eachProcess = processLists[i];
        if (eachProcess.pid) {
          await stopProcesses(eachProcess.pid);
        }
      }
      return responseMessage(true, {
        message: "Initiated termination of node",
      });
    } catch (err) {
      console.log(err);
      return responseMessage(false, err);
    }
  }
}
