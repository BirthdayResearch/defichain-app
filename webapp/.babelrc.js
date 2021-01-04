module.exports = (api) => {
  const mode =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  // This caches the Babel config by environment.
  api.cache.using(() => mode);

  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/proposal-object-rest-spread',
      // Applies the react-refresh Babel plugin on non-production modes only
      mode !== 'production' && 'react-refresh/babel',
    ].filter(Boolean),
  };
};
