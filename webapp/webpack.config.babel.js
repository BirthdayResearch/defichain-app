import merge from 'webpack-merge';

import baseConfig from './webpack/webpack.config.base';
import devConfig from './webpack/webpack.config.dev';
import { isProd } from './webpack/utils/env';
import prodConfig from './webpack/webpack.config.prod';

export default () =>
  isProd ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);
