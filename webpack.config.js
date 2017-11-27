var webpack = require('webpack');

const webpackConfigGenerator = require('./webpackConfigGenerator');

module.exports = [
   ...webpackConfigGenerator('webextension'),
   ...webpackConfigGenerator('firefox')
];