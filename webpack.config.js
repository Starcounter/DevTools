var webpack = require('webpack');

const WebExtensionBuildConfig = require('./webpackConfig/webExtension');
const FirefoxExtensionBuildConfig = require('./webpackConfig/firefox');

module.exports = [
   ...WebExtensionBuildConfig,
   ...FirefoxExtensionBuildConfig
];