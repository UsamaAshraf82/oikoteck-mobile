import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  InfoIcon,
  MinusIcon,
  PlusIcon,
  XIcon,
} from 'phosphor-react-native';
import { useEffect } from 'react';
import { SubmitErrorHandler, useForm, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import useModal from '~/store/useModalHelper';
import { useToast } from '~/store/useToast';
import { level_of_finish, special_feature } from '~/utils/property';
import { Basic1Values } from './Basic1';

type Props = {
  data: Partial<Basic2Values>;
  onSubmit: (data: Basic2Values) => void;
  extra_data: {
    property_type: Basic1Values['property_type'];
    property_category: Basic1Values['property_category'];
  };

  onBack: (data: Basic2Values) => void;
  onCancel: (data: Basic2Values) => void;
  label?: string;
};

export default function Basic2({
  data,
  extra_data,
  onSubmit,
  onBack,  onCancel,
  label = 'Post a listing',
}: Props) {
  const { addToast } = useToast();
  const { openModal } = useModal();
  const router = useRouter();
  const { control, setValue, handleSubmit, getValues, reset } =
    useForm<Basic2Values>({
      resolver: zodResolver(Basic2Schema) as any,
      defaultValues: { ...data, ...extra_data },
    });

  useEffect(() => {
    reset({ ...data, ...extra_data });
  }, [data]);

  const onSubmitInternal = async (formData: Basic2Values) => {
    onSubmit(formData);
  };

  const onError: SubmitErrorHandler<Basic2Values> = (errors) => {
    const keys = Object.keys(errors) as (keyof Basic2Values)[];
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

  const bedrooms = useWatch({ control, name: 'bedrooms' });
  const bathrooms = useWatch({ control, name: 'bathrooms' });
  const floor = useWatch({ control, name: 'floor' }) || 0;
  const furnished = useWatch({ control, name: 'furnished' });
  const propertyCategory = useWatch({ control, name: 'property_category' });
  const propertyType = useWatch({ control, name: 'property_type' });
  const heating = useWatch({ control, name: 'heating' });
  const leveloffinish = useWatch({ control, name: 'level_of_finish' });
  const energy_class = useWatch({ control, name: 'energy_class' });
  const specialfeature = useWatch({ control, name: 'special_feature' });

  return (
    <>
      <View style={styles.header}>
        <Pressable
          hitSlop={20}
          onPress={() => {
            onBack(getValues());
          }}
        >
          <ArrowLeftIcon color='#192234' size={24} />
        </Pressable>
        <AppText style={styles.headerTitle}>{label}</AppText>
        <Pressable hitSlop={20} onPress={() => onCancel(getValues())}>
          <XIcon color='#192234' size={24} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <AppText style={styles.title}>Property details 🏠</AppText>
          <AppText style={styles.subtitle}>
            Tell us more about your property in details
          </AppText>

          <KeyboardAwareScrollView
            bottomOffset={50}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {/* Bedrooms */}
            <View style={styles.counterRow}>
              <AppText style={styles.counterLabel}>No. of Bedrooms</AppText>
              <View style={styles.counterControls}>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = bedrooms - 1;
                    if (val >= 0) {
                      setValue('bedrooms', val);
                    }
                  }}
                >
                  <MinusIcon size={14} color='#192234' />
                </PressableView>
                <AppText style={styles.counterValue}>{bedrooms}</AppText>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = bedrooms + 1;
                    if (val <= 10) {
                      setValue('bedrooms', val);
                    }
                  }}
                >
                  <PlusIcon size={14} color='#192234' />
                </PressableView>
              </View>
            </View>

            {/* Bathrooms */}
            <View style={styles.counterRow}>
              <AppText style={styles.counterLabel}>No. of Bathrooms</AppText>
              <View style={styles.counterControls}>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = bathrooms - 1;
                    if (val >= 0) {
                      setValue('bathrooms', val);
                    }
                  }}
                >
                  <MinusIcon size={14} color='#192234' />
                </PressableView>
                <AppText style={styles.counterValue}>{bathrooms}</AppText>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = bathrooms + 1;
                    if (val <= 10) {
                      setValue('bathrooms', val);
                    }
                  }}
                >
                  <PlusIcon size={14} color='#192234' />
                </PressableView>
              </View>
            </View>

            {/* Floor */}
            <View style={styles.counterRow}>
              <AppText style={styles.counterLabel}>Floor</AppText>
              <View style={styles.counterControls}>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = floor - 1;
                    if (val >= 0) {
                      setValue('floor', val);
                    }
                  }}
                >
                  <MinusIcon size={14} color='#192234' />
                </PressableView>
                <AppText style={styles.counterValue}>{floor}</AppText>
                <PressableView
                  style={styles.counterBtn}
                  onPress={() => {
                    const val = floor + 1;
                    if (val <= 10) {
                      setValue('floor', val);
                    }
                  }}
                >
                  <PlusIcon size={14} color='#192234' />
                </PressableView>
              </View>
            </View>

            <ControlledTextInput
              control={control}
              name='size'
              keyboardType='number-pad'
              placeholder={
                propertyType === 'Residential' ? 'Enter Home Size' : 'Enter Size'
              }
              label={
                propertyType === 'Residential' ? 'Home Size, m²' : 'Size, m²'
              }
            />

            {['Detached House', 'Villa'].includes(propertyCategory) && (
              <ControlledTextInput
                control={control}
                name='plot_size'
                placeholder={'Enter Plot Size'}
                keyboardType='number-pad'
                label='Plot Size, m²'
              />
            )}

            {/* Furnished */}
            <View style={styles.radioGroup}>
              <AppText style={styles.radioGroupLabel}>Furnished</AppText>
              <Grid gap={8} cols={2}>
                <PressableView
                  onPress={() => setValue('furnished', true)}
                  style={[
                    styles.radioBtn,
                    furnished === true && styles.radioBtnActive,
                  ]}
                >
                  <View style={styles.radioBtnContent}>
                    <AppText
                      style={[
                        styles.radioBtnText,
                        furnished === true && styles.radioBtnTextActive,
                      ]}
                    >
                      Yes
                    </AppText>
                    {furnished === true && (
                      <CheckCircleIcon weight='fill' color='#82065e' />
                    )}
                  </View>
                </PressableView>
                <PressableView
                  onPress={() => setValue('furnished', false)}
                  style={[
                    styles.radioBtn,
                    furnished === false && styles.radioBtnActive,
                  ]}
                >
                  <View style={styles.radioBtnContent}>
                    <AppText
                      style={[
                        styles.radioBtnText,
                        furnished === false && styles.radioBtnTextActive,
                      ]}
                    >
                      No
                    </AppText>
                    {furnished === false && (
                      <CheckCircleIcon weight='fill' color='#82065e' />
                    )}
                  </View>
                </PressableView>
              </Grid>
            </View>

            <Select
              varient
              options={[1, 2, 3, 4, 5].map((i) => ({
                label: level_of_finish(i),
                value: i,
              }))}
              label='Level of Finish'
              value={{
                label: level_of_finish(leveloffinish),
                value: leveloffinish || null,
              }}
              placeholder='Select Level of Finish'
              onChange={(value) => {
                setValue(
                  'level_of_finish',
                  value?.value as Basic2Values['level_of_finish']
                );
              }}
            />

            <PressableView
              onPress={() => {
                openModal({
                  modal: (
                    <View style={styles.modalContent}>
                      <AppText style={styles.modalInfoText}>
                        OikoTeck will not display level of finish to users in
                        the marketplace
                      </AppText>
                      <View style={styles.modalSteps}>
                        <AppText style={styles.modalStepTitle}>
                          Below are some level of finish examples:
                        </AppText>
                        <AppText style={styles.finishLevelTitle}>
                          Poor end
                        </AppText>
                        <AppText style={styles.finishLevelDesc}>
                          Laminate countertops, vinyl flooring, basic fixtures,
                          thin paint, basic appliances.
                        </AppText>
                        <AppText style={styles.finishLevelTitle}>
                          Low end
                        </AppText>
                        <AppText style={styles.finishLevelDesc}>
                          Basic tile, laminate wood flooring, standard stainless
                          steel appliances, mid-range cabinetry.
                        </AppText>
                        <AppText style={styles.finishLevelTitle}>
                          Medium end
                        </AppText>
                        <AppText style={styles.finishLevelDesc}>
                          Granite countertops, hardwood flooring, quality
                          fixtures, upgraded appliances, solid wood cabinetry.
                        </AppText>
                        <AppText style={styles.finishLevelTitle}>
                          High end
                        </AppText>
                        <AppText style={styles.finishLevelDesc}>
                          Marble countertops, custom-designed cabinetry,
                          high-end appliances, designer tile, solid wood
                          flooring, unique lighting fixtures.
                        </AppText>
                        <AppText style={styles.finishLevelTitle}>
                          Luxury end
                        </AppText>
                        <AppText style={styles.finishLevelDesc}>
                          Rare stone countertops, bespoke cabinetry,
                          top-of-the-line appliances, handcrafted elements,
                          integrated smart home technology, designer fixtures
                        </AppText>
                      </View>
                    </View>
                  ),
                  onClose: () => {},
                });
              }}
              style={styles.infoBanner}
            >
              <View style={styles.infoBannerContent}>
                <InfoIcon size={18} color='#192234' />
                <AppText style={styles.infoBannerText}>
                  OikoTeck will not display level of finish to users in the
                  marketplace
                </AppText>
              </View>
            </PressableView>

            <ControlledTextInput
              control={control}
              name='construction_year'
              placeholder='Select Construction Year'
              label='Construction Year'
              keyboardType='decimal-pad'
            />

            <Select
              varient
              options={Basic2Schema.shape.heating
                .unwrap()
                .options.map((i: string) => ({ label: i, value: i }))}
              label='Heating System'
              value={{ label: heating, value: heating || null }}
              placeholder='Select Heating System'
              onChange={(value) => {
                setValue('heating', value?.value as Basic2Values['heating']);
              }}
            />

            <ControlledTextInput
              control={control}
              name='heating_expense'
              label='Monthly Heating Expenses'
              placeholder='Select monthly expenses'
              keyboardType='number-pad'
              isPrice
            />

            <Select
              varient
              options={Basic2Schema.shape.energy_class
                .unwrap()
                .options.map((i: string) => ({ label: i, value: i }))}
              label='Energy Class'
              value={{
                label: energy_class,
                value: energy_class || null,
              }}
              placeholder='Select Energy Class'
              onChange={(value) => {
                setValue(
                  'energy_class',
                  value?.value as Basic2Values['energy_class']
                );
              }}
            />

            <View>
              <AppText style={styles.specialFeaturesLabel}>
                Special Features
              </AppText>
              <Grid gap={8} cols={1}>
                {special_feature(propertyType).map((i: string) => (
                  <Checkbox
                    labelStyle={styles.checkboxLabel}
                    key={i}
                    label={i}
                    labelLast
                    value={specialfeature.includes(i)}
                    getValue={() => {
                      if (specialfeature.includes(i)) {
                        setValue(
                          'special_feature',
                          specialfeature.filter((p: string) => p !== i)
                        );
                      } else {
                        setValue('special_feature', [...specialfeature, i]);
                      }
                    }}
                  />
                ))}
              </Grid>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.footer}>
          <PressableView
            onPress={handleSubmit(onSubmitInternal, onError)}
            style={styles.continueBtn}
          >
            <AppText style={styles.continueBtnText}>Continue</AppText>
          </PressableView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: 'LufgaMedium',
    fontSize: 18,
    color: '#192234',
  },
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
  subtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#575775',
    marginBottom: 32,
  },
  scrollContent: {
    marginTop: 20,
    flexGrow: 1,
    flexDirection: 'column',
    gap: 24,
    paddingBottom: 100,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterLabel: {
    // fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    minWidth: 45,
    textAlign: 'center',
    fontFamily: 'LufgaSemiBold',
    fontSize: 20,
    color: '#192234',
  },
  radioGroup: {
    flexDirection: 'column',
    gap: 8,
  },
  radioGroupLabel: {
    // fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  radioBtn: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  radioBtnActive: {
    borderColor: '#82065e',
    backgroundColor: 'rgba(130, 6, 94, 0.1)',
  },
  radioBtnContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  radioBtnText: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#192234',
  },
  radioBtnTextActive: {
    color: '#82065e',
  },
  infoBanner: {
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(232, 186, 48, 0.2)',
    justifyContent: 'center',
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: 'LufgaRegular',
    fontSize: 12,
    color: '#192234',
  },
  specialFeaturesLabel: {
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
    marginBottom: 8,
  },
  checkboxLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 13,
    color: '#192234',
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
  modalContent: {
    flexDirection: 'column',
    padding: 16,
  },
  modalInfoText: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#192234',
  },
  modalSteps: {
    marginTop: 8,
    flexDirection: 'column',
    gap: 8,
  },
  modalStepTitle: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
  },
  finishLevelTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: '#192234',
    marginTop: 12,
  },
  finishLevelDesc: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
});

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
        message: 'Number of bedrooms are required.',
      })
      .min(1, 'Number of bedrooms are required.'),
    bathrooms: z
      .number({
        message: 'Number of bathrooms are required.',
      })
      .min(1, 'Number of bathrooms are required.'),
    floor: z.number({}).optional(),
    special_feature: z
      .string()
      .array()
      .min(1, { message: 'Special features are required.' }),

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
      // .max(2050, 'Construction Year must be smaller or equal to 2050')
      .optional()
      .or(z.literal('')),
    level_of_finish: z
      .number({
        message: 'Level of finish is required.',
      })
      .optional(),
    // reference_number: z.string({}).optional(),
  })
  .superRefine((data: any, ctx: z.RefinementCtx) => {
    if (data.property_type !== 'Land') {
      if (data.level_of_finish === 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['level_of_finish'],
          message: 'Level of finish is required.',
        });
      }
    }
  });

export type Basic2Values = z.infer<typeof Basic2Schema>;

const displayNames: Record<keyof Basic2Values, string> = {
  bathrooms: 'Missing Bedrooms',
  bedrooms: 'Missing Bathrooms',
  floor: 'Floor',
  special_feature: 'Missing Special features',
  heating: 'Heating System',
  heating_expense: 'Monthly Heating Expenses',
  energy_class: 'Energy Class',
  size: 'Size',
  plot_size: 'Plot Size',
  furnished: 'Furnished',
  construction_year: 'Construction Year',
  level_of_finish: 'Missing Finish',
  // reference_number: 'Reference Number',
  property_category: 'Property Category',
  property_type: 'Property Type',
};
