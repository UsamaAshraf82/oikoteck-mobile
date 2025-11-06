import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import Grid from '~/components/HOC/Grid';
import { onepricetable } from '~/global/plan_price';
import { thoasandseprator } from '~/utils/number';
const limit = 50;
const Pricing = () => {
  const [listing_for, setListingFor] = useState('Rental');
  return (
    <View className="flex w-full flex-1 flex-col">
      <TopHeader
        onBackPress={() => router.back()}
        title="Pricing"
        // right={
        //   <View className="flex-row gap-1 rounded-full bg-[#E9E9EC] p-1">
        //     <TouchableWithoutFeedback
        //       onPress={() => {
        //         setListingFor('Rental');
        //       }}>
        //       <View
        //         className={cn('px-2 items-center justify-center  rounded-full   py-1', {
        //           'bg-white': listing_for === 'Rental',
        //         })}>
        //         <AppText
        //           className={cn('text-[#9191A1]', {
        //             'text-medium text-primary': listing_for === 'Rental',
        //           })}>
        //           3 Month
        //         </AppText>
        //       </View>
        //     </TouchableWithoutFeedback>
        //     <TouchableWithoutFeedback
        //       onPress={() => {
        //         setListingFor('Sale');
        //       }}>
        //       <View
        //         className={cn('px-2 items-center justify-center  rounded-full   py-1', {
        //           'bg-white': listing_for === 'Sale',
        //         })}>
        //         <AppText
        //           className={cn('text-[#9191A1]', {
        //             'text-medium text-primary': listing_for === 'Sale',
        //           })}>
        //           6 Month
        //         </AppText>
        //       </View>
        //     </TouchableWithoutFeedback>
        //   </View>
        // }
      />
      <View className="mb-2 px-5">
        <View className="">
          <AppText className="font-semibold text-2xl">Pricing Breakdown</AppText>
          <AppText className="text-sm text-[#9191A1]">
            View pricing details about each of the premium services we offer
          </AppText>
        </View>

        <Grid cols={4} className="flex-row items-center justify-between border-b border-[#D9D9D9]">
          <AppText className="font-semibold  text-base">Points</AppText>
          <View className="flex-col gap-1">
            <View className="flex-row gap-1">
              <View className="h-3 w-3 self-center rounded-full bg-promote_plus" />
              <AppText className="gap-1  font-semibold text-base">Promote +</AppText>
            </View>
            <AppText className="text-xs">Price Per Point</AppText>
          </View>
          <View className="flex-col gap-1">
            <View className="flex-row gap-1">
              <View className="h-3 w-3 self-center rounded-full bg-gold" />
              <AppText className="gap-1  font-semibold text-base">Gold</AppText>
            </View>
            <AppText className="text-xs">Price Per Point</AppText>
          </View>
          <View className="flex-col gap-1">
            <View className="flex-row gap-1">
              <View className="h-3 w-3 self-center rounded-full bg-platinum" />
              <AppText className="gap-1  font-semibold text-base">Platinum</AppText>
            </View>
            <AppText className="text-xs">Price Per Point</AppText>
          </View>
        </Grid>
      </View>
      <ScrollView contentContainerClassName="px-5 gap-2">
        {onepricetable.map((i, j) => (
          <Grid
            cols={4}
            key={j}
            className="flex-row items-center justify-between border-b border-[#D9D9D9]">
            <View className="">
              <AppText className=" text-sm">
                {thoasandseprator(i.low)}{' '}
                {i.high === Number.MAX_SAFE_INTEGER ? '+' : ' - ' + thoasandseprator(i.high)}
              </AppText>
              <AppText className=" text-xs">Points</AppText>
            </View>

            <AppText className="font-mono text-sm">€ {i.promote.toFixed(3)}</AppText>
            <AppText className="font-mono text-sm">€ {i.gold.toFixed(3)}</AppText>
            <AppText className="font-mono text-sm">€ {i.platinum.toFixed(3)}</AppText>
          </Grid>
        ))}
      </ScrollView>
    </View>
  );
};

export default Pricing;
