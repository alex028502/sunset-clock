const path = require('path');

module.exports = {
  entry: {
    'root': ['./src/root.js'],
    'sw-registration': ['./src/sw-registration.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
};
