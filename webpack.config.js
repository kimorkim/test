var path = require('path');
var webpack = require('webpack');
// var CommonsChunkPlugin = require("./node_modules/webpack/lib/optimize/CommonsChunkPlugin");
var commonsPlugin =  new webpack.optimize.CommonsChunkPlugin('commons.js');


module.exports = {
  context: __dirname + "/static/js",
  entry: {
    test1: "./test1",
    test2: "./test2"
  },
  resolve: {
   extensions: ['', '.js', '.jsx']
 },
  output: {
    publicPath: "./build_js/",
    path: path.join(__dirname, "/static/build_js"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].chunk.js"
  },
  plugins: [
    commonsPlugin,
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
    ],
  },
}
