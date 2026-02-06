import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import PressableView from '~/components/HOC/PressableView';
import Area from '~/components/Sheets/District/Areas';
import District from '~/components/Sheets/District/District';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { useToast } from '~/store/useToast';

type Props = { data: Partial<LocationInfoTypes>; onSubmit: (data: LocationInfoTypes) => void };

export default function LocationInfo({ data, onSubmit }: Props) {
  const { addToast } = useToast();
  const [district, setDistrict] = useState(false);
  const [area, setArea] = useState(false);
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LocationInfoTypes>({
    resolver: zodResolver(LocationInfoSchema) as any,
    defaultValues: data,
  });

  const onSubmitInternal = async (formData: LocationInfoTypes) => {
    onSubmit(formData);
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof LocationInfoTypes)[];
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

  const marker = useWatch({ control, name: 'marker' });
  const currentDistrict = watch('district');
  const currentArea1 = watch('area_1');
  const currentArea2 = watch('area_2');

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <AppText style={styles.title}>Location details 📍</AppText>
        <AppText style={styles.subtitle}>Set your property location</AppText>

        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <Select
            label="District"
            onPress={() => {
              setDistrict(true);
            }}
            value={{ label: currentDistrict, value: currentDistrict }}
            placeholder="Select District"
          />
          <Select
            label="Area"
            onPress={() => {
              setArea(true);
            }}
            value={{
              label: stringify_area_district({
                area_1: currentArea1,
                area_2: currentArea2,
              }),
              value: { area_1: currentArea1, area_2: currentArea2 },
            }}
            placeholder="Select Area"
          />
          <ControlledTextInput
            control={control}
            name="address"
            label="Street Address"
            placeholder="Street Address"
          />
          <ControlledCheckBox control={control} name="exact_location" label="Show exact address" />
          <AppText style={styles.infoText}>
            This enables exact property location pin on the map, if disabled we will show a circle
            with a range of 100m on the property location
          </AppText>

          <AppText style={styles.infoText}>
            If Google maps find a partial match, drag the pin in the appropriate area to locate your
            property.
          </AppText>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: marker?.lat || 0,
                longitude: marker?.lng || 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}>
              <Marker
                draggable
                coordinate={{ latitude: marker?.lat || 0, longitude: marker?.lng || 0 }}
                onDragEnd={(e) =>
                  setValue('marker', {
                    lat: e.nativeEvent.coordinate.latitude,
                    lng: e.nativeEvent.coordinate.longitude,
                  })
                }
              />
            </MapView>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmitInternal, onError)} style={styles.continueBtn}>
          <AppText style={styles.continueBtnText}>Continue</AppText>
        </PressableView>
      </View>
      <District
        visible={district}
        onClose={() => setDistrict(false)}
        onPress={(districtData) => {
          setValue('district', districtData);
          setValue('area_1', undefined);
          setValue('area_2', undefined);
        }}
        value={currentDistrict}
      />
      <Area
        visible={area}
        onClose={() => setArea(false)}
        onPress={(areaData) => {
          setValue('area_1', areaData.area_1);
          setValue('area_2', areaData.area_2);
        }}
        district={currentDistrict}
        value={stringify_area_district({ area_1: currentArea1, area_2: currentArea2 })}
      />
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
  infoText: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  mapContainer: {
    flex: 1,
    height: 300,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
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

const LocationInfoSchema = z
  .object({
    district: z.string().min(1, {
      message: 'Area is Required.',
    }),
    area_1: z.string().optional(),
    area_2: z.string().nullable().optional(),
    exact_location: z.boolean(),
    address: z.string().min(1, {
      message: 'Address is Required.',
    }),
    searched: z.boolean().optional(),
    map_error: z.string().optional(),
    marker: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    center: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  })
  .superRefine((data: any, ctx: z.RefinementCtx) => {
    if (!data.area_1 && !data.area_2) {
      ctx.addIssue({
        code: 'custom',
        path: ['area_2'],
        message: 'Area is Required.',
      });
    }
  });

export type LocationInfoTypes = z.infer<typeof LocationInfoSchema>;

const displayNames: Record<keyof LocationInfoTypes, string> = {
  address: 'Address',
  district: 'District',
  area_1: 'Area',
  area_2: 'Area',
  exact_location: 'Exact Location',
  searched: 'Searched',
  map_error: 'Map Error',
  marker: 'Marker',
  center: 'Center',
};
