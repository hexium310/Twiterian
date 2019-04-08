import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const loaders = {
  babel: {
    loader: 'babel-loader',
  },
  svelte: {
    loader: 'svelte-loader',
    options: {
      emitCss: true,
      hotReload: true,
      onwarn: warning => {
        if (warning.code === 'A11Y_autofocus') {
          return
        }

        return warning
      }
    },
  },
  typescript: {
    loader: 'ts-loader',
  },
  style: {
    loader: 'style-loader',
  },
  css: {
    loader: 'css-loader',
  },
  html: {
    loader: 'html-loader',
  },
  tslint: {
    loader: 'tslint-loader',
    options: {
      typeCheck: true,
    }
  }
}

export default (env, argv) => {
  const outdir = {
    development: 'dist',
    production: 'releases/src',
  }[argv.mode] || 'dist'

  return {
    entry: {
      background: ['./src/background.ts'],
      'main/index': ['./src/main/index.ts'],
      'options/index': ['./src/options/index.ts'],
    },
    resolve: {
      extensions: ['.js', '.ts', '.svelte', '.json'],
    },
    output: {
      path: path.resolve(__dirname, outdir),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          exclude: /node_modules/,
          use: loaders.babel,
        },
        {
          test: /\.ts$/,
          enforce: 'pre',
          exclude: /node_modules/,
          use: [loaders.typescript, loaders.tslint],
        },
        {
          test: /\.svelte$/,
          exclude: /node_modules/,
          use: [loaders.babel, loaders.svelte],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [loaders.style, loaders.css],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: loaders.html,
        },
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          tslint: {
            formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
            formatter: 'grouped'
          },
        }
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
    node: {
      fs: 'empty',
    },
  }
}