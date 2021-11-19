const path = require('path');

const serverConfig = {
  entry: path.resolve(__dirname, 'src/server/server-main.ts'),
  target: 'node',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server-bundle.js',
  }
};

const clientConfig = {
  entry: path.resolve(__dirname, 'src/client/tsc/client-main.ts'),
  target: 'web',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'client-bundle.js',
  }
};

module.exports = [serverConfig, clientConfig];