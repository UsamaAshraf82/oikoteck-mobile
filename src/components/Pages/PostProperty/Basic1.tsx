import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import z from 'zod';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';

type Props = { data: Partial<Basic1Values>; onSubmit: (data: Basic1Values) => void };

export default function Basic1({ data, onSubmit }: Props) {
  const {
    control,
    setValue,

    watch,
    formState: { errors },
  } = useForm<Basic1Values>({
    resolver: zodResolver(Basic1Schema),
    defaultValues: data,
  });
  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <Text className="text-2xl font-bold">Basic Information 🏠</Text>
        <Text className="text-[15px] text-[#575775]">Tell us about your property</Text>
        <View className="flex-col gap-2">
          <View>
            <Text className="my-3">Listing Type</Text>
            <Grid gap={2} cols={2}>
              <PressableView
                onPress={() => {
                  setValue('listing_for', 'Rental');
                }}
                className={cn('h-12 rounded-2xl border border-[#C6CAD2] bg-white', {
                  'border-secondary bg-secondary/10': watch('listing_for') === 'Rental',
                })}>
                <View className="w-full flex-row items-center justify-between px-4 py-3">
                  <Text
                    className={cn({
                      'text-secondary ': watch('listing_for') === 'Rental',
                    })}>
                    Rental
                  </Text>
                  {watch('listing_for') === 'Rental' && (
                    <CheckCircleIcon weight="fill" color={tailwind.theme.colors.secondary} />
                  )}
                </View>
              </PressableView>
              <PressableView
                onPress={() => {
                  setValue('listing_for', 'Sale');
                }}
                className={cn('h-12 rounded-2xl border border-[#C6CAD2] bg-white', {
                  'border-secondary bg-secondary/10': watch('listing_for') === 'Sale',
                })}>
                <View className="w-full flex-row items-center justify-between px-4 py-3">
                  <Text
                    className={cn({
                      'text-secondary ': watch('listing_for') === 'Sale',
                    })}>
                    Sale
                  </Text>
                  {watch('listing_for') === 'Sale' && (
                    <CheckCircleIcon weight="fill" color={tailwind.theme.colors.secondary} />
                  )}
                </View>
              </PressableView>
            </Grid>
          </View>
          <ControlledTextInput
            control={control}
            name="title"
            label="Listing Title"
            placeholder="Write listing title..."
          />
          <ControlledTextInput
            control={control}
            name="description"
            label="Description"
            placeholder="Write listing description..."
            multiline
            numberOfLines={5}
            className="h-52 align-top"
          />
          <Select
            options={Basic1Schema.shape.property_type.options.map((i) => ({ label: i, value: i }))}
            label="Property Type"
            value={{ label: watch('property_type'), value: watch('property_type') }}
            placeholder="Select Property Type"
            onChange={(value) => {
              setValue('property_type', value?.value as Basic1Values['property_type']);
              setValue('property_category', undefined as any, { shouldValidate: true });
            }}
          />
          <Select
            options={property_category(watch('property_type')).map((i) => ({ label: i, value: i }))}
            label="Property Category"
            placeholder="Select Property Category"
            value={{ label: watch('property_category'), value: watch('property_category') }}
            onChange={(value) =>
              setValue('property_category', value?.value as Basic1Values['property_category'])
            }
          />
        </View>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView className="h-12 items-center justify-center rounded-full bg-secondary">
          <Text className="text-lg font-bold text-white">Continue</Text>
        </PressableView>
      </View>
    </View>
  );
}

export const Basic1Schema = z.object({
  listing_for: z.enum(['Rental', 'Sale'], {
    message: 'Listing For is Required.',
  }),

  title: z
    .string()
    .min(1, { message: 'Title is required.' })
    .max(50, { message: 'Title cannot exceed 50 characters.' }),
  description: z
    .string()
    .min(300, {
      message: 'Description must be between 300 and 2000 characters.',
    })
    .max(2000, {
      message: 'Description must be between 300 and 2000 characters.',
    }),

  property_type: z.enum(['Residential', 'Commercial', 'Land'], {
    message: 'Property Type is Required.',
  }),
  property_category: z.enum(
    [
      'Flat',
      'Maisonette',
      'Detached House',
      'Villa',
      'Building',
      'Chalet',
      'Apartment',
      'Studio Flat',
      'Maisonette',
      'Chalet',
      'Studio',
      'Detached House',
      'Villa',
      'Building',
      'Apartment Complex',
      'Office',
      'Store',
      'Warehouse',
      'Industrial Space',
      'Hotel',
      'Business Building',
      'Residential Use',
      'Commercial Use',
      'Industrial Use',
      'Agricultural Use',
      'Recreational Use',
      'Unincorporated Use',
    ],
    {
      message: 'Property Category is Required.',
    }
  ),
});

export type Basic1Values = z.infer<typeof Basic1Schema>;

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
