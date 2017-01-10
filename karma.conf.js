const {module: {loaders}} = require('./webpack.config');

module.exports = function (config) {
  config.set({
    // base path used to resolve all patterns
    basePath: 'test/',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files/patterns to load in the browser
    files: [
      '../node_modules/angular/angular.js',
      '../node_modules/angular-mocks/angular-mocks.js',
      { pattern: './spec/**/*.js', watched: true }
    ],

    // files to exclude
    exclude: [],

    plugins: [
      require("karma-chai"),
      require("karma-longest-reporter"),
      require("karma-chrome-launcher"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-sourcemap-loader"),
      require("karma-webpack")
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { './spec/**/*.js': ['webpack', 'sourcemap'] },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders,
        noParse: [
          // See: https://github.com/airbnb/enzyme/issues/47#issuecomment-162529926
          /node_modules\/sinon\//,
        ]
      },
      resolve: {
        alias: {
          // See: https://github.com/airbnb/enzyme/issues/47#issuecomment-162529926
          sinon: 'sinon/pkg/sinon'
        }
      },
    },

    webpackServer: {
      // @see https://webpack.js.org/configuration/watch/#watchoptions
      watchOptions: {
        aggregateTimeout: 500,
      },
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'mocha',
      'longest',
    ],

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // if true, Karma runs tests once and exits
    singleRun: false
  });
};
