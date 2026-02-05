import house from '@/assets/svg/house.svg';
import { useQuery } from '@tanstack/react-query';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Parse from 'parse/react-native';
import {
  BriefcaseIcon,
  CaretRightIcon,
  HandCoinsIcon,
  HandshakeIcon,
  HeartIcon,
  HouseLineIcon,
  KeyIcon,
  PasswordIcon,
  QuestionIcon,
  ShieldWarningIcon,
  SignOutIcon,
  UserCircleIcon,
  UserIcon,
  WarehouseIcon,
} from 'phosphor-react-native';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import Grid from '~/components/HOC/Grid';
import useUser from '~/store/useUser';
const Image = ExpoImage as any;

const PropertyQuery = (listing_for: 'Sale' | 'Rental', user: Parse.User) => {
  const query = new Parse.Query('Property');
  query.equalTo('owner', user);
  query.equalTo('listing_for', listing_for);
  return query;
};

const Account = () => {
  const { user, logout } = useUser();

  const { data } = useQuery({
    enabled: !!user?.id,
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id || !user) return null;
      const result = await Promise.all([
        PropertyQuery('Rental', user).count(),
        PropertyQuery('Sale', user).count(),
      ]);
      return { rental: result[0], sale: result[1] };
    },
    initialData: { rental: 0, sale: 0 },
  });

  const userType = user?.attributes.user_type;
  const isAgent = userType === 'agent';
  const typeColor = isAgent ? '#007074' : '#82065e';

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>My Account</AppText>
          <Link href="/edit-profile" style={styles.editProfileBtn}>
            <AppText style={styles.editProfileBtnText}>Edit Profile</AppText>
          </Link>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {user ? (
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={[typeColor, '#fff']}
                locations={[0.3, 0.9]}
                style={styles.avatarGradient}>
                <View style={styles.avatarInner}>
                  <Image source={house} contentFit="fill" style={styles.avatarImage} />
                </View>
              </LinearGradient>
            </View>
            <View style={[styles.typeBadge, { borderColor: typeColor }]}>
              <UserIcon size={17} weight="bold" color={typeColor} />
              <AppText style={[styles.typeBadgeText, { color: typeColor }]}>
                {isAgent ? 'Agent' : 'Individual'}
              </AppText>
            </View>
            <AppText style={styles.userName}>
              {user.attributes.first_name} {user.attributes.last_name}
            </AppText>
            <AppText style={styles.userEmail}>{user.attributes.username}</AppText>
            <Grid cols={2} gap={8}>
              <View style={styles.statsCard}>
                <View style={styles.statsIconWrapper}>
                  <LinearGradient
                    colors={['#82065e', '#192234']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.statsIconGradient}>
                    <HouseLineIcon color="#fff" weight="fill" size={18} />
                  </LinearGradient>
                </View>
                <View style={styles.statsSpacer} />
                <AppText style={styles.statsValue}>{data?.rental}</AppText>
                <AppText style={styles.statsLabel}>Properties for rent</AppText>
              </View>
              <View style={styles.statsCard}>
                <View style={styles.statsIconWrapper}>
                  <LinearGradient
                    colors={['#82065e', '#192234']}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.statsIconGradient}>
                    <KeyIcon color="#fff" weight="fill" size={18} />
                  </LinearGradient>
                </View>
                <View style={styles.statsSpacer} />
                <AppText style={styles.statsValue}>{data?.sale}</AppText>
                <AppText style={styles.statsLabel}>Properties for sale</AppText>
              </View>
            </Grid>
          </View>
        ) : (
          <View style={styles.loginCardWrapper}>
            <LinearGradient
              colors={['#82065e', '#192234']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.loginCard}>
              <View style={styles.loginIconWrapper}>
                <UserCircleIcon color="#fff" size={32} />
              </View>
              <AppText style={styles.loginTitle}>Log In to your account</AppText>
              <AppText style={styles.loginSubtitle}>
                Login or Signup to access all the features
              </AppText>
              <Link href="/login" style={styles.loginBtn}>
                <AppText style={styles.loginBtnText}>Log In to my account</AppText>
              </Link>
            </LinearGradient>
          </View>
        )}

        <View style={styles.menuGroups}>
          <View>
            {(user
              ? [
                  { icon: <WarehouseIcon />, label: 'My Properties', path: '/properties' },
                  { icon: <HandCoinsIcon />, label: 'Services', path: '/services' },
                  { icon: <HeartIcon />, label: 'My Favorites', path: '/favorities' },
                  { icon: <PasswordIcon />, label: 'Change Password', path: '/change-password' },
                  { icon: <QuestionIcon />, label: 'Frequently asked Questions', path: '/faqs' },
                ]
              : [
                  { icon: <HandCoinsIcon />, label: 'Services', path: '/services' },
                  { icon: <QuestionIcon />, label: 'Frequently asked Questions', path: '/faqs' },
                ]
            ).map((item, index, arr) => (
              <Link href={item.path as any} key={item.label}>
                <View
                  style={[
                    styles.menuItem,
                    index === 0 && styles.menuItemFirst,
                    index === arr.length - 1 && styles.menuItemLast,
                  ]}>
                  {item.icon}
                  <AppText style={styles.menuItemLabel}>{item.label}</AppText>
                  <CaretRightIcon color="#75758A" size={20} />
                </View>
              </Link>
            ))}
          </View>
          <View>
            {[
              { icon: <BriefcaseIcon />, label: 'Terms and Conditions', path: '/terms-conditions' },
              { icon: <ShieldWarningIcon />, label: 'Privacy Policy', path: '/privacy-policy' },
              { icon: <HandshakeIcon />, label: 'Service Plan Terms', path: '/service-plan-terms' },
            ].map((item, index, arr) => (
              <Link href={item.path as any} key={item.label}>
                <View
                  style={[
                    styles.menuItem,
                    index === 0 && styles.menuItemFirst,
                    index === arr.length - 1 && styles.menuItemLast,
                  ]}>
                  {item.icon}
                  <AppText style={styles.menuItemLabel}>{item.label}</AppText>
                  <CaretRightIcon color="#75758A" size={20} />
                </View>
              </Link>
            ))}
          </View>
          {user && (
            <View>
              <TouchableWithoutFeedback onPress={() => logout()}>
                <View style={styles.logoutBtn}>
                  <SignOutIcon color="#DC2626" />
                  <AppText style={styles.logoutBtnText}>Logout</AppText>
                  <CaretRightIcon color="#DC2626" size={20} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  editProfileBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#82065e',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editProfileBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 12,
    color: '#82065e',
  },
  scrollView: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    marginBottom: 24,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'white',
  },
  avatarGradient: {
    padding: 4,
  },
  avatarInner: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'white',
  },
  avatarImage: {
    width: 130,
    height: 130,
  },
  typeBadge: {
    marginTop: -32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 2,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeBadgeText: {
    fontFamily: 'LufgaMedium',
    fontSize: 16,
  },
  userName: {
    marginTop: 8,
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  userEmail: {
    textAlign: 'center',
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#6B7280',
  },
  statsCard: {
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  statsIconWrapper: {
    height: 40,
    width: 40,
    overflow: 'hidden',
    borderRadius: 999,
  },
  statsIconGradient: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSpacer: {
    height: 16,
  },
  statsValue: {
    fontFamily: 'LufgaBold',
    fontSize: 20,
    color: '#192234',
  },
  statsLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 12,
    color: '#75758A',
  },
  loginCardWrapper: {
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 24,
  },
  loginCard: {
    padding: 24,
  },
  loginIconWrapper: {
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginTitle: {
    marginTop: 8,
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: 'white',
  },
  loginSubtitle: {
    marginTop: 4,
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#C8C8D0',
  },
  loginBtn: {
    marginTop: 16,
    width: 192,
    borderRadius: 999,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  loginBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
  },
  menuGroups: {
    flexDirection: 'column',
    gap: 20,
    paddingHorizontal: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E9E9EC',
    borderLeftColor: '#ACACB9',
    borderRightColor: '#ACACB9',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemFirst: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#ACACB9',
  },
  menuItemLast: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomColor: '#ACACB9',
  },
  menuItemLabel: {
    marginLeft: 12,
    flex: 1,
    fontFamily: 'LufgaRegular',
    fontSize: 16,
    color: '#192234',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  logoutBtnText: {
    marginLeft: 12,
    flex: 1,
    fontFamily: 'LufgaRegular',
    fontSize: 16,
    color: '#DC2626',
  },
});

export default Account;
