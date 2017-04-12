var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    context: helpers.root('./app'),
    entry: {
        'app': './index.ts',
        'polyfills': './polyfills.ts',
        'theme': 'igniteui/css/themes/infragistics2012/infragistics.theme.css',
        'vendor': './vendor.ts'
    },

    resolve: {
        alias: { 'jquery-ui': 'jquery-ui-bundle' },
        extensions: ['', '.ts', '.js'] // Try .ts first, otherwise map will reference .js file.
    },

    module: {
        loaders: [          
          {
              test: /\.ts$/,
              loaders: ['awesome-typescript-loader', 'angular2-template-loader']
          },
          {
              test: /\.html$/,
              loader: 'html'
          },
          {
              test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
              loader: 'file?name=assets/[name].[hash].[ext]'
          },          
          {
              test: /\.css$/,
              loader: 'to-string!style!css'
          }
        ]
    },

    plugins: [     

      new CopyWebpackPlugin([
            { from: 'favicon.ico' },
            { from: '**/routes.json', to: '[name].[ext]' }
        ]),

      new webpack.optimize.CommonsChunkPlugin({
          name: ['app', 'theme', 'vendor', 'polyfills']
      }),

      new HtmlWebpackPlugin({
          template: './index.html'
      }),

      new webpack.ProvidePlugin({
          jQuery: 'jquery',
          $: 'jquery',
          jquery: 'jquery'
      })
    ]
};