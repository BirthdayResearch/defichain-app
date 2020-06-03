const convict = require('convict');
import { configJson } from './config.json';

export const config = convict({
  wallet: {
    txnPageSize: {
      doc: 'page size for wallet transactions',
      default: 2,
      format: Number,
    },
  },
  block: {
    pageSize: {
      doc: 'page size for blocks',
      default: 2,
      format: Number,
    }
  }
});

config.load(configJson);
console.log('Starting service with', config.toString());
config.validate({ allowed: 'strict' });
