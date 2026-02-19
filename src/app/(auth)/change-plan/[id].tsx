import { zodResolver } from '@hookform/resolvers/zod';
import { useStripe } from '@stripe/stripe-react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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

const PaymentInfoSchema = z.object({
  plan: z.enum(['Free', 'Promote'], {
    message: 'Plan is Required.',
  }),
  promo: z.string().optional(),
});

export type PaymentInfoTypes = z.infer<typeof PaymentInfoSchema>;

const displayNames: Record<keyof PaymentInfoTypes, string> = {
  plan: 'Plan',
  promo: 'Promo Code',
};

const ChangePlan = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const activity = useActivityIndicator();
  const local = useLocalSearchParams<{ id: string }>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentInfoTypes>({
    resolver: zodResolver(PaymentInfoSchema),
    defaultValues: {
      plan: 'Free',
    },
  });

  const onSubmitInternal = async (formData: PaymentInfoTypes) => {
    if (formData.plan === 'Free') {
      await performSubmit(formData);
    } else {
      activity.startActivity();
      try {
        const res = await Parse.Cloud.run('stripe', { price: 30 });
        const { error } = await initPaymentSheet({
          merchantDisplayName: 'OikoTeck',
          paymentIntentClientSecret: res.clientSecret,
        });

        if (error) {
          activity.stopActivity();
          addToast({
            type: 'error',
            heading: 'Payment Error',
            message: error.message,
          });
          return;
        }

        activity.stopActivity();
        const { error: paymentSheetError } = await presentPaymentSheet();

        if (paymentSheetError) {
          addToast({
            type: 'error',
            heading: 'Payment Error',
            message: paymentSheetError.message,
          });
          return;
        } else {
          await performSubmit(formData);
        }
      } catch (e: any) {
        activity.stopActivity();
        addToast({
          type: 'error',
          heading: 'Error',
          message: e.message || 'An unexpected error occurred.',
        });
      }
    }
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof PaymentInfoTypes)[];
    for (let index = 0; index < keys.length; index++) {
      const element = errors[keys[index]];
      if (element?.message) {
        addToast({
          type: 'error',
          heading: displayNames[keys[index]],
          message: element.message,
        });
      }
    }
  };

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);
      query.include('owner');

      const result = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return result;
    },
    enabled: !!local.id,
  });

  const performSubmit = async (formData: PaymentInfoTypes) => {
    activity.startActivity();
    try {
      if (!local.id) return;
      const query = new Parse.Query('Property');
      const pro = await query.get(local.id);
      pro.set('plan', formData.plan);
      pro.set('flag', 'CHANGE_PLAN');
      pro.set('flag_time', new Date());
      pro.set('status', 'Pending Approval');
      pro.set('visible', false);
      await pro.save();

      if (formData.plan === 'Free') {
        addToast({
          heading: 'Listing Under Review',
          message:
            'Your listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status.',
        });
      } else {
        addToast({
          heading: 'Change Plan',
          message:
            'Your promote listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status',
        });
      }
      activity.stopActivity();
      router.push('/account');
    } catch (e: any) {
      activity.stopActivity();
      addToast({
        type: 'error',
        heading: 'Submission Error',
        message: e.message || 'Failed to update plan.',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#82065e" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <TopHeader title="Change Membership" onBackPress={() => router.back()} />
        <View style={styles.emptyContainer}>
          <AppText style={styles.subTitle}>Property not found.</AppText>
        </View>
      </View>
    );
  }

  const currentPlan = watch('plan');

  return (
    <View style={styles.container}>
      <TopHeader
        title="Change Membership"
        onBackPress={() => {
          router.back();
        }}
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <AppText style={styles.mainTitle}>Change of Membership</AppText>
          <AppText style={styles.subTitle}>Manage your listing membership here.</AppText>
        </View>

        <PropertyCard property={property} type="change_plan" />

        <View style={styles.selectionSection}>
          <AppText style={styles.sectionTitle}>Select OikoTeck Service Plan</AppText>
          <AppText style={styles.sectionSubTitle}>
            Click on a service name to view more details
          </AppText>
        </View>

        <View style={styles.optionsWrapper}>
          <Checkbox
            labelLast
            label="Free"
            disabled={property.plan === 'Free'}
            labelStyle={styles.checkboxLabel}
            getValue={() => setValue('plan', 'Free')}
            value={currentPlan === 'Free'}
          />
          <Checkbox
            labelLast
            label="Promote"
            disabled={property.plan === 'Promote'}
            labelStyle={styles.checkboxLabel}
            getValue={() => setValue('plan', 'Promote')}
            value={currentPlan === 'Promote'}
          />
        </View>

        {currentPlan === 'Promote' && (
          <View style={styles.promoWrapper}>
            <ControlledTextInput
              control={control}
              name="promo"
              label="Promo Code"
              placeholder="Promo Code"
            />
            <TextInput label="One-Time Payment" value="30 €" readOnly />
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmitInternal, onError)} style={styles.submitBtn}>
          <AppText style={styles.submitBtnText}>Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  headerSection: {
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
    marginTop: 4,
  },
  selectionSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 22,
    color: '#192234',
  },
  sectionSubTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 13,
    color: '#575775',
    marginTop: 2,
  },
  optionsWrapper: {
    gap: 12,
  },
  checkboxLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 16,
    color: '#192234',
  },
  promoWrapper: {
    gap: 12,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: 'white',
  },
  submitBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: 'white',
  },
});

export default ChangePlan;
