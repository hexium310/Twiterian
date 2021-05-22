const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TailwindCSS = require('tailwindcss');

const loaders = {
  css:{
    loader: 'css-loader',
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        plugins: [
          new TailwindCSS(),
        ],
      },
    },
  },
  style:{
    loader: 'style-loader',
  },
  typescript: {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  },
  html: {
    loader: 'html-loader',
    options: {
      sources: false,
    },
  },
};

module.exports = (_, argv) => {
  const isDevelopment = argv.mode === 'development';
  const outdir = isDevelopment ? 'dist' : 'releases/src';

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
          test: /\.css$/,
          use: [loaders.style, loaders.css, loaders.postcss],
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
      new ForkTsCheckerWebpackPlugin({
        async: isDevelopment,
        typescript: {
          configOverwrite: {
            compilerOptions: {
              noUnusedLocals: false,
              sourceMap: false,
            },
          },
        },
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
