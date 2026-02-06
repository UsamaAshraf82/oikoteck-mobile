import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
import useActivityIndicator from '~/store/useActivityIndicator';
import useUser from '~/store/useUser';
import { User_Type } from '~/type/user';
const Image = ExpoImage as any;

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
          setUser(user as Parse.User<User_Type>);
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
            break;
        }
      }
    }
    stopActivity();
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        Alert.alert('Login cancelled');
        return;
      }

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

        router.push({
          pathname: '/signup2social',
          params: {
            email: fb_user.email?.toLowerCase() || '',
            firstName: fb_user.first_name || '',
            lastName: fb_user.last_name || '',
          },
        });
      } else {
        setUser(user as Parse.User<User_Type>);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PressableView onPress={startGoogleFlow} style={styles.socialBtn}>
        <View style={styles.btnContent}>
          <Image source={google} style={styles.icon} />
          <AppText style={styles.btnText}>Continue with Google</AppText>
        </View>
      </PressableView>

      <PressableView onPress={handleFacebookLogin} style={styles.socialBtn}>
        <View style={styles.btnContent}>
          <Image source={facebook} style={styles.icon} />
          <AppText style={styles.btnText}>Continue with Facebook</AppText>
        </View>
      </PressableView>

      {Platform.OS === 'ios' && (
        <PressableView onPress={() => {}} style={styles.socialBtn}>
          <View style={styles.btnContent}>
            <Image source={apple} style={styles.icon} />
            <AppText style={styles.btnText}>Continue with Apple</AppText>
          </View>
        </PressableView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  socialBtn: {
    marginTop: 16,
    height: 48,
    width: '100%',
    borderRadius: 999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9E9EC',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  icon: {
    width: 20,
    height: 20,
  },
  btnText: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
});

export default SocialSignin;
