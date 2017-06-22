var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// ReSharper disable InconsistentNaming
var helpers = require('./helpers');
var webpack = require('webpack');

module.exports = {
    context: helpers.root('./app'),
    entry: {
        'app': './index.ts',
        'theme': 'primeng/resources/themes/bootstrap/theme.css',
        'polyfills': './polyfills.ts',
        'vendor': './vendor.ts'
    },

    resolve: {
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
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?.*)?$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                loader: 'to-string!style!css'
            }
        ]
    },

    plugins: [     

     new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./app')
        ),

      new CopyWebpackPlugin([
          { from: 'favicon.ico' },
          { from: './images', to: './assets', ignore: 'bg.jpg' }
        ]),

      new webpack.optimize.CommonsChunkPlugin({
          name: ['app', 'theme', 'vendor', 'polyfills']
      }),

      new HtmlWebpackPlugin({
          template: './index.html'
      }),

      new webpack.ProvidePlugin({
          $: 'jquery',
          jquery: 'jquery',
          jQuery: 'jquery'
      })
    ]
};