var path = require('path');

module.exports = {
    entry: './calculaural.jsx',
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
                test: /\.js$|\.jsx$/,
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
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};