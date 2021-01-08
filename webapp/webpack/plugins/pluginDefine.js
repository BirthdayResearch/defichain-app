import { DefinePlugin } from 'webpack';

import { isDev, isProd, mode } from '../utils/env';

const config = {
    'process.env': {
        NODE_ENV: JSON.stringify(mode),
    },
    IS_PROD: isProd,
    IS_DEV: isDev,
};

export const definePlugin = new DefinePlugin(config);
