module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-transform-class-static-block',
      // '@sentry/react-native/babel',
      'react-native-worklets/plugin',
    ],
  };
};
