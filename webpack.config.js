const { resolve } = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    './index.ts'
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
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
    react: 'react'
  }
};
