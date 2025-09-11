import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon, GlobeHemisphereWestIcon, SquaresFourIcon } from 'phosphor-react-native';
import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { Property_Type } from '~/type/property';
import { cloudfront } from '~/utils/cloudfront';
import { deviceWidth } from '~/utils/global';
import tailwind from '~/utils/tailwind';

export default function Index() {
  const local: { id: string } = useLocalSearchParams();

  const router = useRouter();
  const progress = useSharedValue(0);

  const { data: property } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);

      const property = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return property;
    },
  });
  if (!property) {
    return null;
  }
  console.log(property);

  return (
    <ScrollView>
      <View className="flex-1 ">
        <View className="relative h-[380px]">
          <Carousel
            data={property.images}
            loop={false}
            pagingEnabled={true}
            snapEnabled={true}
            width={deviceWidth}
            // height={deviceHeight / 2}
            style={{ width: '100%', height: '100%' }}
            onProgressChange={(_, absoluteProgress) => {
              progress.value = absoluteProgress;
            }}
            onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
              'worklet';
              g.enabled(false);
            }}
            // onProgressChange={progress}
            renderItem={({ item, index }) => {
              const { src: transformed, lazy } = cloudfront(item, true, '800x800');

              return (
                <Image
                  contentFit="cover"
                  placeholderContentFit="cover"
                  style={{ width: deviceWidth, height: '100%' }}
                  source={transformed}
                  placeholder={lazy}
                />
              );
            }}
          />
          <View className="absolute left-4 top-4">
            <TouchableWithoutFeedback
              onPress={() => {
                router.back();
              }}>
              <ArrowLeftIcon size={20} color="white" />
            </TouchableWithoutFeedback>
          </View>
          <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
            {property.images.map((_, index) => {
              return <Dot key={index} index={index} progress={progress} />;
            })}
          </View>
        </View>
        <View className="p-4">
          <View className="flex-row items-baseline ">
            <Text className="text-2xl font-bold text-secondary">€ {property.price}</Text>
           {property.listing_for === 'Rental' && <Text className="text-sm font-medium text-[#8D95A5]">/Month</Text>}
          </View>
          <Text className="mt-2 text-xl font-bold text-primary">{property.title}</Text>
          <View className="mt-3 flex-row items-center">
            <GlobeHemisphereWestIcon
              color={tailwind.theme.colors.primary}
              duotoneColor={tailwind.theme.colors.primary}
              duotoneOpacity={0.9}
              weight="duotone"
            />
            <Text className="ml-2 text-sm font-medium text-primary">
              {stringify_area_district({
                district: property.district,
                area_1: property.area_1,
                area_2: property.area_2,
              })}
            </Text>
          </View>
          {property.reference_number && (
            <View className="mt-3 flex-row items-center">
              <SquaresFourIcon color={tailwind.theme.colors.primary} />
              <Text className="ml-2 text-sm font-medium text-primary">
                {property.reference_number}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function Dot({ index, progress }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0.4, 1, 0.4],
      'clamp'
    );
    const scale = interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0.8, 1.2, 0.8],
      'clamp'
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return <Animated.View style={[animatedStyle]} className="mx-1 h-2 w-2 rounded-full bg-white" />;
}
