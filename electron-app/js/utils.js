const fs = require("fs");
const base64 = require("base-64");
const utf8 = require("utf8");
const cryptoJs = require("crypto-js");

const responseMessage = (success, res) => {
  if (success) {
    return { success: true, data: res };
  }
  return { success: false, message: res.message };
}

// Check file exists or not 
const checkFileExists = (path) => {
  return path && fs.existsSync(path);
}

// Get file data
const getFileData = (path, format) => {
  try {
    return fs.readFileSync(path, format);
  } catch (err) {
    throw err;
  }
}

// write / append on UI config file
const writeFile = (path, data, append) => {
  try {
    if (append && checkFileExists(path)) {
      return fs.appendFileSync(path, data);
    } else {
      return fs.writeFileSync(path, data, 'utf8');
    }
  } catch (err) {
    throw err;
  }
}


const generatePassword = () => {
  //  Create 32 byte b64 password
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

module.exports = {
  responseMessage,
  checkFileExists,
  getFileData,
  writeFile,
  getRpcAuth
}
