module.exports = {
  mode: 'development',
  entry: [
    './javascripts/index.jsx'
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                '@babel/react'
              ]
            }
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: __dirname
    },
    port: 8080,
    open: false
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  }
};
