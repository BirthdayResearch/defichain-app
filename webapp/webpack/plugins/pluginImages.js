import ImageMin from 'image-minimizer-webpack-plugin';

export const imageMinPlugin = new ImageMin({
  minimizerOptions: {
    plugins: [
      ['jpegtran', { progressive: true }],
      ['optipng', { optimizationLevel: 5 }],
      [
        'svgo',
        {
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        },
      ],
    ],
  },
});
