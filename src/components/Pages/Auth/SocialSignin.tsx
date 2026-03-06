import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import {
  AccessToken,
  AuthenticationToken,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';

import * as Sentry from '@sentry/react-native';
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
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }
      const response = await GoogleSignin.signIn();

      if (!response.data?.idToken) {
        throw new Error('Missing Google idToken');
      }

      const { user, idToken } = response.data;

      const parseUser = await Parse.User.logInWith('google', {
        authData: {
          id: user.id,
          id_token: idToken,
        },
      });

      if (
        !parseUser.existed() ||
        !parseUser.get('first_name') ||
        !parseUser.get('last_name') ||
        !parseUser.get('email') ||
        !parseUser.get('phone')
      ) {
        router.push({
          pathname: '/signup2social',
          params: {
            email: user.email?.toLowerCase() || '',
            firstName: user.givenName || '',
            lastName: user.familyName || '',
          },
        });

        return;
      }

      setUser(parseUser as Parse.User<User_Type>);
    } catch (error: any) {
      console.error('Google auth failed:', error);
      Sentry.captureException(error);
    } finally {
      stopActivity();
    }
  };

  const handleFacebookLogin = async () => {
    startActivity();

    try {
      if (Platform.OS === 'ios') {
        LoginManager.setLoginBehavior('native_with_fallback');
      }

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) return;

      const accessToken = await AccessToken.getCurrentAccessToken();
      const profile = await Profile.getCurrentProfile();

      let authenticationToken: AuthenticationToken | null = null;

      if (Platform.OS === 'ios') {
        authenticationToken =
          await AuthenticationToken.getAuthenticationTokenIOS();
      }

      if (!accessToken && !authenticationToken) {
        throw new Error('Facebook token missing');
      }

      const authData: any = {
        id: accessToken?.userID || profile?.userID,
      };

      if (accessToken) {
        authData.access_token = accessToken.accessToken.toString();
      }

      if (authenticationToken) {
        authData.id_token = authenticationToken.authenticationToken;
      }

      const user = await Parse.User.logInWith('facebook', { authData });

      await handleProfileCompletion(user, accessToken, profile);
    } catch (error) {
      console.error('Facebook login error:', error);
      Sentry.captureException(error);
    } finally {
      stopActivity();
    }
  };

  const handleProfileCompletion = async (
    user: Parse.User,
    accessToken: AccessToken | null,
    profile: Profile | null
  ) => {
    if (
      user.get('first_name') &&
      user.get('last_name') &&
      user.get('email') &&
      user.get('phone')
    ) {
      setUser(user as Parse.User<User_Type>);
      return;
    }

    let email = '';
    let firstName = '';
    let lastName = '';

    if (accessToken) {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${accessToken.accessToken}`
      );

      const fb = await res.json();

      email = fb.email?.toLowerCase() || '';
      firstName = fb.first_name || '';
      lastName = fb.last_name || '';
    }

    if (!email && profile) {
      email = profile.email?.toLowerCase() || '';
      firstName = firstName || profile.firstName || '';
      lastName = lastName || profile.lastName || '';
    }

    router.push({
      pathname: '/signup2social',
      params: { email, firstName, lastName },
    });
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
            credential.email?.toLowerCase() ||
            (user.get('email') as string)?.toLowerCase() ||
            '';
          const firstName =
            credential.fullName?.givenName ||
            (user.get('first_name') as string) ||
            '';
          const lastName =
            credential.fullName?.familyName ||
            (user.get('last_name') as string) ||
            '';

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
        Alert.alert(
          'Apple Login Error',
          e.message || 'An unknown error occurred'
        );
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
