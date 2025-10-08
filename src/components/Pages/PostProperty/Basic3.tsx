import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledDatePicker } from '~/components/Elements/DatePicker';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
import PressableView from '~/components/HOC/PressableView';
import { Basic1Values } from './Basic1';

type Props = {
  data: Partial<Basic3Values>;
  onSubmit: (data: Basic3Values) => void;
  extra_data: {
    listing_for: Basic1Values['listing_for'];
  };
};

export default function Basic3({ data, extra_data, onSubmit }: Props) {
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Basic3Values>({
    resolver: zodResolver(Basic3Schema) as any,
    defaultValues: { ...data, ...extra_data },
  });

  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="text-2xl font-bold">Property details 🏠 (Cont..)</AppText>
        <AppText className="text-[15px] text-[#575775]">Add your pricing details</AppText>
        <KeyboardAvoidingView>
          <ScrollView contentContainerClassName="mt-5 flex-grow flex-col gap-6 pb-28" showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <ControlledTextInput
              control={control}
              name="price"
              keyboardType="number-pad"
              label={watch('listing_for') === 'Rental' ? 'Rent/Month' : 'Price'}
            />
            {watch('listing_for') === 'Rental' && (
              <Select
                options={[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                  24,
                ].map((i) => ({ label: i, value: i }))}
                label="Security Deposit (Months)"
                value={{
                  label: watch('deposit'),
                  value: watch('deposit') || null,
                }}
                placeholder="Choose Options"
                onChange={(value) => {
                  setValue('deposit', value?.value as Basic3Values['deposit']);
                }}
              />
            )}
            {watch('listing_for') === 'Rental' && (
              <Select
                options={[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                  24,
                ].map((i) => ({ label: i + ' month', value: i }))}
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
            <ControlledDatePicker
              control={control}
              name="move_in_date"
              label={
                watch('listing_for') === 'Rental' ? 'Earliest Move in Date' : 'Earliest Sale Date'
              }
              withForm
            />
            <Select
              options={Basic3Schema.shape.contact_method.options.map((i) => ({
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
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={() => {
            onSubmit(getValues());
          }}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="text-lg font-bold text-white">Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

export const Basic3Schema = z
  .object({
    listing_for: z.enum(['Rental', 'Sale'], {
      message: 'Listing For is Required.',
    }),

    contact_method: z.enum(['Phone', 'Email', 'Both'], {
      message: 'Contact Method is Required.',
    }),
    move_in_date: z.string(),

    price: z
      .number({
        message: 'Price is Required.',
      })
      .min(1, 'Price is Required.'),

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
  .superRefine((data, ctx) => {
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

export function property_category(property_type: string | null, withAny = false) {
  let category: string[] = [];
  switch (property_type) {
    case 'Residential':
      category = [
        'Apartment',
        'Flat',
        'Studio',
        'Maisonette',
        'Detached House',
        'Villa',
        'Building',
        'Chalet',
      ];
      break;
    case 'Commercial':
      category = ['Office', 'Store', 'Warehouse', 'Industrial Space', 'Hotel', 'Business Building'];
      break;
    case 'Land':
      category = [
        'Residential Use',
        'Commercial Use',
        'Industrial Use',
        'Agricultural Use',
        'Recreational Use',
        'Unincorporated Use',
      ];
      break;
    default:
      category = [];
      break;
  }
  if (withAny) {
    category.push('Any');
  }
  return category;
}

export function level_of_finish(level_of_finish?: number) {
  switch (level_of_finish) {
    case 1:
      return '1 (Poor-end)';
    case 2:
      return '2 (Low-end)';
    case 3:
      return '3 (Medium-end)';
    case 4:
      return '4 (High-end)';
    case 5:
      return '5 (Luxury-end)';
    default:
      return '';
  }
}

export const special_feature = (property_type: 'Residential' | 'Commercial' | 'Land') => {
  if (property_type === 'Land') {
    return [
      'Power access',
      'Water access',
      'Drainage access',
      'Sanitary access',
      'Landscaping surface',
      'Hard surface',
      'Soil surface',
    ];
  }
  return [
    'Parking Spot',
    'Elevator',
    'Secure door',
    'Alarm',
    'Storage Space',
    'Fireplace',
    'Balcony',
    'Internal Staircase',
    'Swimming pool',
    'Playroom',
    'Attic',
    'Solar water heating',
    'Pets Welcome',
    'Renovated',
    'Luxurious',
    'Unfinished',
    'Under Construction',
    'Neoclassical',
  ];
};
