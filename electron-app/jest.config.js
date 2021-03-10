const { resolve } = require('path');
const originalProcess = process;
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', ''],
  setupFiles: ['<rootDir>/test/setupTests.ts'],
  transform: {
    '^.+\\.[ts|tsx]?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleNameMapper: {
    '@defi_types/(.*)$': resolve(__dirname, '../', './typings/$1'),
  },
};
