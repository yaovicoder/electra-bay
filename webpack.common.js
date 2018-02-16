const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './src/index.ts',

  target: 'node',

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  externals: [nodeExternals()],

  module: {
    loaders: [
      { test: /.*\.ts$/, loader: 'awesome-typescript-loader' },
    ],
  },
}
