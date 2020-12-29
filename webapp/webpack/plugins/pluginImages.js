import ImageMin from 'image-minimizer-webpack-plugin';

export const imageMinPlugin = new ImageMin({
    minimizerOptions: {
        plugins: [
            ['gifsicle', { interlaced: true }],
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
