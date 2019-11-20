let merge = require('webpack-merge');
let baseConfig = require('./webpack.config.slim.base.js');

module.exports = merge(baseConfig, {
  output: {
    library: 'io',
    libraryTarget: 'umd',
    filename: 'socket.io.slim.dev.js'
  },
  devtool: 'source-map'
});

/**
 * Populates `global`.
 *
 * @api private
 */

function glob () {
  return 'typeof self !== "undefined" ? self : ' +
    'typeof window !== "undefined" ? window : ' +
    'typeof global !== "undefined" ? global : {}';
}
