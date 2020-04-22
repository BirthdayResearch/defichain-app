const path = require("path");
const { spawn } = require("child_process");
const { dialog } = require("electron")
const { CONFIG_FILE_NAME, BINARY_FILE_NAME, BINARY_FILE_PATH } = require("../constant")
const {
  getBinaryParameter,
  responseMessage,
  getProcesses,
  stopProcesses,
  checkFileExists,
} = require("../utils");

const execPath = path.resolve(path.join(BINARY_FILE_PATH, BINARY_FILE_NAME));

class DefiNode {
  async start(params) {
    try {
      const processLists = await getProcesses({ command: execPath });
      if (processLists.length) {
        return responseMessage(true, { message: "Node already running" });
      }
      if (!checkFileExists(execPath)) {
        throw new Error("Binary file is not available");
      }
      const config = getBinaryParameter(params);
      const child = spawn(execPath, [`-conf=${CONFIG_FILE_NAME}`]);
      child.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      })
      child.stderr.on("data", data => {
        dialog.showMessageBox({
          type: "info",
          message: "error!",
          detail: JSON.stringify(data),
          buttons: ["OK"]
        });
      })
      child.on("close", code => {
        dialog.showMessageBox({
          type: "info",
          message: "closed!",
          detail: `child process exited with code ${code}`,
          buttons: ["OK"]
        });
      })
      return responseMessage(true, { message: "Node started" });
    } catch (err) {
      console.log(err);
      return responseMessage(false, err);
    }
  }
  async stop() {
    try {
      const processLists = await getProcesses({ command: execPath });
      for (let i = 0; i < processLists.length; i++) {
        const eachProcess = processLists[i];
        if (eachProcess.pid) {
          await stopProcesses(eachProcess.pid);
        }
      }
      return responseMessage(true, { message: "Initiated termination of node" });
    } catch (err) {
      console.log(err);
      return responseMessage(false, err);
    }
  }
}

module.exports = DefiNode;
