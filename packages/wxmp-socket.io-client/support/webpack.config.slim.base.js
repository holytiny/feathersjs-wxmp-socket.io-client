
let webpack = require('webpack');

module.exports = {
  name: 'slim',
  entry: './lib/index.js',
  externals: {
    global: glob()
  },
  node: {
    Buffer: false
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/debug/, process.cwd() + '/support/noop.js')
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'strip-loader?strip[]=debug'
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
