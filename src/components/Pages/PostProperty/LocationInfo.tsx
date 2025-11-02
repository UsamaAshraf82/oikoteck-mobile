import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import Select from '~/components/Elements/Select';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
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
    resolver: zodResolver(LocationInfoSchema),
    defaultValues: data,
  });

  const onSubmitInternal = async (data: LocationInfoTypes) => {
    onSubmit(data);
  };
  const onError = () => {
    console.log(errors);
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

  const marker = useWatch({ control, name: 'marker' });
  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="font-bold text-2xl">Location details 📍</AppText>
        <AppText className="text-[15px] text-[#575775]">Set your property location</AppText>
        <KeyboardAvoidingView>
          <ScrollView
            contentContainerClassName="mt-5 flex-grow flex-col gap-4 pb-28"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <Select
              label="District"
              onPress={() => {
                setDistrict(true);
              }}
              value={{ label: watch('district'), value: watch('district') }}
              placeholder="Select District"
            />
            <Select
              label="Area"
              onPress={() => {
                setArea(true);
              }}
              value={{
                label: stringify_area_district({
                  area_1: watch('area_1'),
                  area_2: watch('area_2'),
                }),
                value: { area_1: watch('area_1'), area_2: watch('area_2') },
              }}
              placeholder="Select Area"
            />
            <ControlledTextInput
              control={control}
              name="address"
              label="Street Address"
              placeholder="Street Address"
            />
            <ControlledCheckBox
              control={control}
              name="exact_location"
              label="Show exact address"
            />
            <AppText className="text-sm text-[#575775]">
              This enables exact property location pin on the map, if disabled we will show a circle
              with a range of 100m on the property location
            </AppText>

            <AppText className="mt-4 text-sm text-[#575775]">
              If Google maps find a partial match, drag the pin in the appropriate area to locate
              your property.
            </AppText>
            <MapView
              style={{ flex: 1 }}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
        </PressableView>
      </View>
      <District
        visible={district}
        onClose={() => setDistrict(false)}
        onPress={(data) => {
          setValue('district', data);
          setValue('area_1', undefined);
          setValue('area_2', undefined);
        }}
        value={watch('district')}
      />
      <Area
        visible={area}
        onClose={() => setArea(false)}
        onPress={(data) => {
          setValue('area_1', data.area_1);
          setValue('area_2', data.area_2);
        }}
        district={watch('district')}
        value={stringify_area_district({ area_1: watch('area_1'), area_2: watch('area_2') })}
      />
    </View>
  );
}

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
    marker: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    center: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.area_1 && !data.area_2) {
      ctx.addIssue({
        code: 'custom',
        path: ['area_2'],
        message: 'Area is Required.',
      });
    }
  });

export type LocationInfoTypes = z.infer<typeof LocationInfoSchema>;
