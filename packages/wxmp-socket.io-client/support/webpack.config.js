var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConfig = require('./webpack.config.dev.js');

module.exports = merge(baseConfig, {
  output: {
    library: 'io',
    libraryTarget: 'umd',
    filename: 'socket.io.js'
  },
  optimization: {
    minimize: true
  }
});
