import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import { useToast } from '~/store/useToast';
import { property_category } from '~/utils/property';
import tailwind from '~/utils/tailwind';

type Props = { data: Partial<Basic1Values>; onSubmit: (data: Basic1Values) => void };

export default function Basic1({ data, onSubmit }: Props) {
  const { addToast } = useToast();
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Basic1Values>({
    resolver: zodResolver(Basic1Schema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  const onSubmitInternal = async (data: Basic1Values) => {
    onSubmit(data);
  };
  const onError = () => {
    const keys = Object.keys(errors) as (keyof Basic1Values)[];
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

  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="font-bold text-2xl">Basic Information 🏠</AppText>
        <AppText className="text-[15px] text-[#575775]">Tell us about your property</AppText>

        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerClassName="mt-5 flex-grow flex-col gap-4 pb-28"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View>
            <AppText className="my-3 font-medium text-[13px] text-primary">Listing Type</AppText>
            <Grid gap={2} cols={2}>
              <PressableView
                onPress={() => {
                  setValue('listing_for', 'Rental');
                }}
                className={cn('h-12 rounded-2xl border border-[#C6CAD2] bg-white', {
                  'border-secondary bg-secondary/10': watch('listing_for') === 'Rental',
                })}>
                <View className="w-full flex-row items-center justify-between px-4 py-3">
                  <AppText
                    className={cn({
                      'text-secondary ': watch('listing_for') === 'Rental',
                    })}>
                    Rental
                  </AppText>
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
                  <AppText
                    className={cn({
                      'text-secondary ': watch('listing_for') === 'Sale',
                    })}>
                    Sale
                  </AppText>
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
            options={Basic1Schema.shape.property_type.options.map((i) => ({
              label: i,
              value: i,
            }))}
            varient
            label="Property Type"
            value={{ label: watch('property_type'), value: watch('property_type') }}
            placeholder="Select Property Type"
            onChange={(value) => {
              setValue('property_type', value?.value as Basic1Values['property_type']);
              setValue('property_category', undefined as any, { shouldValidate: true });
            }}
          />
          <Select
            varient
            options={property_category(watch('property_type')).map((i) => ({
              label: i,
              value: i,
            }))}
            label="Property Category"
            placeholder="Select Property Category"
            value={{ label: watch('property_category'), value: watch('property_category') }}
            onChange={(value) =>
              setValue('property_category', value?.value as Basic1Values['property_category'])
            }
          />
          <Select
            varient
            options={Basic1Schema.shape.property_oriantation
              .unwrap()
              .options.map((i) => ({ label: i, value: i }))}
            label="Property Oriantation"
            placeholder="Select Property Oriantation"
            value={{
              label: watch('property_oriantation'),
              value: watch('property_oriantation') || null,
            }}
            onChange={(value) =>
              setValue('property_oriantation', value?.value as Basic1Values['property_oriantation'])
            }
          />
        </KeyboardAwareScrollView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
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
    .string({ message: 'Title is required.' })
    .min(1, { message: 'Title is required.' })
    .max(50, { message: 'Title cannot exceed 50 characters.' }),
  description: z
    .string({ message: 'Description must be between 300 and 2000 characters.' })
    .min(1, {
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
  property_oriantation: z
    .enum(['North-Facing', 'South-Facing', 'East-Facing', 'West-Facing', ''])
    .optional(),
});

export type Basic1Values = z.infer<typeof Basic1Schema>;

const displayNames: Record<keyof Basic1Values, string> = {
  description: 'Description',
  title: 'Title',
  property_type: 'Property Type',
  property_category: 'Property Category',
  property_oriantation: 'Property Oriantation',
  listing_for: 'Listing For',
};
