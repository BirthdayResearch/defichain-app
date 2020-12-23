import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const config = {
    cleanOnceBeforeBuildPatterns: ['**/*'],
};

export const cleanWebpackPlugin = new CleanWebpackPlugin(config);
