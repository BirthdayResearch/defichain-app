import path from 'path';
import {outputPath} from '../utils/env';
export const devServerConfig = {
    compress: true,
    noInfo: false,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    overlay: false,
    headers: {'Access-Control-Allow-Origin': '*'},
    contentBase: outputPath,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100,
    },
    historyApiFallback: {
        verbose: true,
        disableDotRule: false,
    },
};
