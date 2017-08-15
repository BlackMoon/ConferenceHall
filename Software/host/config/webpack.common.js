var ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        extensions: ['.ts', '.js'] // Try .ts first, otherwise map will reference .js file.
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: 'awesome-typescript-loader!angular2-template-loader'
            },
            {
                test: /\.css$/,
                loaders: 'to-string-loader!style-loader!css-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(gif|ico|jp(e)?g|png)(\?.*)?$/,
                loader: "file-loader?name=assets/[name].[hash].[ext]"
            },
            {
                test: /\.(eot|svg|ttf)(\?.*)?$/,
                loader: "url-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader"
            }
        ]
    },

    plugins: [     

     new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./app')
        ),

      new CopyWebpackPlugin([
          { from: 'favicon.png' },
          { from: './images', to: './assets' }
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