import path from 'path';

import {aliasItems} from './config';
import entry from './webpack.config.entry';
import optimization from './webpack.config.optimization';
import * as plugins from './plugins';
import * as rules from './rules';
import {isProd} from './utils/env';
import {arrayFilterEmpty} from './utils/helpers';

let outputPath = process.env.WEBPACK_OUTPUT_PATH;
if (!outputPath) {
    outputPath = isProd ? './build/release' : './build/debug';
}
if (outputPath.startsWith('./')) {
    outputPath = path.resolve(__dirname, outputPath);
}

export default {
    context: __dirname,
    mode: isProd ? 'production' : 'development',
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
        plugins.esLintPlugin,
        plugins.copyPlugin,
    ]),
    resolve: {
        alias: aliasItems,
        extensions: ['.tsx', '.ts'],
    },
    optimization,
};
