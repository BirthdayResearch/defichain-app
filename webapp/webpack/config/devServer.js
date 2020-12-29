export const defaultPort = 5000;

export const devServerConfig = {
    publicPath: '/',
    port: defaultPort,
    compress: true,
    noInfo: false,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    overlay: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 100,
    },
    historyApiFallback: {
        verbose: true,
        disableDotRule: true,
    },
};
