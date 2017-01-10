var webpack = require('webpack');
var path = require('path');
var argv = require('yargs')
    .boolean('bundled')
    .argv;

const {
    main,
    dependencies,
    bundleDependencies,
} = require('./package.json');

const {
    env,
    bundled
} = argv;

const sassConfig = require('./sass.conf.js');

const ext = '.js';
const srcDir = 'src';
const destDir = path.dirname(main);
const baseName = path.basename(main, ext);
const suffix = bundled ?
    '-bundled' :
    '';

const babelPresets = [];
const plugins = [];
let outputFile;

if (env === 'min') {
    babelPresets.push('babili');
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
    outputFile = `${ baseName }${ suffix }.min${ ext }`;
} else {
    outputFile = `${ baseName }${ suffix }${ ext }`;
}

const externals = Object
    .keys(dependencies)
    .filter(bundled ?
        () => false :
        dependencyName => !(bundleDependencies || []).includes(dependencyName)
    );

var config = {
    entry: path.join(__dirname, `${ srcDir }/index${ ext }`),
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, destDir),
        filename: outputFile,
        library: baseName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.js)$/,
                loader: 'babel',
                query: {
                  presets: babelPresets,
                },
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            },
            { test: /\.(scss|sass)$/, loader: 'style!css?importLoaders=1&camelCase&modules!postcss!sass' },
            { test: /\.css$/, loader: 'style!css?importLoaders=1&camelCase&modules!postcss' }
        ]
    },
    sassLoader: sassConfig,
    resolve: {
        root: path.resolve(`./${ srcDir }`),
        extensions: ['', ext]
    },
    plugins,
    externals: externals.reduce((externals, dependencyName) => Object.assign(externals, {
        [dependencyName]: dependencyName,
    }), {}),
};

module.exports = config;
