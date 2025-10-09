import house from '@/assets/svg/house.svg';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Parse from 'parse/react-native';
import { HouseLineIcon, KeyIcon, UserIcon } from 'phosphor-react-native';
import React from 'react';
import { View } from 'react-native';
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
  const { user } = useUser();

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

  console.log('User data:', data);

  return (
    <View className="flex-1 bg-white px-3 pt-3">
      <View className="mb-6 flex-row items-center justify-between">
        <AppText className="font-semibold text-2xl">My Account</AppText>
        <View className="rounded-full border border-primary px-4 py-2">
          <AppText className="font-semibold text-xs">Edit Profile</AppText>
        </View>
      </View>
      {user && (
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
              'border-individual -mt-8 flex-row items-center gap-2 rounded-full border-2  bg-white px-4 py-2',
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
              className={cn(' text-individual font-medium', {
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
      )}
      {/* <View className="mb-6">
        <AppText className="mb-2 font-semibold text-lg">Settings</AppText>
        <View className="mb-2 rounded-lg border border-gray-300 p-4">
          <AppText className="font-medium">Notifications</AppText>
        </View>
        <View className="mb-2 rounded-lg border border-gray-300 p-4">
          <AppText className="font-medium">Privacy</AppText>
        </View>
        <View className="rounded-lg border border-gray-300 p-4">
          <AppText className="font-medium">Security</AppText>
        </View>
      </View> */}
      {/* <View className="mb-6 mt-auto">
        <View className="rounded-lg border border-red-500 p-4" onTouchEnd={logout}>
          <AppText className="text-center font-medium text-red-500">Logout</AppText>
        </View>
      </View> */}
    </View>
  );
};

export default Rental;
