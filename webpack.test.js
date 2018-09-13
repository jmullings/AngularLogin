const commonConfig = require('./webpack.common.js');
const webpackMerge = require('webpack-merge');

const path = require('path');

module.exports = webpackMerge(commonConfig, {

  devtool: 'inline-source-map',
  mode: 'development',
  output: {},
  module: {
    rules: [
      {
        'test': /\.(eot|svg|cur)$/,
        'loader': 'file-loader',
        'options': {
          'name': '[hash].bundle.[ext]'
        }
      },
      {
        'test': /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        'loader': 'url-loader',
        'options': {
          'name': '[hash].id-bundle.[ext]',
          'limit': 10000
        }
      },
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?inlineSourceMap=true&sourceMap=false', 'angular2-template-loader'],
        exclude: [/\.(e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },
      {
        test: /\.ts$/,
        enforce: 'post',
        include: path.resolve('src'),
        use: 'istanbul-instrumenter-loader',
        exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
      },

      {test: /\.ts$/, enforce: 'pre', use: 'tslint-loader'}


    ]
  }

});

