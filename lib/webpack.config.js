var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './calculaural.js',
    output: {
        path: '../build/',
        filename: 'bundle.js'
    },
    node: {
        fs: 'empty'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel?optional[]=runtime'],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                include: path.join(__dirname, '../', 'node_modules', 'pixi-piano-roll', 'node_modules', 'pixi.js'),
                loader: 'json'
            }
        ]
    },
    // todo remove when this issue is resolved: https://github.com/angular/material/issues/4225
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        })
    ],
    resolve: {
        extensions: ['', '.js']
    }
};