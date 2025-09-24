import React from 'react';
import { WebView } from 'react-native-webview';

const PrivacyPolicy = () => {
  return (
    <WebView
      source={{
        uri: 'https://www.oikoteck.com/mobile/terms-conditions',
      }}
    />
  );
};

export default PrivacyPolicy;
