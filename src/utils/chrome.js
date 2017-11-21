const webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: './src/content_script.js',
    output: {
      path: path.resolve(__dirname, '../build/chrome'),
      publicPath: '/sys/jsoneditor/dist/img/',
      filename: 'content_script.js',
      library: 'starcounterDebugAid',
      libraryTarget: 'var'
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: 'icons', to: 'icons' },
        { from: 'popup', to: 'popup' },
        { from: 'manifest.json' }
      ])
    ],
    externals: {
      browser: 'chrome'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {}
            // other vue-loader options go here
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    }
  },
  {
    entry: './src/ui-popup.js',
    output: {
      path: path.resolve(__dirname, '../build/chrome/'),
      publicPath: '/sys/jsoneditor/dist/img/',
      filename: 'ui-popup-build.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {}
            // other vue-loader options go here
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      },
      extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    performance: {
      hints: false
    }
  },
  {
    entry: './src/utils/background-script.js',
    output: {
      path: path.resolve(__dirname, '../build/chrome/'),
      filename: 'bg_script.js'
    },
    externals: {
      browser: 'chrome'
    }
  }
];
