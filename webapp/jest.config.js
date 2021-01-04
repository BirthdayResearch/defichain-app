module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
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
};
