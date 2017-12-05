const StringReplacePlugin = require('string-replace-webpack-plugin');
const BannerPlugin = require('webpack').BannerPlugin;
const path = require('path');
const uuid = require('uuid');

const BUILD_HASH = uuid(); // not really a hash but could be one day

module.exports = {
  plugins: [
    new StringReplacePlugin(),
    new BannerPlugin(`service worker version ${BUILD_HASH} not [hash]`),
  ],
  entry: {
    'root': ['./src/root.js'],
    'service-worker': ['./src/service-worker.js'],
    'sw-registration': ['./src/sw-registration.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    publicPath: '/',
  },

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /service-worker.js$/, loader: StringReplacePlugin.replace({
        replacements: [{
          pattern: 'BUILD_HASH',
          replacement: function() {
            // TODO: figure out how to use the webpack build hash instead of a random string
            return BUILD_HASH;
          },
        }],
      })},
    ],
  },
};
