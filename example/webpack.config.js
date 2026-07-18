module.exports = {
  mode: 'development',
  entry: [
    './javascripts/index.jsx'
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                ['@babel/react', { runtime: 'classic' }],
                '@babel/preset-typescript'
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
