const path = require("path");
const { spawn } = require("child_process");
const { dialog } = require("electron")
const { CONFIG_FILE_NAME, BINARY_FILE_NAME, BINARY_FILE_PATH } = require("../constant")
const { getBinaryParameter, responseMessage } = require("../utils");
const execPath = path.resolve(path.join(BINARY_FILE_PATH, BINARY_FILE_NAME));

class DefiNode {
  start(params) {
    try {
      if (this.child) {
        dialog.showMessageBox({
          type: "info",
          message: "Success",
          detail: "Node already running",
          buttons: ["OK"]
        });
        return responseMessage(true, { message: "Node already running" });
      }
      const config = getBinaryParameter(params);
      this.child = spawn(execPath, [`-conf=${CONFIG_FILE_NAME}`]);
      dialog.showMessageBox({
        type: "info",
        message: "Success!",
        detail: "Node started",
        buttons: ["OK"]
      });
      this.child.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
      })
      this.child.stderr.on("data", data => {
        dialog.showMessageBox({
          type: "info",
          message: "error!",
          detail: data,
          buttons: ["OK"]
        });
      })
      this.child.on("close", code => {
        this.child = null;
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
  stop() {
    try {
      if (this.child) {
        const isProcessStopped = this.child.kill("SIGTERM");
        if (isProcessStopped) {
          return responseMessage(true, { message: "Initiated termination of node" });
        }
      }
      throw new Error("Error occurred to stop process");
    } catch (err) {
      console.log(err);
      return responseMessage(false, err);
    }
  }
}

module.exports = DefiNode;
