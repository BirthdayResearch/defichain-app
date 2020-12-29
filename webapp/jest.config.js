const neutrino = require('neutrino');
const path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const config = neutrino().jest();
config.moduleNameMapper['^@/(.*)$'] = path.join(__dirname, 'src/$1')

module.exports = config;
