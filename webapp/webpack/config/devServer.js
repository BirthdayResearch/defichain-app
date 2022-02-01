export const defaultPort = 5001;

export const devServerConfig = {
  port: defaultPort,
  compress: true,
  hot: true,
  client: {
    overlay: false,
  },
  headers: { 'Access-Control-Allow-Origin': '*' },
  historyApiFallback: {
    disableDotRule: true,
  },
  open: false,
};
