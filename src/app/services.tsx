import blobs from '@/assets/svg/blobs_2.svg';
import { ImageBackground } from 'expo-image';
import { Link, router } from 'expo-router';
import { CheckIcon, XIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import { plans } from '~/global/plan';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';
const Services = () => {
  const [plan, setPlan] = useState('');
  return (
    <View className="flex-1 bg-white">
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={'Services'}
      />
      <View className="px-5">
        <AppText className="font-semibold text-2xl">Choose a Plan 📄</AppText>
        <AppText className="text-sm text-[#9191A1]">
          Discover how our Innovative approach can save you money and boost your business
          performance!
        </AppText>
      </View>
      <ScrollView contentContainerClassName=" px-5 pb-4 ">
        {plans.map((i, j) => (
          <TouchableWithoutFeedback
            key={j}
            onPress={() => {
              setPlan(i.name);
            }}>
            <View
              className={cn('relative mt-5  overflow-hidden rounded-3xl border', {
                'border-2 border-secondary': plan == i.name,
              })}>
              {plan == i.name && (
                <ImageBackground
                  source={blobs}
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '100%',
                    filter: 'blur(40px)',
                  }}
                  blurRadius={50}
                  contentFit="fill"
                />
              )}
              <View
                className={cn('relative gap-3 px-7 py-5', {
                  'border-secondary': plan == i.name,
                })}>
                <View className="flex-row items-center gap-2">
                  <View className={cn('size-4 rounded-full', i.pkgColor)} />
                  <AppText className="font-semibold text-lg">{i.name}</AppText>
                </View>
                <View className="flex-row items-center gap-1">
                  <AppText className="font-semibold text-lg">{i.price[0]}</AppText>
                  <AppText className="font-medium text-[#75758A]">{i.price[1]}</AppText>
                </View>
                <AppText className="text-sm text-[#575775]">{i.description}</AppText>
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {i.features.map((f, j) => (
                    <View key={i + '-' + j}>
                      {i.name == 'Free' && (j == 2 || j == 1) ? (
                        <View className="flex-row gap-1">
                          <XIcon color="#CCCFD6" size={18} />
                          <AppText className="text-[#CCCFD6]">{f}</AppText>
                        </View>
                      ) : (
                        <View className="flex-row gap-1">
                          <CheckIcon color="#575775" size={18} />
                          <AppText className="text-[#575775]">{f}</AppText>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                {['Promote +', 'Gold', 'Platinum'].includes(i.name) && (
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    <Link href={'/pricing'} className="text-secondary">
                      Access Pricing Options
                    </Link>
                  </View>
                )}
                {plan == i.name && (
                  <View className="absolute right-4 top-4 items-center justify-center rounded-full bg-secondary p-1">
                    <CheckIcon color={tailwind.theme.colors.white} weight="bold" size={16} />
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      {plan && (
        <View className="border-t border-[#ccc] px-5 py-1">
          <Pressable
            className="h-12 items-center justify-center rounded-full bg-secondary"
            onPress={() => {
              if (['Free', 'Promote'].includes(plan)) {
                router.push('/property/new');
              } else {
                router.push('/start-membership');
              }
            }}>
            <AppText className="font-semibold text-white">Select {plan} Plan</AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Services;
