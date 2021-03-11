import { join } from 'path';

export const mode = process.env.NODE_ENV || 'development';
export const isProd = mode === 'production';
export const isDev = !isProd;
export const rootDir = join(__dirname, '../../');
export const webpackDir = join(__dirname, '../');

export let outputPath = isProd ? '../../build/release' : '../../build/debug';
if (outputPath.startsWith('../..')) {
  outputPath = join(__dirname, outputPath);
}
