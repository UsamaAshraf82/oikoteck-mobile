import Logo from '@/assets/svg/logo.svg';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { UserCircleIcon, UserIcon } from 'phosphor-react-native';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
import useUser from '~/store/useUser';

export const HomeTopBar = () => {
  const router = useRouter();
  const { user } = useUser();
  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} contentFit="contain" />
      {!user ? (
        <PressableView
          onPress={() => {
            router.push('/login');
          }}
          style={styles.loginButton}>
          <View style={styles.loginInner}>
            <UserCircleIcon
              size={25}
              color="#192234"
              weight="fill"
              style={{ marginHorizontal: 0, marginVertical: 0 }}
            />
            <AppText style={[styles.loginText, { width: 75 }]} numberOfLines={1}>
              Login Now
            </AppText>
          </View>
        </PressableView>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            router.push('/account');
          }}>
          <View style={styles.userSection}>
            <View>
              <AppText style={styles.welcomeText}>Welcome Back!</AppText>
              <AppText style={styles.userNameText}>
                {user ? `${user.attributes.first_name} ${user.attributes.last_name}` : ''}
              </AppText>
            </View>
            <View style={styles.userAvatar}>
              <UserIcon color="#7D7D7D" size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  logo: {
    minHeight: 36,
    minWidth: 122,
  },
  loginButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebeaec',
  },
  loginInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  loginText: {
    color: '#192234',
    fontFamily: 'LufgaMedium',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#8D95A5',
  },
  userNameText: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#192234',
  },
  userAvatar: {
    margin: 8,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(141, 149, 165, 0.25)',
  },
});
