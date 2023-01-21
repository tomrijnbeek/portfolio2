const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RobotstxtPlugin = require('robotstxt-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new RobotstxtPlugin({
      policy: [
        {
          userAgent: "*",
          allow: "/",
          crawlDelay: 2
        },
      ]
    })
  ]
});
