import path from 'path';

export const devServerConfig = {
    publicPath: '/',
    compress: true,
    noInfo: false,
    stats: 'none',
    inline: true,
    lazy: false,
    hot: true,
    overlay: false,
    headers: {'Access-Control-Allow-Origin': '*'},
    contentBase: path.join(__dirname, 'build'),
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100,
    },
    historyApiFallback: {
        verbose: true,
        disableDotRule: false,
    },
};
