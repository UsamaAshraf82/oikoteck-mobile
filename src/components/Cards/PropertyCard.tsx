import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { BathtubIcon, BedIcon } from 'phosphor-react-native';
import { Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { cn } from '~/lib/utils';
import { Property_Type } from '~/type/property';
import { cloudfront } from '~/utils/cloudfront';
import { deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
import tailwind from '~/utils/tailwind';

const wide = deviceWidth - 16 * 2;
const height = wide / 1.2;

const PropertyCard = ({ property }: { property: Property_Type }) => {
  const progress = useSharedValue(0);
  const router = useRouter();
  return (
    <View className="mb-3 ml-4">
      <TouchableWithoutFeedback
        onPress={() => {
          router.push(`/property/${property.objectId}`);
        }}>
        <View
          className=" flex-row justify-between overflow-hidden rounded-md bg-white p-2"
          style={{
            width: wide,
            height: height,
          }}>
          <View className="flex-1 bg-white ">
            <View className="relative flex-1 overflow-hidden rounded-lg">
              <Carousel
                data={property.images}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={wide}
                style={{ width: '100%' }}
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
                      style={{ width: wide, height: '100%' }}
                      source={transformed}
                      placeholder={lazy}
                    />
                  );
                }}
              />

              {/* Dots */}
              <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                {property.images.map((_, index) => {
                  return <Dot key={index} index={index} progress={progress} />;
                })}
              </View>

              <View
                className={cn(
                  'absolute left-2 top-3  flex w-20 items-center justify-center rounded-lg bg-opacity-50 px-2 py-1 ',
                  {
                    'bg-gold': property.plan == 'Gold',
                    'bg-promote': property.plan == 'Promote',
                    'bg-promote_plus': property.plan == 'Promote +',
                    'bg-platinum': property.plan == 'Platinum',
                  }
                )}>
                <Text className="text-xs text-white">{property.plan}</Text>
              </View>

              {/* <MyCarousel
              images={property.images_low ? property.images_low : property.images}
              onPress={propertyPress}
            /> */}
              {/* <PropertyMapImage
            status={props.isMap && property.images.length > 0}
            propertyPress={propertyPress}
            image={'https://res.cloudinary.com/dgptopskq/image/upload/v1649909971/kl96mnzmceppaiwmboe0.jpg'}
          /> */}
              {/* <PropertyMapImage
            status={props.isMap && property.images.length > 0}
            propertyPress={propertyPress}
            image={property.images_low ? property.images_low[0] : property.images[0]}
          /> */}

              {/* <PropertyType plan={property.plan} />
          <FavoriteButtonContainer>
            <FavouriteButton
              pId={props.data.id}
              navigation={props.navigation}
              // favouritePress={props.favouritePress}
              // removeFavourite={props.removeFavourite}
            />
          </FavoriteButtonContainer> */}
            </View>

              <View className="mt-2">
                <View className="flex-row items-center justify-between">
                  <View className=" flex-row items-baseline">
                    <Text className="text-lg font-bold text-secondary">
                      {'€ ' + thoasandseprator(property.price)}
                    </Text>
                    {property.listing_for !== 'Sale' && (
                      <Text className="text-xs text-o_light_gray"> / Month</Text>
                    )}
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-primary">{property.title}</Text>
                </View>

                <Text className="text-xs text-primary">
                  {stringify_area_district({
                    district: property.district,
                    area_1: property.area_1,
                    area_2: property.area_2,
                  })}
                </Text>

                <View className="mt-1 flex-row items-center justify-start">
                  <View style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <BedIcon size={20} color={tailwind.theme.colors.o_light_gray} />
                    <Text className="ml-1 mr-0 text-sm text-o_light_gray">
                      {property.bedrooms} beds
                    </Text>
                  </View>
                  <View style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <BathtubIcon size={20} color={tailwind.theme.colors.o_light_gray} />
                    <Text className="ml-1 mr-0 text-sm text-o_light_gray">
                      {property.bedrooms} beds
                    </Text>
                  </View>
                  <View style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <BathtubIcon size={20} color={tailwind.theme.colors.o_light_gray} />
                    <Text className="ml-1 mr-0 text-sm text-o_light_gray">{property.size} m²</Text>
                  </View>
                  {/* {property.property_type === 'Commercial' ? (
                <InfoItem icon={Images.door} text={property.bedrooms + ' beds'} />
              ) : (
                <InfoItem icon={Images.bed} text={property.bedrooms + ' beds'} />
              )}
              <InfoItem icon={Images.bath} text={property.bathrooms + ' baths'} />
              <InfoItem icon={Images.area} text={property.size} size={'size'} /> */}
                </View>
              </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PropertyCard;

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
