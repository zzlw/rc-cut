var webpack = require('webpack');
var config = require('./base');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * ouput config
 * @type {String}
 */
config.output.filename = '[name].js';

/**
 * loaders config
 * @type {RegExp}
 */
 config.module.loaders.push({
   test: /\.css$/,
   loader: 'style!css'
 }, {
   test: /\.scss$/,
   loader: 'style!css!sass'
 });

/**
 * plugins config
 * @type {[type]}
 */
config.plugins.push(
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
);



module.exports = config;
