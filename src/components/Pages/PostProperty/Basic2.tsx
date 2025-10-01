import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon, InfoIcon, MinusIcon, PlusIcon } from 'phosphor-react-native';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import z from 'zod';
import Checkbox from '~/components/Elements/Checkbox';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import useModal from '~/store/useModalHelper';
import tailwind from '~/utils/tailwind';
import { Basic1Values } from './Basic1';

type Props = {
  data: Partial<Basic2Values>;
  onSubmit: (data: Basic2Values) => void;
  extra_data: {
    property_type: Basic1Values['property_type'];
    property_category: Basic1Values['property_category'];
  };
};

export default function Basic2({ data, extra_data, onSubmit }: Props) {
  const { openModal } = useModal();
  const {
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<Basic2Values>({
    resolver: zodResolver(Basic2Schema) as any,
    defaultValues: { ...data, ...extra_data },
  });

  console.log(watch());
  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <Text className="text-2xl font-bold">Property details 🏠</Text>
        <Text className="text-[15px] text-[#575775]">
          Tell us more about your property in details
        </Text>
        <KeyboardAvoidingView>
          <ScrollView contentContainerClassName="mt-5 flex-grow flex-col gap-4 pb-28">
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium">No. of Bedrooms</Text>
              <View className="flex-row items-center justify-between">
                <PressableView
                  className=" size-6 rounded-full border"
                  onPress={() => setValue('bedrooms', watch('bedrooms') - 1)}>
                  <MinusIcon size={14} />
                </PressableView>
                <Text className="px-2 text-xl font-semibold">{watch('bedrooms')}</Text>
                <PressableView
                  className="size-6 rounded-full border"
                  onPress={() => setValue('bedrooms', watch('bedrooms') + 1)}>
                  <PlusIcon size={14} />
                </PressableView>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium">No. of Bathrooms</Text>
              <View className="flex-row items-center justify-between">
                <PressableView
                  className="size-6 rounded-full border"
                  onPress={() => setValue('bathrooms', watch('bathrooms') - 1)}>
                  <MinusIcon size={14} />
                </PressableView>
                <Text className="px-2 text-xl font-semibold">{watch('bathrooms')}</Text>
                <PressableView
                  className="size-6 rounded-full border"
                  onPress={() => setValue('bathrooms', watch('bathrooms') + 1)}>
                  <PlusIcon size={14} />
                </PressableView>
              </View>
            </View>

            <ControlledTextInput
              control={control}
              name="size"
              keyboardType="number-pad"
              label={watch('property_type') === 'Residential' ? 'Home Size, m²' : 'Size, m²'}
            />
            {['Detached House', 'Villa'].includes(watch('property_category')) && (
              <ControlledTextInput
                control={control}
                name="plot_size"
                keyboardType="number-pad"
                label="Plot Size, m²"
              />
            )}
            <View className="flex-col justify-between">
              <Text className="mb-2 text-sm font-medium">Furnished</Text>
              <Grid>
                <PressableView
                  className={cn('h-12 rounded-2xl border border-[#C6CAD2] bg-white', {
                    'border-secondary bg-secondary/10': watch('furnished') === true,
                  })}
                  onPress={() => setValue('furnished', true)}>
                  <View className="w-full flex-row items-center justify-between px-4 py-3">
                    <Text
                      className={cn({
                        'text-secondary ': watch('furnished') === true,
                      })}>
                      Yes
                    </Text>
                    {watch('furnished') === true && (
                      <CheckCircleIcon weight="fill" color={tailwind.theme.colors.secondary} />
                    )}
                  </View>
                </PressableView>
                <PressableView
                  className={cn('h-12 rounded-2xl border border-[#C6CAD2] bg-white', {
                    'border-secondary bg-secondary/10': watch('furnished') === false,
                  })}
                  onPress={() => setValue('furnished', false)}>
                  <View className="w-full flex-row items-center justify-between px-4 py-3">
                    <Text
                      className={cn({
                        'text-secondary ': watch('furnished') === false,
                      })}>
                      No
                    </Text>
                    {watch('furnished') === false && (
                      <CheckCircleIcon weight="fill" color={tailwind.theme.colors.secondary} />
                    )}
                  </View>
                </PressableView>
              </Grid>
            </View>
            <Select
              options={[1, 2, 3, 4, 5].map((i) => ({ label: level_of_finish(i), value: i }))}
              label="Level of Finish"
              value={{
                label: level_of_finish(watch('level_of_finish')),
                value: watch('level_of_finish') || null,
              }}
              placeholder="Select Level of Finish"
              onChange={(value) => {
                setValue('level_of_finish', value?.value as Basic2Values['level_of_finish']);
              }}
            />
            <PressableView
              onPress={() => {
                openModal({
                  modal: (
                    <View className="flex-col">
                      <Text>
                        OikoTeck will not display level of finish to users in the marketplace
                      </Text>
                      <View className="mt-2 flex flex-col gap-2">
                        <Text>Below are some level of finish examples:</Text>
                        <Text className="text-lg font-bold">Poor end</Text>
                        <Text>
                          Laminate countertops, vinyl flooring, basic fixtures, thin paint, basic
                          appliances.
                        </Text>
                        <Text className="text-lg font-bold">Low end</Text>
                        <Text>
                          Basic tile, laminate wood flooring, standard stainless steel appliances,
                          mid-range cabinetry.
                        </Text>
                        <Text className="text-lg font-bold">Medium end</Text>
                        <Text>
                          Granite countertops, hardwood flooring, quality fixtures, upgraded
                          appliances, solid wood cabinetry.
                        </Text>
                        <Text className="text-lg font-bold">High end</Text>
                        <Text>
                          Marble countertops, custom-designed cabinetry, high-end appliances,
                          designer tile, solid wood flooring, unique lighting fixtures.
                        </Text>
                        <Text className="text-lg font-bold">Luxury end</Text>
                        <Text>
                          Rare stone countertops, bespoke cabinetry, top-of-the-line appliances,
                          handcrafted elements, integrated smart home technology, designer fixtures
                        </Text>
                      </View>
                    </View>
                  ),
                  onClose: () => {},
                });
              }}
              className="h-16 rounded-2xl bg-[#E8BA3033]">
              <View className="mx-5 flex-row  gap-2 py-2">
                <InfoIcon size={18} />
                <Text className="mr-4 w-fit text-sm text-primary">
                  OikoTeck will not display level of finish to users in the marketplace
                </Text>
              </View>
            </PressableView>
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium">Floor</Text>
              <View className="flex-row items-center justify-between gap-1">
                <PressableView
                  className="wl size-6 rounded-full border"
                  onPress={() => setValue('floor', (watch('floor') || 0) - 1)}>
                  <MinusIcon size={14} />
                </PressableView>
                <Text className="px-2 text-xl font-semibold">{watch('floor')}</Text>
                <PressableView
                  className="size-6 rounded-full border"
                  onPress={() => setValue('floor', (watch('floor') || 0) + 1)}>
                  <PlusIcon size={14} />
                </PressableView>
              </View>
            </View>

            <ControlledTextInput
              control={control}
              name="construction_year"
              label="Construction Year"
              keyboardType="decimal-pad"
            />
            {/* <ControlledTextInput control={control} name="reference_number" label="Reference Number" /> */}
            <Select
              options={Basic2Schema.shape.heating
                .unwrap()
                .options.map((i) => ({ label: i, value: i }))}
              label="Heating System"
              value={{ label: watch('heating'), value: watch('heating') || null }}
              placeholder="Select Heating System"
              onChange={(value) => {
                setValue('heating', value?.value as Basic2Values['heating']);
              }}
            />
            <ControlledTextInput
              control={control}
              name="heating_expense"
              label="Monthly Heating Expenses"
            />
            <Select
              options={Basic2Schema.shape.energy_class
                .unwrap()
                .options.map((i) => ({ label: i, value: i }))}
              label="Energy Class"
              value={{ label: watch('energy_class'), value: watch('energy_class') || null }}
              placeholder="Select Energy Class"
              onChange={(value) => {
                setValue('energy_class', value?.value as Basic2Values['energy_class']);
              }}
            />
            <View>
              <Text className="text-sm font-medium mb-2">Special Features</Text>
              <View className='flex-col gap-2'>
                {special_feature(watch('property_type')).map((i) => (
                  <Checkbox labelClassName='text-sm align-middle' key={i} label={i} value={watch('special_feature').includes(i)} />
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={() => {
            onSubmit(getValues());
          }}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <Text className="text-lg font-bold text-white">Continue</Text>
        </PressableView>
      </View>
    </View>
  );
}

export const Basic2Schema = z
  .object({
    property_type: z.enum(['Residential', 'Commercial', 'Land']),
    property_category: z.enum([
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
    ]),
    bedrooms: z
      .number({
        message: 'Bedrooms is Required.',
      })
      .min(1, 'Bedrooms is Required.'),
    bathrooms: z
      .number({
        message: 'Bathrooms is Required.',
      })
      .min(1, 'Bathrooms is Required.'),
    floor: z.number({}).optional(),
    special_feature: z.string().array().min(1, { message: 'Special features are required.' }),

    heating: z
      .enum([
        'Autonomous Heating',
        'Central heating',
        'Air Condition',
        'Underfloor Heating',
        'None',
      ])
      .optional(),
    heating_expense: z.coerce.number().optional().or(z.literal('')),
    energy_class: z
      .enum([
        'A+',
        'A',
        'B+',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'Exempt from EPC',
        'EPC is under issuance',
      ])
      .optional(),
    size: z.coerce
      .number({
        message: 'Size is Required.',
      })
      .min(1, 'Size is Required.'),
    plot_size: z.coerce.number().optional(),
    furnished: z.boolean({
      message: 'Furnished is Required.',
    }),

    construction_year: z.coerce
      .number()
      .min(1900, 'Construction Year must be larger or equal to 1900')
      .max(2050, 'Construction Year must be smaller or equal to 2050')
      .optional()
      .or(z.literal('')),
    level_of_finish: z
      .number({
        message: 'Level of Finish is Required.',
      })
      .optional(),
    reference_number: z.string({}).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.property_type !== 'Land') {
      if (data.level_of_finish === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['level_of_finish'],
          message: 'Level of Finish is Required.',
        });
      }
    }
  });

export type Basic2Values = z.infer<typeof Basic2Schema>;

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
