const fs = require("fs");
const ini = require("ini");
const { responseMessage } = require("./../utils");
const { CONFIG_FILE_NAME } = require("./../constant");

const getConfig = async () => {
  try {
    const fileData = fs.readFileSync(CONFIG_FILE_NAME, "utf-8");
    const configData = ini.parse(fileData)
    return responseMessage(true, configData);
  } catch (err) {
    return responseMessage(false, err);
  }
}

module.exports = { getConfig }
