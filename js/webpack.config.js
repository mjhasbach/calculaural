module.exports = {
    entry: './calculaural.jsx',
    output: {
        path: '../build/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$|\.jsx$/,
                loaders: ['babel?optional[]=runtime'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};