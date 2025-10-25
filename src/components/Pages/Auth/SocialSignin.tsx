import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import ParseUser from 'parse/types/ParseUser';
import { Alert, Platform, View } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
import useActivityIndicator from '~/store/useActivityIndicator';
import useUser from '~/store/useUser';
import { User_Type } from '~/type/user';
const SocialSignin = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const { startActivity, stopActivity } = useActivityIndicator();
  const startGoogleFlow = async () => {
    startActivity();
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      const data = response.data;

      if (data) {
        const user = await Parse.User.logInWith('google', {
          authData: {
            id: data.user.id,
            id_token: data.idToken,
          },
        });

        if (
          !user.existed() ||
          !user.attributes.first_name ||
          !user.attributes.last_name ||
          !user.attributes.email ||
          !user.attributes.phone
        ) {
          router.push({
            pathname: '/signup2social',
            params: {
              email: data.user.email?.toLowerCase() || '',
              firstName: data.user.givenName || '',
              lastName: data.user.familyName || '',
            },
          });
        } else {
          setUser(user as ParseUser<User_Type>);
        }
      }
    } catch (error) {
      console.log('Google Signin Error', error);
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
    stopActivity();
  };

  const handleFacebookLogin = async () => {
    try {
      // Log in with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        Alert.alert('Login cancelled');
        return;
      }

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        Alert.alert('Something went wrong obtaining access token');
        return;
      }

      const user = await Parse.User.logInWith('facebook', {
        authData: {
          id: data.userID,
          access_token: data.accessToken.toString(),
        },
      });

      if (
        !user.existed() ||
        !user.attributes.first_name ||
        !user.attributes.last_name ||
        !user.attributes.email ||
        !user.attributes.phone
      ) {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${data.accessToken.toString()}`
        );
        const fb_user = await response.json();
        console.log('Facebook user data:', fb_user);

        router.push({
          pathname: '/signup2social',
          params: {
            email: fb_user.email?.toLowerCase() || '',
            firstName: fb_user.first_name || '',
            lastName: fb_user.last_name || '',
          },
        });

        // console.log('Facebook user data:', user);
      } else {
        setUser(user as ParseUser<User_Type>);
      }
    } catch (error) {
      // Fetch user profile from Graph API
      console.error('Facebook login error:', error);
    }
  };

  return (
    <View className="w-full">
      <PressableView
        onPress={() => {
          startGoogleFlow();
        }}
        className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={google} style={{ width: 20, height: 20 }} />
          <AppText className="font-medium text-sm text-primary">Continue with Google</AppText>
        </View>
      </PressableView>
      <PressableView
        onPress={() => {
          handleFacebookLogin();
          // startSignInFlow()
        }}
        className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={facebook} style={{ width: 20, height: 20 }} />
          <AppText className="font-medium text-sm text-primary">Continue with Facebook</AppText>
        </View>
      </PressableView>
      {Platform.OS === 'ios' && (
        <PressableView
          onPress={() => {
            // startSignInFlow()
          }}
          className="mt-4 h-12 w-full  rounded-full bg-white">
          <View className="flex-row items-center justify-center gap-3">
            <Image source={apple} style={{ width: 20, height: 20 }} />
            <AppText className="font-medium text-sm text-primary">Continue with Apple</AppText>
          </View>
        </PressableView>
      )}
    </View>
  );
};

export default SocialSignin;
