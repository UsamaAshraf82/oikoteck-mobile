import { zodResolver } from '@hookform/resolvers/zod';
import { useStripe } from '@stripe/stripe-react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import z from 'zod';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import TextInput, { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';
export default function Index() {
  const [tab, setTab] = useState(0);
  const { addToast } = useToast();
  const router = useRouter();
  const { startActivity, stopActivity } = useActivityIndicator();
  const local: { id: string } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentInfoTypes>({
    resolver: zodResolver(PaymentInfoSchema),
    // defaultValues: {},
  });

  const onSubmitInternal = async (data: PaymentInfoTypes) => {
    if (data.plan === 'Free') {
      onSubmit(data);
    } else {
      const res = await Parse.Cloud.run('stripe', { price: 30 });
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'OikoTeck',
        paymentIntentClientSecret: res.clientSecret,
      });
      if (error) {
        // handle error
        return;
      }
      const { error: paymentSheetError } = await presentPaymentSheet();

      if (paymentSheetError) {
        // handle error
        return;
      } else {
        onSubmit(data);
        // success
      }
    }
  };
  const onError = () => {
    Object.values(errors).forEach((err) => {
      if (err?.message) {
        addToast({
          type: 'error',
          heading: 'Validation Error',
          message: err.message,
        });
      }
    });
  };

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

  const onSubmit = async (data: PaymentInfoTypes) => {
    startActivity();

    try {
      const query = new Parse.Query('Property');
      const pro = await query.get(local.id);
      pro.set('plan', data.plan);

      pro.set('flag', 'CHANGE_PLAN');
      pro.set('flag_time', new Date());
      pro.set('status', 'Pending Approval');
      pro.set('visible', false);
      await pro.save();

      if (data.plan === 'Free') {
        addToast({
          heading: 'Listing Under Review',
          message: `Your listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status.`,
        });
      } else {
        addToast({
          heading: 'Change Plan',
          message: `Your promote listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status`,
        });
      }
      router.push('/account')
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
        title="Change Membership"
        onBackPress={() => {
          router.back();
        }}
      />

      <View className="flex-1  gap-2 px-5 ">
        <View>
          <AppText className="font-bold text-2xl">Change of Membership</AppText>
          <AppText className="mb-1 text-sm text-[#575775]">
            Manage your listing membership here.
          </AppText>
        </View>
        <PropertyCard property={property} type="change_plan" />

        <View>
          <AppText className="font-medium text-2xl">Select OikoTeck Service Plan</AppText>
          <AppText className="mb-1 text-sm text-[#575775]">
            Click on a service name to view more details
          </AppText>
        </View>
        <Checkbox
          labelLast
          label="Free"
          disabled={property.plan === 'Free'}
          labelClassName="font-light"
          getValue={() => setValue('plan', 'Free')}
          value={watch('plan') === 'Free'}
        />
        <Checkbox
          labelLast
          label="Promote "
          disabled={property.plan === 'Promote'}
          labelClassName="font-light"
          getValue={() => setValue('plan', 'Promote')}
          value={watch('plan') === 'Promote'}
        />
        {watch('plan') === 'Promote' && (
          <>
            <ControlledTextInput
              control={control}
              name="promo"
              label="Promo Code"
              placeholder="Promo Code"
            />
            <TextInput label="One-Time Payment" value="30 €" readOnly />
          </>
        )}
      </View>
      <View className="absolute bottom-0 left-0 right-0  px-5 py-4">
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const PaymentInfoSchema = z.object({
  plan: z.enum(['Free', 'Promote'], {
    message: 'Plan is Required.',
  }),
  promo: z.string().optional(),
});

export type PaymentInfoTypes = z.infer<typeof PaymentInfoSchema>;
