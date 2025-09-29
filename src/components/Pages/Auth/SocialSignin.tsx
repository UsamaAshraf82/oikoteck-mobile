import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { Platform, Text, View } from 'react-native';
import PressableView from '~/components/HOC/PressableView';
const SocialSignin = () => {
  const startSignInFlow = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      // console.log('response', response);
      if (isSuccessResponse(response)) {
        // console.log('response', response);
        // setState({ userInfo: response.data });
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      // console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  return (
    <View className="w-full">
      <PressableView
        onPress={() => {
          console.log('google');
          // startSignInFlow()
        }}
        className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={google} style={{ width: 20, height: 20 }} />
          <Text className="text-sm font-medium text-primary">Continue with Google</Text>
        </View>
      </PressableView>
      <PressableView
        onPress={() => {
          console.log('facebook');
          // startSignInFlow()
        }}
        className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={facebook} style={{ width: 20, height: 20 }} />
          <Text className="text-sm font-medium text-primary">Continue with Facebook</Text>
        </View>
      </PressableView>
      {Platform.OS === 'ios' && (
        <PressableView
          onPress={() => {
            console.log('apple');
            // startSignInFlow()
          }}
          className="mt-4 h-12 w-full  rounded-full bg-white">
          <View className="flex-row items-center justify-center gap-3">
            <Image source={apple} style={{ width: 20, height: 20 }} />
            <Text className="text-sm font-medium text-primary">Continue with Apple</Text>
          </View>
        </PressableView>
      )}
    </View>
  );
};

export default SocialSignin;
