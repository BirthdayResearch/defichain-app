import { join } from 'path';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import { isDev, rootDir } from '../utils/env';

const config = {
    async: isDev,
    typescript: {
        configFile: join(rootDir, '/tsconfig.json'),
    },
    eslint: { enabled: false, files: '../src/**/*.{ts,tsx}' },
    logger: { infrastructure: 'console', issues: 'console', devServer: true },
};

export const forkTsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin(
    config,
);
