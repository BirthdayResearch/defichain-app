const fs = require("fs");
const base64 = require("base-64");
const utf8 = require("utf8");
const cryptoJs = require("crypto-js");
const { platform } = require("os");
const ps = require("ps-node");

const getPlatform = () => {
  switch (platform()) {
    case "aix":
    case "freebsd":
    case "linux":
    case "openbsd":
    case "android":
      return "linux";
    case "darwin":
    case "sunos":
      return "mac";
    case "win32":
      return "win";
  }
};

const getBinaryParameter = (obj = {}) => {
  const keys = Object.keys(obj);
  return keys.map(key => `-${key}=${obj[key]}`)
}

const responseMessage = (success, res) => {
  if (success) {
    return { success: true, data: res };
  }
  return { success: false, message: res.message };
}

// Check file exists or not 
const checkFileExists = (filePath) => {
  return filePath && fs.existsSync(filePath);
}

// Get file data
const getFileData = (filePath, format) => {
  try {
    return fs.readFileSync(filePath, format);
  } catch (err) {
    throw err;
  }
}

// write / append on UI config file
const writeFile = (filePath, data, append) => {
  try {
    if (append && checkFileExists(filePath)) {
      return fs.appendFileSync(filePath, data);
    } else {
      return fs.writeFileSync(filePath, data, "utf8");
    }
  } catch (err) {
    throw err;
  }
}


const generatePassword = () => {
  //  Create 32 byte password
  const encoded = base64.encode(cryptoJs.lib.WordArray.random(32));
  const bytes = base64.decode(encoded);
  return utf8.decode(bytes);
};


//  get default RPC auth
const getRpcAuth = (username) => {
  const password = generatePassword();
  const salt = cryptoJs.lib.WordArray.random(16);
  const passwordHmac = cryptoJs.HmacSHA256(password, salt);
  return `${username}:${salt}$${passwordHmac}`;
};

const getProcesses = (args) => {
  return new Promise((resolve, reject) => {
    ps.lookup(args, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

const stopProcesses = (processId) => {
  return new Promise((resolve, reject) => {
    ps.kill(processId, "SIGTERM", (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

module.exports = {
  getPlatform,
  getBinaryParameter,
  responseMessage,
  checkFileExists,
  getFileData,
  writeFile,
  getRpcAuth,
  getProcesses,
  stopProcesses
};
