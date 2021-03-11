import { arrayFilterEmpty } from '../utils/helpers';
import {
  cssLoader,
  cssLoaderItems,
  cssModulesSupportLoaderItems,
  miniCssExtractLoader,
  postCssLoader,
  resolveUrlLoader,
  sassLoaderItems,
} from './useLoaderRuleItems';

/** css **/
export const cssRule = {
  test: /\.css$/,
  use: [miniCssExtractLoader, postCssLoader, resolveUrlLoader, cssLoader],
};

/** sass **/
export const sassModulesRule = {
  test: /\.module\.(css|sass|scss)$/,
  use: arrayFilterEmpty([
    ...cssModulesSupportLoaderItems,
    postCssLoader,
    resolveUrlLoader,
    ...sassLoaderItems,
  ]),
};

export const sassRule = {
  test: /\.s([ca])ss$/,
  exclude: /\.module.scss$/,
  use: arrayFilterEmpty([
    ...cssLoaderItems,
    postCssLoader,
    resolveUrlLoader,
    ...sassLoaderItems,
  ]),
};

export const sassRules = [sassModulesRule, sassRule];
