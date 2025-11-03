import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import TextInput from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';

const date = new Date();
date.setMonth(date.getMonth() + 1);
export default function Index() {
  const [tab, setTab] = useState(0);
  const { addToast } = useToast();
  const router = useRouter();
  const { startActivity, stopActivity } = useActivityIndicator();
  const local: { id: string } = useLocalSearchParams();

  const { data: property } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);
      query.include('owner');

      const property = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return property;
    },
  });

  const onSubmit = async () => {
    startActivity();

    try {
      const query = new Parse.Query('Property');
      const pro = await query.get(local.id);
      // pro.set('plan', plan);
      pro.set('visible', false);
      pro.set('status', 'Pending Approval');
      pro.set('flag', 'RENEW');
      pro.set('flag_time', new Date());
      // pro.set('visible', false);
      await pro.save();

      addToast({
        heading: 'Listing Under Review',
        message: `Your listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status.`,
      });
      router.push('/account');
      stopActivity();
    } catch {}
    stopActivity();
  };

  if (!property) {
    return <View></View>;
  }

  return (
    <View className="flex-1 bg-white ">
      <TopHeader
        title="Renew Membership"
        onBackPress={() => {
          router.back();
        }}
      />

      <View className="flex-1  gap-2 px-5 ">
        <View>
          <AppText className="font-bold text-2xl">Membership Renewal</AppText>
          <AppText className="mb-1 text-sm text-[#575775]">
            Manage and renew your membership here.
          </AppText>
        </View>
        <PropertyCard property={property} type="change_plan" />

        <TextInput
          label="Membership Renewal Through"
          value={DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED)}
          readOnly
        />
      </View>
      <View className="absolute bottom-0 left-0 right-0  px-5 py-4">
        <PressableView
          onPress={() => {
            onSubmit();
          }}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}
