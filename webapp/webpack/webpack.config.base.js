import path from 'path';

import entry from './webpack.config.entry';
import optimization from './webpack.config.optimization';
import * as plugins from './plugins';
import * as rules from './rules';
import {isProd, outputPath} from './utils/env';
import {arrayFilterEmpty} from './utils/helpers';

export default {
    context: __dirname,
    entry,
    output: {
        path: outputPath,
        filename: '[name].[contenthash].js',
    },
    module: {
        rules: arrayFilterEmpty([
            rules.typescriptRule,
            rules.htmlRule,
            rules.imagesRule,
            rules.fontsRule,
            rules.cssRule,
            rules.txtRule,
            rules.mp3Rule,
            rules.workerRule(isProd),
            ...rules.sassRules,
            ...rules.svgRules,
        ]),
    },
    plugins: arrayFilterEmpty([
        plugins.htmlWebpackPlugin,
        plugins.providePlugin,
        plugins.definePlugin,
        plugins.forkTsCheckerWebpackPlugin,
        // plugins.esLintPlugin,
        plugins.copyPlugin,
    ]),
    optimization,
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        modules: [path.join(__dirname, '../src'), 'node_modules'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
        },
    },
};
