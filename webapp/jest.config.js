const { resolve } = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', ''],
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    '<rootDir>/test/setupTests.ts',
    '<rootDir>/test/setupRpcInitialData.ts',
  ],
  setupFiles: ['<rootDir>/test/mockLocalStorage.js'],
  transform: {
    '^.+\\.[ts|tsx]?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/mockModules.js',
    '\\.(css|less|sass|scss)$': '<rootDir>/test/mockStyles.js',
    '@defi_types/(.*)$': resolve(__dirname, '../', './typings/$1'),
  },
};
