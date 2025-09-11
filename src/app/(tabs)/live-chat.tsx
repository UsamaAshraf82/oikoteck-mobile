import React from 'react';
import { WebView } from 'react-native-webview';

const LiveChat = () => {
  return (
    <WebView
      source={{
        uri: 'https://secure.livechatinc.com/customer/action/open_chat?license_id=18135348',
      }}
    />
  );
};

export default LiveChat;
