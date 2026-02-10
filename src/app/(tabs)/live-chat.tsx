import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { WebView } from 'react-native-webview';
const LiveChat = () => {
  return (
    <KeyboardAvoidingView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
