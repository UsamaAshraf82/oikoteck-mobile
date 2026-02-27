import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { AccessToken, AuthenticationToken, LoginManager, Profile } from 'react-native-fbsdk-next';
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
    try {
      if (Platform.OS === 'android') {
        startActivity();
        await GoogleSignin.hasPlayServices();
      }
      const response = await GoogleSignin.signIn();

      const data = response.data;

      if (data && data.idToken) {
        if (Platform.OS === 'ios') {
          startActivity();
        }
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
            Alert.alert('Play services not available');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            break;
          default:
            console.error('Google Sign-in error:', error);
            break;
        }
      } else {
        console.error('Google Sign-in error:', error);
      }
    }
    stopActivity();
  };

  const handleFacebookLogin = async () => {
    startActivity();
    try {
      if (Platform.OS === 'ios') {
        LoginManager.setLoginBehavior('native_with_fallback');
      }
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        stopActivity();
        return;
      }

      // Re-load profile to ensure we have the freshest data after login result
      await Profile.getCurrentProfile();

      let data: AccessToken | null = null;
      let authenticationToken: any = null;
      let profile: Profile | null = null;

      if (Platform.OS === 'ios') {
        data = await AccessToken.getCurrentAccessToken();
        authenticationToken = await AuthenticationToken.getAuthenticationTokenIOS();
        profile = await Profile.getCurrentProfile();
      } else {
        data = await AccessToken.getCurrentAccessToken();
        profile = await Profile.getCurrentProfile();
      }

      if (!data && !authenticationToken) {
        Alert.alert('Facebook Error', 'Something went wrong obtaining access token');
        stopActivity();
        return;
      }

      const authData: any = {
        id: data?.userID || profile?.userID,
      };

      if (data) {
        authData.access_token = data.accessToken.toString();
      }

      // Providing the id_token is necessary for Parse Server to validate Limited Logins on iOS
      if (Platform.OS === 'ios' && authenticationToken) {
        authData.id_token = authenticationToken.authenticationToken;
      }

      const user = await Parse.User.logInWith('facebook', {
        authData,
      });

      if (
        !user.id ||
        !user.get('first_name') ||
        !user.get('last_name') ||
        !user.get('email') ||
        !user.get('phone')
      ) {
        let email = '';
        let firstName = '';
        let lastName = '';

        if (data) {
          // Standard login: Fetch via Graph API
          try {
            const response = await fetch(
              `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${data.accessToken.toString()}`
            );
            const fb_user = await response.json();
            email = fb_user.email?.toLowerCase() || '';
            firstName = fb_user.first_name || '';
            lastName = fb_user.last_name || '';
          } catch (e) {
            console.error('Error fetching Graph API profile:', e);
          }
        }

        // Fallback or Limited Login: Use Profile object
        if (!email && profile) {
          email = profile.email?.toLowerCase() || '';
          firstName = firstName || profile.firstName || '';
          lastName = lastName || profile.lastName || '';
        }

        // Final Fallback: Parse User attributes (if server managed to fetch them)
        if (!email) {
          email = (user.get('email') as string)?.toLowerCase() || '';
          firstName = firstName || (user.get('first_name') as string) || '';
          lastName = lastName || (user.get('last_name') as string) || '';
        }

        router.push({
          pathname: '/signup2social',
          params: {
            email,
            firstName,
            lastName,
          },
        });
      } else {
        setUser(user as Parse.User<User_Type>);
      }
    } catch (error: any) {
      console.error('Facebook login error:', error);
      Alert.alert('Facebook Login Error', error.message || 'An unknown error occurred');
    }
    stopActivity();
  };

  const handleAppleLogin = async () => {
    startActivity();
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const user = await Parse.User.logInWith('apple', {
          authData: {
            id: credential.user,
            token: credential.identityToken,
          },
        });

        if (
          !user.id ||
          !user.get('first_name') ||
          !user.get('last_name') ||
          !user.get('email') ||
          !user.get('phone')
        ) {
          // Apple only provides email and name on the FIRST successful login for a given app.
          // We must fallback to Parse User attributes if they were synchronized.
          const email =
            credential.email?.toLowerCase() || (user.get('email') as string)?.toLowerCase() || '';
          const firstName =
            credential.fullName?.givenName || (user.get('first_name') as string) || '';
          const lastName =
            credential.fullName?.familyName || (user.get('last_name') as string) || '';

          router.push({
            pathname: '/signup2social',
            params: {
              email,
              firstName,
              lastName,
            },
          });
        } else {
          setUser(user as Parse.User<User_Type>);
        }
      }
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        // handle cancel
      } else {
        console.error('Apple Sign-in error:', e);
        Alert.alert('Apple Login Error', e.message || 'An unknown error occurred');
      }
    }
    stopActivity();
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
        <PressableView onPress={handleAppleLogin} style={styles.socialBtn}>
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
