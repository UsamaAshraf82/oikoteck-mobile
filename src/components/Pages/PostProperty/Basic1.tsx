import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircleIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { property_category } from '~/utils/property';

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

  const onSubmitInternal = async (formData: Basic1Values) => {
    onSubmit(formData);
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

  const currentListingFor = watch('listing_for');

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <AppText style={styles.title}>Basic Information 🏠</AppText>
        <AppText style={styles.subtitle}>Tell us about your property</AppText>

        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View>
            <AppText style={styles.sectionLabel}>Listing Type</AppText>
            <Grid gap={8} cols={2}>
              <PressableView
                onPress={() => {
                  setValue('listing_for', 'Rental');
                }}
                style={[
                  styles.listingTypeBtn,
                  currentListingFor === 'Rental' && styles.listingTypeBtnActive,
                ]}>
                <View style={styles.listingTypeContent}>
                  <AppText
                    style={[
                      styles.listingTypeText,
                      currentListingFor === 'Rental' && styles.listingTypeTextActive,
                    ]}>
                    Rental
                  </AppText>
                  {currentListingFor === 'Rental' && (
                    <CheckCircleIcon weight="fill" color="#82065e" />
                  )}
                </View>
              </PressableView>
              <PressableView
                onPress={() => {
                  setValue('listing_for', 'Sale');
                }}
                style={[
                  styles.listingTypeBtn,
                  currentListingFor === 'Sale' && styles.listingTypeBtnActive,
                ]}>
                <View style={styles.listingTypeContent}>
                  <AppText
                    style={[
                      styles.listingTypeText,
                      currentListingFor === 'Sale' && styles.listingTypeTextActive,
                    ]}>
                    Sale
                  </AppText>
                  {currentListingFor === 'Sale' && (
                    <CheckCircleIcon weight="fill" color="#82065e" />
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
            style={styles.descriptionInput}
          />
          <Select
            options={Basic1Schema.shape.property_type.options.map((i: string) => ({
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
            options={property_category(watch('property_type')).map((i: string | null) => ({
              label: i || '',
              value: i || '',
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
              .options.map((i: string | null) => ({ label: i || '', value: i || '' }))}
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
      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmitInternal, onError)} style={styles.continueBtn}>
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
  subtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#575775',
  },
  scrollContent: {
    marginTop: 20,
    flexGrow: 1,
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 100,
  },
  sectionLabel: {
    marginVertical: 12,
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: '#192234',
  },
  listingTypeBtn: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  listingTypeBtnActive: {
    borderColor: '#82065e',
    backgroundColor: 'rgba(130, 6, 94, 0.1)',
  },
  listingTypeContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listingTypeText: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#192234',
  },
  listingTypeTextActive: {
    color: '#82065e',
  },
  descriptionInput: {
    height: 208, // h-52 -> 52*4=208
    textAlignVertical: 'top',
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
