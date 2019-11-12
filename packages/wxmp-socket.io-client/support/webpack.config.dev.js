
module.exports = {
  name: 'default',
  entry: './lib/index.js',
  output: {
    library: 'io',
    libraryTarget: 'umd',
    filename: 'socket.io.dev.js'
  },
  externals: {
    global: glob()
  },
  node: {
    Buffer: false
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};

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
