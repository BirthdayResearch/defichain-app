import { join } from 'path';

import CopyPlugin from 'copy-webpack-plugin';

import { rootDir } from '../utils/env';

const config = {
    patterns: [
        { from: join(rootDir, './src/assets/img/favicon.ico'), to: '.' },
    ],
};

export const copyPlugin = new CopyPlugin(config);
