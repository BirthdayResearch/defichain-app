const copy = require('@neutrinojs/copy');
const web = require('@neutrinojs/web');
const jest = require('@neutrinojs/jest');
const airbnb = require('@neutrinojs/airbnb');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devServer = require('@neutrinojs/dev-server');
const { defaults } = require('jest-config');

const path = require('path');
module.exports = {
  use: [
    airbnb(),
    (neutrino) => {
      const isProduction = getIsProduction();
      const publicPath = process.env.WEBPACK_PUBLIC_PATH || '/';
      let outputPath = process.env.WEBPACK_OUTPUT_PATH;
      if (!outputPath) {
        outputPath = isProduction ? './build/release' : './build/debug';
      }
      if (outputPath.startsWith('./')) {
        outputPath = path.resolve(__dirname, outputPath);
      }
      let opts = neutrino.options;
      opts.root = __dirname;
      opts.output = outputPath;
      neutrino.use(
        devServer({
          open: true,
          publicPath,
        })
      );
      neutrino.use(
        web({
          clean: true,
          devtool: {
            production: 'nosources-source-map',
            development: 'inline-source-map',
          },
          env: {
            DEBUG: process.env.DEBUG || true,
          },
          publicPath,
          html: {
            template: './src/index.html',
          },
          image: {
            name: isProduction
              ? 'img/[name].[contenthash:8].[ext]'
              : 'img/[name].[ext]',
          },
          font: {
            name: isProduction
              ? 'fonts/[name].[contenthash:8].[ext]'
              : 'fonts/[name].[ext]',
          },
          babel: {
            presets: [],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
          style: {
            test: /\.(css|sass|scss)$/,
            modulesTest: /\.module\.(css|sass|scss)$/,
            loaders: [
              // Define loaders as objects. Note: loaders must be specified in reverse order.
              // ie: for the loaders below the actual execution order would be:
              // input file -> sass-loader -> postcss-loader -> css-loader -> style-loader/mini-css-extract-plugin
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [[require('autoprefixer')]],
                  },
                },
              },
              {
                loader: 'sass-loader',
                useId: 'sass',
              },

              // {
              //   loader: "css-loader",
              //   options: { sourceMap: true },
              // },
              // {
              //   loader: MiniCssExtractPlugin.loader,
              // },
            ],
            extract: {
              plugin: {
                filename: isProduction
                  ? 'css/[name].[contenthash:8].css'
                  : 'css/[name].css',
              },
            },
          },
          targets: {
            browsers: require('browserslist')(),
          },
        })
      );
      const config = neutrino.config;
      config.node.set('Buffer', true);
      config.output
        .sourceMapFilename('[file].map')
        .filename(
          isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js'
        )
        .chunkFilename(
          isProduction
            ? 'js/zchunk-[name].[contenthash:8].js'
            : 'js/zchunk-[name].js'
        )
        .webassemblyModuleFilename(
          isProduction ? 'wasm/[modulehash].wasm' : 'wasm/[modulehash].wasm'
        );
      config.module
        .rule('raw')
        .test(neutrino.regexFromExtensions(['txt']))
        .use('raw')
        .loader('raw-loader');
      config.module
        .rule('file')
        .test(neutrino.regexFromExtensions(['mp3']))
        .use('file')
        .loader('file-loader')
        .options({
          name: '[path][name].[ext]',
        });
      config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker')
        .loader('workerize-loader')
        .options({
          name: isProduction
            ? 'js/workers/[name].[id].[contenthash:8].js'
            : 'js/workers/[name].[id].js',
        });
      enableOptimizeCssAssets(config);
      if (process.env.WEBPACK_ANALYZE) {
        enableBundleAnalyzer(config);
      }
      config
        .plugin('image-min')
        .use(require('imagemin-webpack-plugin').default, [
          { test: /\.(jpe?g|png|gif|svg)$/i, disable: !isProduction },
        ]);
    },
    createTypeScriptPreset(),
    jest({
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      preset: 'ts-jest',
      setupFilesAfterEnv: [
        '<rootDir>/test/setupTests.ts',
        '<rootDir>/test/setupRpcInitialData.ts',
      ],
      setupFiles: ['<rootDir>/test/mockLocalStorage.js'],
      transform: {
        '^.+\\.[ts|tsx]?$': 'ts-jest',
      },
      testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
      testPathIgnorePatterns: ['<rootDir>/node_modules/'],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    }),
    copy({
      patterns: [{ from: 'favicon.ico', context: './src/assets/img', to: '.' }],
    }),
  ],
};
function enableOptimizeCssAssets(config) {
  config
    .plugin('optimize-css-assets')
    .use(require('optimize-css-assets-webpack-plugin'), [
      {
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true,
      },
    ]);
}
function enableBundleAnalyzer(config) {
  config
    .plugin('bundle-analyzer')
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
}
function createTypeScriptPreset(options = {}) {
  return ({ config }) => {
    if (options.fork !== false) {
      config
        .plugin('fork-ts-checker')
        .use(require('fork-ts-checker-webpack-plugin'), [
          {
            typescript: true,
            ...options.forkChecker,
          },
        ]);
    }
    let ext = config.resolve.extensions;
    ext.prepend('.ts');
    ext.prepend('.tsx');
    let babelOpts = config.module.rule('compile').use('babel').get('options');
    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .use('babel')
      .loader(require.resolve('babel-loader'))
      .options({ ...babelOpts, ...options.babel })
      .end()
      .use('tsc')
      .loader(require.resolve('ts-loader'))
      .options({ transpileOnly: options.fork !== false, ...options.ts })
      .end();
  };
}
function createWasmAsFilePreset(options = {}) {
  return (neutrino) => {
    const ruleId = options.ruleId || 'wasm';
    const useId = options.useId || 'file';
    neutrino.config.module
      .rule(ruleId)
      .test(options.test || neutrino.regexFromExtensions(['wasm']))
      .type('javascript/auto')
      .when(options.include, (rule) => rule.include.merge(options.include))
      .when(options.exclude, (rule) => rule.exclude.merge(options.exclude))
      .use(useId)
      .loader(require.resolve('file-loader'))
      .options({
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        name: getIsProduction()
          ? 'wasm/[name].[contenthash:8].wasm'
          : 'wasm/[name].wasm',
        ...options,
      });
  };
}

function getIsProduction() {
  return process.env.NODE_ENV === 'production';
}
