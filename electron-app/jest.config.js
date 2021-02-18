const { resolve } = require('path');
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', ''],
  transform: {
    '^.+\\.[ts|tsx]?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleNameMapper: {
    '@defi_types/(.*)$': resolve(__dirname, '../', './typings/$1'),
  },
};
