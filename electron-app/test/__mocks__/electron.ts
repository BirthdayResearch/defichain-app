module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    name: '',
    getPath: () => '',
  },
  remote: {
    app: {
      getPath: jest.fn(),
    },
  },
  dialog: jest.fn(),
}
