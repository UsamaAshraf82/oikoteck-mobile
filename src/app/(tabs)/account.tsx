import house from '@/assets/svg/house.svg';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import Parse from 'parse/react-native';
import {
  BriefcaseIcon,
  CaretRightIcon,
  HandIcon,
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
  WarehouseIcon
} from 'phosphor-react-native';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import Grid from '~/components/HOC/Grid';
import { cn } from '~/lib/utils';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

const PropertyQuery = (listign_for: 'Sale' | 'Rental') => {
  const query = new Parse.Query('Property');
  return query.equalTo('listing_for', listign_for);
};

const Rental = () => {
  const { user, logout } = useUser();

  const { data } = useQuery({
    enabled: !!user?.id,
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const result = await Promise.all([
        PropertyQuery('Rental').count(),
        PropertyQuery('Sale').count(),
      ]);
      return { rental: result[0], sale: result[1] };
    },
    initialData: { rental: 0, sale: 0 },
  });

  return (
    <View className="flex-1 bg-white px-3 pt-3">
      {user && (
        <View className="mb-6 flex-row items-center justify-between">
          <AppText className="font-semibold text-2xl">My Account</AppText>
          <Link href={'/edit-profile'} className="rounded-full border border-primary px-4 py-2">
            <AppText className="font-semibold text-xs">Edit Profile</AppText>
          </Link>
        </View>
      )}

      <ScrollView className="mb-6">
        {user ? (
          <View className="mb-6 flex-col items-center justify-center">
            <View className="overflow-hidden rounded-full bg-white">
              <LinearGradient
                colors={[
                  user?.attributes.user_type === 'agent'
                    ? tailwind.theme.colors.agent
                    : tailwind.theme.colors.individual,
                  '#fff',
                ]}
                locations={[0.3, 0.9]}
                className=" p-1">
                <View className="overflow-hidden rounded-full bg-white">
                  <Image source={house} contentFit="fill" style={{ width: 130, height: 130 }} />
                </View>
              </LinearGradient>
            </View>
            <View
              className={cn(
                '-mt-8 flex-row items-center gap-2 rounded-full border-2 border-individual  bg-white px-4 py-2',
                {
                  'border-agent': user?.attributes.user_type === 'agent',
                }
              )}>
              <UserIcon
                size={17}
                weight="bold"
                color={
                  user?.attributes.user_type === 'agent'
                    ? tailwind.theme.colors.agent
                    : tailwind.theme.colors.individual
                }
              />

              <AppText
                className={cn(' font-medium text-individual', {
                  'text-agent': user?.attributes.user_type === 'agent',
                })}>
                {user?.attributes.user_type === 'agent' ? 'Agent' : 'Individual'}
              </AppText>
            </View>
            <AppText className="mt-2 font-semibold text-2xl">
              {user?.attributes.first_name} {user?.attributes.last_name}
            </AppText>
            <AppText className="text-center text-[15px] text-gray-500">
              {user?.attributes.username}
            </AppText>
            <Grid cols={2} gap={2}>
              <View className="mt-4 rounded-3xl border  border-gray-400 p-3">
                <View className="h-10 w-10 overflow-hidden rounded-full">
                  <View>
                    <LinearGradient
                      colors={['#82065e', '#192234']}
                      start={[0, 0]}
                      end={[1, 1]}
                      className=" h-10 w-10 items-center justify-center">
                      <HouseLineIcon color="#fff" weight="fill" size={18} />
                    </LinearGradient>
                  </View>
                </View>
                <View className="h-4" />
                <AppText className="font-semibold text-xl">{data?.rental}</AppText>
                <AppText className="text-xs text-[#75758A]">Properties for rent</AppText>
              </View>
              <View className="mt-4 rounded-3xl border  border-gray-400 p-3">
                <View className="h-10 w-10 overflow-hidden rounded-full">
                  <View>
                    <LinearGradient
                      colors={['#82065e', '#192234']}
                      start={[0, 0]}
                      end={[1, 1]}
                      className=" h-10 w-10 items-center justify-center">
                      <KeyIcon color="#fff" weight="fill" size={18} />
                    </LinearGradient>
                  </View>
                </View>
                <View className="h-4" />
                <AppText className="font-semibold text-xl">{data?.sale}</AppText>
                <AppText className="text-xs text-[#75758A]">Properties for sale</AppText>
              </View>
            </Grid>
          </View>
        ) : (
          <View className="mb-5 overflow-hidden rounded-3xl">
            <View>
              <LinearGradient
                colors={['#82065e', '#192234']}
                start={[0, 0]}
                end={[1, 1]}
                className="p-6 ">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <UserCircleIcon color="#fff" size={32} />
                </View>
                <AppText className="mt-2  font-semibold text-2xl text-white">
                  Log In to your account
                </AppText>
                <AppText className="mt-1 text-sm text-[#C8C8D0]">
                  Login or Signup to access all the features
                </AppText>
                <View>
                  <Link href="/login" className="mt-4 w-48 shrink rounded-full bg-white  py-3 pl-6">
                    <AppText className="font-semibold text-sm text-primary">
                      Log In to my account
                    </AppText>
                  </Link>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}

        <View className="flex-col gap-5">
          <View>
            {(user
              ? [
                  { icon: <WarehouseIcon />, label: 'My Properties', path: 'properties' },
                  { icon: <HandIcon />, label: 'Services', path: 'services' },
                    { icon: <QuestionIcon />, label: 'Frequently asked Questions', path: 'faqs' },
                  // { icon: <GiftIcon />, label: 'Share promo code', path: 'terms-conditions' },
                  { icon: <HeartIcon />, label: 'My Favorites', path: 'favorities' },
                  { icon: <PasswordIcon />, label: 'Change Password', path: 'change-password' },
                ]
              : [
                  { icon: <HandIcon />, label: 'Services', path: 'services' },
                  { icon: <HandIcon />, label: 'Services', path: 'services' },
                ]
            ).map((item, index, arr) => (
              <Link href={item.path} key={item.label}>
                <View
                  className={cn(
                    'flex-row items-center border-b border-l border-r border-x-[#acacb9] border-b-[#E9E9EC] px-4 py-4',
                    {
                      'rounded-t-3xl border-t border-t-[#acacb9]': index === 0,
                      'rounded-b-3xl border-b-[#acacb9]': index === arr.length - 1,
                    }
                  )}>
                  {item.icon}
                  <AppText className="ml-3 flex-1 text-base">{item.label}</AppText>
                  <CaretRightIcon color="#75758A" size={20} />
                </View>
              </Link>
            ))}
          </View>
          <View>
            {[
              // { icon: <ShareFatIcon />, label: 'Invite Friends', path: 'invite' },
              // { icon: <LightbulbIcon />, label: 'Give Feedback', path: 'feedback' },
              { icon: <BriefcaseIcon />, label: 'Terms and Conditions', path: 'terms-conditions' },
              { icon: <ShieldWarningIcon />, label: 'Privacy Policy', path: 'privacy-policy' },
              { icon: <HandshakeIcon />, label: 'Service Plan Terms', path: 'service-plan-terms' },
            ].map((item, index, arr) => (
              <Link href={item.path} key={item.label}>
                <View
                  className={cn(
                    'flex-row items-center border-b border-l border-r border-x-[#acacb9] border-b-[#E9E9EC] px-4 py-4',
                    {
                      'rounded-t-3xl border-t border-t-[#acacb9]': index === 0,
                      'rounded-b-3xl border-b-[#acacb9]': index === arr.length - 1,
                    }
                  )}>
                  {item.icon}
                  <AppText className="ml-3 flex-1 text-base">{item.label}</AppText>
                  <CaretRightIcon color="#75758A" size={20} />
                </View>
              </Link>
            ))}
          </View>
          {user && (
            <View>
              <TouchableWithoutFeedback onPress={() => logout()}>
                <View
                  className={cn(
                    'flex-row items-center rounded-3xl border border-red-600  px-4 py-4'
                  )}>
                  <SignOutIcon color={tailwind.theme.colors.red[600]} />
                  <AppText className="ml-3 flex-1 text-base text-red-600">Logout</AppText>
                  <CaretRightIcon color={tailwind.theme.colors.red[600]} size={20} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Rental;
