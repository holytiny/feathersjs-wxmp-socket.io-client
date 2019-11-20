var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConfig = require('./webpack.config.slim.base.js');

module.exports = merge(baseConfig, {
  output: {
    library: 'io',
    libraryTarget: 'umd',
    filename: 'socket.io.slim.js'
  },
  optimization: {
    minimize: true
  }
});
