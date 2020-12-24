import {join} from 'path';

import {parseArguments} from './helpers';

const parsedArguments = parseArguments();
export const mode = parsedArguments.mode ?? 'production';
export const isProd = mode === 'production';
export const isDev = !isProd;
export const rootDir = join(__dirname, '../../');
export const webpackDir = join(__dirname, '../');

export let outputPath = isProd ? './build/release' : './build/debug';
if (outputPath.startsWith('./')) {
    outputPath = join(__dirname, outputPath);
}
