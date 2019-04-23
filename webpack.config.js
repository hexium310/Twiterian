const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loaders = {
  typescript: {
    loader: 'ts-loader',
  },
  html: {
    loader: 'html-loader',
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
    plugins: [
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
    node: {
      fs: 'empty',
    },
  };
};
