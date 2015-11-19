/**
 * React Static Boilerplate
 * https://github.com/koistya/react-static-boilerplate
 * Copyright (c) Konstantin Tarkus (@koistya) | MIT license
 */

import path from 'path';
import webpack from 'webpack';
import WebpackLoggerPlugin from 'webpack-logger-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { merge } from 'lodash';

const DEBUG = !process.argv.includes('release');
const VERBOSE = process.argv.includes('verbose');
const WATCH = global.watch;
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1'
];

const JS_LOADER = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel-loader'
};

const CSS_LOADER = {
  test: /\.scss$/,
  loaders: ['style-loader', 'css-loader', 'autoprefixer-loader?' + JSON.stringify({
    browsers: AUTOPREFIXER_BROWSERS
  }), 'sass-loader']
};

// Base configuration
const config = {
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    sourcePrefix: '  '
  },
  cache: false,
  debug: DEBUG,
  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
      '__DEV__': DEBUG
    }),
    new ExtractTextPlugin('[name].css'),
    new WebpackLoggerPlugin({append: false})
  ],
  module: {
    loaders: [
      {
        test: /[\\\/]app\.js$/,
        loader: path.join(__dirname, 'tools/lib/routes-loader.js')
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.txt$/,
        loader: 'raw-loader'
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }
    ]
  }
};

// Configuration for the client-side bundle
const appConfig = merge({}, config, {
  entry: {
    vendor: ['react', 'react-dom', 'babel-polyfill', 'history'],
    app: [
      ...(WATCH ? ['webpack-hot-middleware/client'] : []),
      './app.js'
    ]
  },
  output: {
    filename: 'app.js'
  },
  // http://webpack.github.io/docs/configuration.html#devtool
  devtool: DEBUG ? 'inline-source-map' : false,
  plugins: [
    ...config.plugins,
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : []),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    })
  ],
  module: {
    loaders: [
      JS_LOADER,
      ...config.module.loaders,
      WATCH ? CSS_LOADER : (() => {
        const [first, ...rest] = CSS_LOADER.loaders;
        return {
          test: CSS_LOADER.test,
          loader: ExtractTextPlugin.extract(first, rest.join('!'))
        }
      })()
    ]
  }
});

// Configuration for server-side pre-rendering bundle
const pagesConfig = merge({}, config, {
  entry: {
    app: './app.js'
  },
  output: {
    filename: 'app.node.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: /^[a-z][a-z\.\-\/0-9]*$/i,
  plugins: config.plugins.concat([
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})
  ]),
  module: {
    loaders: [
      JS_LOADER,
      ...config.module.loaders,
      Object.assign({}, CSS_LOADER, {
        loaders: CSS_LOADER.loaders.filter(n => n !== 'style-loader')
      })
    ]
  }
});

export default [appConfig, pagesConfig];
