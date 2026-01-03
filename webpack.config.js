const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    './index.js'
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: 'src/stylesheets/index.css',
            to: 'index.css'
          },
          {
            from: 'index.d.ts',
            to: 'index.d.ts'
          }
        ]
      },
    )
  ],
  output: {
    path: resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'react-splitter-layout',
    libraryTarget: 'umd'
  },
  externals: {
    react: 'react',
    'prop-types': 'prop-types'
  }
};
