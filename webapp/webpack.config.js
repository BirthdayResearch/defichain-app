// Whilst the configuration object can be modified here, the recommended way of making
// changes is via the presets' options or Neutrino's API in `.neutrinorc.js` instead.
// Neutrino's inspect feature can be used to view/export the generated configuration.
const neutrino = require('neutrino');
const path = require('path');

module.exports = (storybookConfig = {}) => {
  console.log(path.resolve(__dirname, 'src/'));
  const neutrinoConfig = neutrino().webpack();
  return {
    ...neutrinoConfig,
    ...storybookConfig.config,
    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
  };
};
