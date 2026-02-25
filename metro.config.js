const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: path.resolve(__dirname, 'crypto-shim.js'),
};

module.exports = config;