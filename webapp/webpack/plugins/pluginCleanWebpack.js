import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config = {
    cleanOnceBeforeBuildPatterns: ['**/*', '!profile.json'],
};

export const cleanWebpackPlugin = new CleanWebpackPlugin(config);
