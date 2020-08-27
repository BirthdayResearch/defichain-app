import * as base64 from 'base-64';
import * as fs from 'fs';
import * as ps from 'ps-node';
import * as utf8 from 'utf8';
import cryptoJs from 'crypto-js';
import { platform } from 'os';
import {
  DARWIN,
  WIN_32,
  LINUX,
  AIX,
  FREEBSD,
  OPENBSD,
  ANDROID,
  SUNOS,
  STOP_RPC_COMMAND,
  RPC_V,
} from './constants';
import axios from 'axios';

export const getPlatform = () => {
  switch (platform()) {
    case AIX:
    case FREEBSD:
    case LINUX:
    case OPENBSD:
    case ANDROID:
      return 'linux';
    case DARWIN:
    case SUNOS:
      return 'mac';
    case WIN_32:
      return 'win';
  }
};

export const getBinaryParameter = (obj: any = {}) => {
  let remote: any = {
    rpcallowip: '',
    rpcauth: '',
    rpcport: 0,
    rpcuser: '',
    rpcpassword: '',
    rpcbind: '',
  };
  remote.rpcallowip = '0.0.0.0/0';
  if (!!obj && Array.isArray(obj.remotes)) {
    remote = Object.assign({}, remote, obj.remotes[0]);
    remote.rpcbind = obj.remotes[0].rpcconnect;
    delete remote.rpcconnect;
  }
  return Object.keys(remote).map((key) => `-${key}=${remote[key]}`);
};

export const responseMessage = (success: boolean, res: any) => {
  if (success) {
    return { success: true, data: res };
  }
  return { success: false, message: res.message };
};

// Check file exists or not
export const checkPathExists = (filePath: string) => {
  return fs.existsSync(filePath);
};

// Check file exists or not
export const deleteFile = (filePath: string) => {
  return fs.unlinkSync(filePath);
};

// Check file exists or not
export const createDir = (dirPath: string) => {
  return fs.mkdirSync(dirPath);
};

// Get file data
export const getFileData = (filePath: string, format: string = 'utf-8') => {
  return fs.readFileSync(filePath, format);
};

// write / append on UI config file
export const writeFile = (filePath: string, data: any, append?: boolean) => {
  if (append && checkPathExists(filePath)) {
    return fs.appendFileSync(filePath, data);
  } else {
    return fs.writeFileSync(filePath, data, 'utf8');
  }
};

export const generatePassword = () => {
  //  Create 32 byte password
  const salt = cryptoJs.lib.WordArray.random(32);
  const encoded = base64.encode(salt.toString());
  const bytes = base64.decode(encoded);
  return utf8.decode(bytes);
};

//  get default RPC auth
export const getRpcAuth = (rpcuser: string) => {
  const rpcpassword = generatePassword();
  const salt = cryptoJs.lib.WordArray.random(16);
  const passwordHmac = cryptoJs.HmacSHA256(rpcpassword, salt);
  return {
    rpcuser,
    rpcpassword,
    rpcauth: `${rpcuser}:${salt}$${passwordHmac}`,
  };
};

export const getProcesses = (args: any) => {
  return new Promise((resolve, reject) => {
    ps.lookup(args, (err: any, result: unknown) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const stopProcesses = (processId: number | string) => {
  return new Promise((resolve, reject) => {
    ps.kill(processId, 'SIGTERM', (err: any, result: unknown) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const callStopBinary = (
  rpcauth: string,
  rpcconnect: string,
  rpcport: string
) => {
  return axios.post(`http://${rpcauth}@${rpcconnect}:${rpcport}/`, {
    jsonrpc: RPC_V,
    id: Math.random().toString().substr(2),
    method: STOP_RPC_COMMAND,
    params: [],
  });
};
