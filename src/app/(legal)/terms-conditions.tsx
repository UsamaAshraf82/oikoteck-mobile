import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import TopHeader from '~/components/Elements/TopHeader';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={''}
      />
      <WebView
        source={{
          uri: 'https://www.oikoteck.com/mobile/terms-conditions',
        }}
        cacheEnabled
        decelerationRate={0.998}
      />
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
