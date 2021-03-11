/**
 * @see https://webpack.js.org/guides/typescript/#loader
 */
export const typescriptRule = {
  test: /\.tsx?$/,
  loader: 'ts-loader',
  options: {
    transpileOnly: true,
  },
  exclude: /node_modules/,
};

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
export const htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: 'html-loader',
  },
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const imagesRule = {
  test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
  type: 'asset/resource',
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const fontsRule = {
  test: /\.(woff(2)?|eot|ttf|otf|)$/,
  type: 'asset/inline',
};

export const txtRule = {
  test: /\.(txt)$/,
  use: {
    loader: 'raw-loader',
  },
};

export const mp3Rule = {
  test: /\.(mp3)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[path][name].[ext]',
    },
  },
};

export const workerRule = (isProd) => {
  return {
    test: /\.worker\.js$/,
    use: {
      loader: 'workerize-loader',
      options: {
        name: isProd
          ? 'js/workers/[name].[id].[contenthash:8].js'
          : 'js/workers/[name].[id].js',
      },
    },
  };
};
