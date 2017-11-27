const StringReplacePlugin = require("string-replace-webpack-plugin");
const path = require('path');
const uuid = require('uuid');

module.exports = {
  plugins: [
    new StringReplacePlugin(),
  ],
  entry: {
    'app': ['./src/app.js'],
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
            return uuid();
          },
        }],
      })},
    ],
  },
};
