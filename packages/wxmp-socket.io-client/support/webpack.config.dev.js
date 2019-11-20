let merge = require('webpack-merge');
let baseConfig = require('./webpack.config.base.js');
module.exports = merge(baseConfig, {
  output: {
    library: 'io',
    libraryTarget: 'umd',
    filename: 'socket.io.dev.js'
  },
  devtool: 'source-map'
});
