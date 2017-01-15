var path = require('path');

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
    test: './test'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css'],
  }
};
