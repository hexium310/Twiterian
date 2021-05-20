const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = {
  typescript: {
    loader: 'ts-loader',
  },
  html: {
    loader: 'html-loader',
    options: {
      sources: false,
    },
  },
};

module.exports = (env, argv) => {
  const outdir = {
    development: 'dist',
    production: 'releases/src',
  }[argv.mode] || 'dist';

  return {
    entry: {
      background: ['./src/background.ts'],
      'main/index': ['./src/main/index.tsx'],
      'options/index': ['./src/options/index.tsx'],
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.json'],
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
      },
      alias: {
        buffer: 'buffer',
        process: 'process/browser.js',
      },
    },
    output: {
      path: path.resolve(__dirname, outdir),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: loaders.typescript,
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: loaders.html,
        },
      ],
    },
    devtool: false,
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
        Buffer: ['buffer', 'Buffer'],
      }),
      new HtmlWebpackPlugin({
        inject: false,
        filename: 'options/index.html',
        template: 'src/options/index.html',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        filename: 'main/index.html',
        template: 'src/main/index.html',
      }),
    ],
  };
};
