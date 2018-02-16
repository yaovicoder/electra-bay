const path = require('path')

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

  module: {
    loaders: [
      { test: /.*\.ts$/, loader: 'awesome-typescript-loader' },
    ],
  },
}
