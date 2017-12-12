'use strict';

/* eslint no-console: 0 */

const gulp = require('gulp');
const webpack = require('webpack-stream');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const BannerPlugin = require('webpack').BannerPlugin;
const StringReplacePlugin = require('string-replace-webpack-plugin');

function config(outputFilename) {
  return {
    devtool: 'source-map',
    module: {
      rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      ],
    },
    output: {
      filename: outputFilename,
    },
  };
}

gulp.task('build', ['build-root', 'build-images', 'build-swreg', 'build-sw']);

gulp.task('build-root', function(done) {
  gulp.src(['src/root.js']).pipe(webpack(config('root.js'))).pipe(gulp.dest('public')).on('end', done);
});

gulp.task('build-swreg', function(done) {
  gulp.src(['src/sw-registration.js'])
    .pipe(webpack(config('sw-registration.js'))).pipe(gulp.dest('public')).on('end', done);
});

gulp.task('build-images', function(done) {
  const proc = spawn('make', ['icons']);
  proc.stdout.pipe(process.stdout);
  proc.on('close', done);
});

gulp.task('build-sw', ['build-images', 'build-swreg', 'build-root'], function(done) {
  exec('./scripts/hash.sh', function(err, BUILD_HASH) {
    if (err) {
      throw err;
    }
    gulp.src(['src/service-worker.js']).pipe(webpack({
      devtool: 'source-map',
      plugins: [
        new StringReplacePlugin(),
        new BannerPlugin(`service worker version ${BUILD_HASH} not [hash]`),
      ],
      module: {
        rules: [
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
        ],
      },
      output: {
        filename: 'service-worker.js',
      },
    })).pipe(gulp.dest('public')).on('end', done);
  });
});

gulp.task('default', ['build'], function() {
  gulp.watch(['src/**/*', 'src/*', 'public/face.svg'], ['build']);
  const PORT = 8080;
  return require('./demo/')('./public', PORT).then(function() {
    // this could be adjusted to allow you to start /demo with
    // a replacement sw hash - but for now if you want to test the service
    // worker manually, just change one of the files
    console.log(`serving demo on port ${PORT}`);
  });
});
