import { WebView } from 'react-native-webview';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
const LiveChat = () => {
  return (
    <KeyboardAvoidingView >
      <WebView
        source={{
          uri: 'https://secure.livechatinc.com/customer/action/open_chat?license_id=18135348',
        }}
        cacheEnabled
        decelerationRate={0.998}
      />
    </KeyboardAvoidingView>
  );
};

export default LiveChat;
