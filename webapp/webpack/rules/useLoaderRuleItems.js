import { join } from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { isProd, rootDir, webpackDir } from '../utils/env';

export const cssLoader = {
  loader: 'css-loader',
};

/**
 * Sass loader with sass-resources-loader
 */
export const sassLoaderItems = [
  {
    loader: 'sass-loader',
    options: {
      sourceMap: !isProd,
      implementation: require('sass'),
    },
  },
];

export const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: join(webpackDir, './config/postcss.js'),
    },
    sourceMap: !isProd,
  },
};

/***
 * Using MiniCssExtractPlugin in production or style-loader in development
 * @see https://webpack.js.org/plugins/mini-css-extract-plugin/#root
 * @see https://webpack.js.org/loaders/style-loader/#root
 */
export const miniCssExtractLoader = isProd
  ? {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    }
  : {
      loader: 'style-loader',
      options: {
        esModule: false,
      },
    };

/**
 * @see https://webpack.js.org/loaders/sass-loader/#problems-with-url
 */
export const resolveUrlLoader = {
  loader: 'resolve-url-loader',
  options: {
    sourceMap: !isProd,
  },
};

export const babelLoader = {
  loader: 'babel-loader',
  options: {
    configFile: join(rootDir, '/.babelrc.js'),
  },
};

export const cssModulesSupportLoaderItems = [
  miniCssExtractLoader,
  {
    ...cssLoader,
    options: {
      esModule: false,
      modules: {
        auto: true,
        compileType: 'module',
        localIdentName: isProd ? '[hash:base64]' : '[path][name]__[local]',
        exportLocalsConvention: 'asIs',
      },
    },
  },
];

export const cssLoaderItems = [miniCssExtractLoader, cssLoader];
