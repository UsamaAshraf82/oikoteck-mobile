import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
import { parseLog } from '~/utils/parseLog';
const Image = ExpoImage as any;

const SocialSignin = () => {
  const { setUser } = useUser();
  const router = useRouter();
  const { startActivity, stopActivity } = useActivityIndicator();
  const isSigningInRef = useRef(false);

  const startGoogleFlow = async () => {
    if (isSigningInRef.current) return;
    isSigningInRef.current = true;
    startActivity();

    try {
      await parseLog('google_login:start', { platform: Platform.OS });

      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices();
      }

      const response = await GoogleSignin.signIn();

      await parseLog('google_login:response', {
        hasData: !!response.data,
        hasIdToken: !!response.data?.idToken,
        userId: response.data?.user?.id ?? null,
        userEmail: response.data?.user?.email ?? null,
      });

      if (!response.data || !response.data.idToken) {
        throw new Error('Missing Google idToken');
      }

      const { user, idToken } = response.data;

      const parseUser = await Parse.User.logInWith('google', {
        authData: {
          id: user.id,
          id_token: idToken,
        },
      });

      await parseLog('google_login:parse_success', {
        parseUserId: parseUser.id,
        existed: parseUser.existed(),
        hasFirstName: !!parseUser.get('first_name'),
        hasLastName: !!parseUser.get('last_name'),
        hasEmail: !!parseUser.get('email'),
        hasPhone: !!parseUser.get('phone'),
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
      await parseLog('google_login:error', {
        message: error?.message ?? String(error),
        code: error?.code ?? null,
        stack: error?.stack?.slice(0, 500) ?? null,
      });
      console.error('Google auth failed:', error);
      Sentry.captureException(error);
    } finally {
      stopActivity();
      isSigningInRef.current = false;
    }
  };

  const handleFacebookLogin = async () => {
    if (isSigningInRef.current) return;
    isSigningInRef.current = true;
    startActivity();

    try {
      // Use 'browser' on iOS to force the standard OAuth flow and avoid
      // Facebook Limited Login (which does not provide an AccessToken and
      // is incompatible with the standard Parse Facebook auth adapter).
      if (Platform.OS === 'ios') {
        LoginManager.setLoginBehavior('browser');
      }

      await parseLog('fb_login:start', {
        loginBehavior: Platform.OS === 'ios' ? 'browser' : 'default',
      });

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      await parseLog('fb_login:result', {
        isCancelled: result.isCancelled,
        grantedPermissions: result.grantedPermissions,
        declinedPermissions: result.declinedPermissions,
      });

      if (result.isCancelled) {
        return;
      }

      const accessToken = await AccessToken.getCurrentAccessToken();
      const profile = await Profile.getCurrentProfile();

      // On iOS with standard OAuth, AuthenticationToken (Limited Login OIDC
      // token) will be null — that is expected and fine.
      let authenticationToken: AuthenticationToken | null = null;
      if (Platform.OS === 'ios') {
        authenticationToken =
          await AuthenticationToken.getAuthenticationTokenIOS();
      }

      await parseLog('fb_login:tokens', {
        hasAccessToken: !!accessToken,
        accessTokenUserID: accessToken?.userID ?? null,
        accessTokenExpires: accessToken?.expirationTime ?? null,
        hasProfile: !!profile,
        profileUserID: profile?.userID ?? null,
        hasAuthenticationToken: !!authenticationToken,
        authenticationTokenNonce: authenticationToken?.nonce ?? null,
      });

      if (!accessToken && !authenticationToken) {
        throw new Error('Facebook token missing');
      }

      const userId = accessToken?.userID;

      if (!userId) {
        throw new Error('Facebook user ID could not be determined');
      }

      const authData: any = { id: userId };

      if (accessToken) {
        authData.access_token = accessToken.accessToken.toString();
      }

      // if (authenticationToken) {
      //   authData.id_token = authenticationToken.authenticationToken;
      //   authData.nonce = authenticationToken.nonce;
      // }

      await parseLog('fb_login:authData', {
        id: authData.id,
        hasAccessToken: !!authData.access_token,
        // hasIdToken: !!authData.id_token,
        // hasNonce: !!authData.nonce,
      });

      const user = await Parse.User.logInWith('facebook', { authData });

      await parseLog('fb_login:parse_success', {
        parseUserId: user.id,
        existed: user.existed(),
        hasFirstName: !!user.get('first_name'),
        hasLastName: !!user.get('last_name'),
        hasEmail: !!user.get('email'),
        hasPhone: !!user.get('phone'),
      });

      await handleProfileCompletion(user, accessToken, profile);
    } catch (error: any) {
      await parseLog('fb_login:error', {
        message: error?.message ?? String(error),
        code: error?.code ?? null,
        stack: error?.stack?.slice(0, 500) ?? null,
      });
      console.error('Facebook login error:', error);
      Sentry.captureException(error);
    } finally {
      stopActivity();
      isSigningInRef.current = false;
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
    if (isSigningInRef.current) return;
    isSigningInRef.current = true;
    startActivity();

    try {
      await parseLog('apple_login:start', { platform: Platform.OS });

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      await parseLog('apple_login:credential', {
        hasIdentityToken: !!credential.identityToken,
        hasEmail: !!credential.email,
        hasGivenName: !!credential.fullName?.givenName,
        hasFamilyName: !!credential.fullName?.familyName,
        userId: credential.user ?? null,
        // authorizationCode is short-lived, just log presence
        hasAuthCode: !!credential.authorizationCode,
      });

      if (!credential.identityToken) {
        throw new Error('Missing Apple identity token');
      }

      const user = await Parse.User.logInWith('apple', {
        authData: {
          id: credential.user,
          id_token: credential.identityToken,
        },
      });

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

      await parseLog('apple_login:parse_success', {
        parseUserId: user.id,
        existed: user.existed(),
        resolvedEmail: email,
        resolvedFirstName: firstName,
        resolvedLastName: lastName,
        hasPhone: !!user.get('phone'),
      });

      // Stop the activity indicator BEFORE navigating to avoid
      // iOS crash from modal + navigation transition conflict
      stopActivity();
      isSigningInRef.current = false;

      if (!user.get('phone') || !email || !firstName || !lastName) {
        router.push({
          pathname: '/signup2social',
          params: { email, firstName, lastName },
        });
      } else {
        setUser(user as Parse.User<User_Type>);
      }
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        await parseLog('apple_login:cancelled', {});
        // User cancelled — silent, no Sentry
      } else {
        await parseLog('apple_login:error', {
          message: e?.message ?? String(e),
          code: e?.code ?? null,
          stack: e?.stack?.slice(0, 500) ?? null,
        });
        console.error('Apple login error:', e);
        Sentry.captureException(e);
      }
      stopActivity();
      isSigningInRef.current = false;
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
