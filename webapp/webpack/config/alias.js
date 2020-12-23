import {join} from 'path';

import {rootDir} from '../utils/env';

export const aliasItems = {
    '@src': join(rootDir, '/src'),
    '@assets': join(rootDir, '/src/assets'),
    '@styles': join(rootDir, '/src/scss'),
    '@components': join(rootDir, '/src/components'),
    '@containers': join(rootDir, '/src/containers'),
};
