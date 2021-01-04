import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';

import { devServerConfig } from './config';

export default {
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: devServerConfig,
};
