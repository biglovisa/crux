var path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['babel-polyfill', './src/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/public/',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css']
  }
};
