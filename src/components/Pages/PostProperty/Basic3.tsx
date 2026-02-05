import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import DatePicker from '~/components/Elements/DatePicker';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { Basic1Values } from './Basic1';

type Props = {
  data: Partial<Basic3Values>;
  onSubmit: (data: Basic3Values) => void;
  extra_data: {
    listing_for: Basic1Values['listing_for'];
  };
};

export default function Basic3({ data, extra_data, onSubmit }: Props) {
  const { addToast } = useToast();
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Basic3Values>({
    resolver: zodResolver(Basic3Schema) as any,
    defaultValues: { ...data, ...extra_data },
  });

  useEffect(() => {
    reset({ ...data, ...extra_data });
  }, [data]);

  const onSubmitInternal = async (formData: Basic3Values) => {
    onSubmit(formData);
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof Basic3Values)[];
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

  const listingFor = watch('listing_for');

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <AppText style={styles.title}>
          Property details 🏠 <AppText style={styles.titleSub}>(Cont..)</AppText>
        </AppText>
        <AppText style={styles.subtitle}>Add your pricing details</AppText>

        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <ControlledTextInput
            control={control}
            name="price"
            placeholder="Amount"
            keyboardType="number-pad"
            label={listingFor === 'Rental' ? 'Rent/Month' : 'Price'}
          />
          {listingFor === 'Rental' && (
            <Select
              varient
              options={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                24,
              ].map((i: number) => ({ label: i + ' month', value: i }))}
              label="Security Deposit (Months)"
              value={{
                label: watch('deposit') || null,
                value: watch('deposit') || null,
              }}
              placeholder="Choose Options"
              onChange={(value) => {
                setValue('deposit', value?.value as Basic3Values['deposit']);
              }}
            />
          )}
          {listingFor === 'Rental' && (
            <Select
              varient
              options={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                24,
              ].map((i: number) => ({ label: i + ' month', value: i }))}
              label="Payment Frequency (Months)"
              value={{
                label: watch('payment_frequency'),
                value: watch('payment_frequency') || null,
              }}
              placeholder="Select frequency"
              onChange={(value) => {
                setValue('payment_frequency', value?.value as Basic3Values['payment_frequency']);
              }}
            />
          )}

          <DatePicker
            label={listingFor === 'Rental' ? 'Move in Date' : 'Sale Date'}
            value={watch('move_in_date')}
            onChange={(date: Date) => setValue('move_in_date', date.toISOString())}
            withForm
          />

          <Select
            varient
            options={Basic3Schema.shape.contact_method.options.map((i: string) => ({
              label: i,
              value: i,
            }))}
            label="Displayed Contact Method"
            value={{
              label: watch('contact_method'),
              value: watch('contact_method') || null,
            }}
            placeholder="Select Contact Method"
            onChange={(value) => {
              setValue('contact_method', value?.value as Basic3Values['contact_method']);
            }}
          />
          <ControlledTextInput
            control={control}
            name="reference_number"
            label="Reference Number"
            placeholder="Enter Reference Number"
          />
        </KeyboardAwareScrollView>
      </View>
      <View style={styles.footer}>
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          style={styles.continueBtn}>
          <AppText style={styles.continueBtnText}>Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  titleSub: {
    fontFamily: 'LufgaRegular',
    fontSize: 16,
    color: '#192234',
  },
  subtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#575775',
  },
  scrollContent: {
    marginTop: 20,
    flexGrow: 1,
    flexDirection: 'column',
    gap: 24,
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  continueBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  continueBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: 'white',
  },
});

export const Basic3Schema = z
  .object({
    listing_for: z.enum(['Rental', 'Sale'], {
      message: 'Listing For is Required.',
    }),

    contact_method: z.enum(['Phone', 'Email', 'Both'], {
      message: 'Contact Method is Required.',
    }),
    move_in_date: z.string(),

    price: z.coerce.number({ error: 'Price is Required.' }).min(1, 'Price is Required.'),

    deposit: z.number({
      message: 'Security Deposit (Months) is Required.',
    }),
    // .min(1, "Security Deposit (Months) is Required."),
    payment_frequency: z.number({
      message: 'Payment Frequency (Months) is Required.',
    }),
    // .min(1, "Payment Frequency (Months) is Required."),
    level_of_finish: z
      .number({
        message: 'Level of Finish is Required.',
      })
      .optional(),
    // .min(1, "Level of Finish is Required."),
    reference_number: z.string({}).optional(),
  })
  .superRefine((data: any, ctx: z.RefinementCtx) => {
    if (!data.move_in_date) {
      if (data.listing_for === 'Rental') {
        ctx.addIssue({
          code: 'custom',
          path: ['move_in_date'],
          message: 'Earliest Move-in Date is Required',
        });
      } else {
        ctx.addIssue({
          code: 'custom',
          path: ['move_in_date'],
          message: 'Earliest Sale Date is Required',
        });
      }
    }
  });

export type Basic3Values = z.infer<typeof Basic3Schema>;

const displayNames: Record<keyof Basic3Values, string> = {
  contact_method: 'Contact Method',
  move_in_date: 'Move in Date',
  price: 'Price',
  deposit: 'Security Deposit (Months)',
  payment_frequency: 'Payment Frequency (Months)',
  level_of_finish: 'Level of Finish',
  reference_number: 'Reference Number',
  listing_for: 'Listing For',
};
