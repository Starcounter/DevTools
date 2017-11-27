const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = function generateConfig(type) {
  const configurations =  [
    {
      entry: './src/content_script.js',
      output: {
        path: path.resolve(__dirname, `./build/${type}/`),
        publicPath: '/sys/jsoneditor/dist/img/',
        filename: 'content_script.js',
        library: 'starcounterDebugAid',
        libraryTarget: 'var'
      },
      plugins: [
        new CopyWebpackPlugin([
          { from: 'icons', to: 'icons' },
          { from: 'popup', to: 'popup' },
          {
            from:
              type === 'firefox' ? 'manifest.firefox.json' : 'manifest.json',
            to: 'manifest.json'
          }
        ])
      ],
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
        path: path.resolve(__dirname, `./build/${type}/`),
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
      entry: './src/background-script.js',
      output: {
        path: path.resolve(__dirname, `./build/${type}/`),
        filename: 'bg_script.js'
      }
    },
    {
      entry: './src/injected_script.js',
      output: {
        path: path.resolve(__dirname, `./build/${type}/`),
        filename: 'injected_script.js'
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
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      }
    }
  ];
  if (process.env.NODE_ENV === 'production') {
    configurations.forEach(config => {
      // http://vue-loader.vuejs.org/en/workflow/production.html
      config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new BabiliPlugin(),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        })
      ]);
    });
  }
  return configurations;
};
