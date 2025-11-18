import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { cn } from '~/lib/utils';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
import tailwind from '~/utils/tailwind';
import AppText from '../Elements/AppText';
import AWSImage from '../Elements/AWSImage';
import BathIcon from '../SVG/Bath';
import BedIcon from '../SVG/Bed';
import SizeIcon from '../SVG/Size';
import FavButton from './FavButton';

const wide = deviceWidth - 16 * 2;
const height = wide / 1.2;

const PropertyCard = ({ property }: { property: Property_Type }) => {
  const progress = useSharedValue(0);
  const router = useRouter();
  let owner: User_Type;
  if (property.owner instanceof Parse.User) {
    // @ts-ignore
    owner = property.owner.toJSON();
  } else {
    owner = property.owner as User_Type;
  }
  return (
    <View className="relative mb-[14px] ml-4">
      <Pressable
        onPress={() => {
          router.push(`/property/${property.objectId}`);
        }}>
        <View
          className=" flex-row justify-between overflow-hidden rounded-2xl bg-white p-3"
          style={{
            width: wide,
            height: height,
          }}>
          <View className="flex-1 bg-white ">
            <View className="relative flex-1 overflow-hidden rounded-2xl">
              <Carousel
                data={property.images}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={wide}
                //  mode="horizontal-stack"
                style={{ width: '100%' }}
                onProgressChange={(_, absoluteProgress) => {
                  progress.value = absoluteProgress;
                }}
                onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                  'worklet';
                  g.enabled(false);
                }}
                // onProgressChange={progress}
                renderItem={({ item }) => {
                  return (
                    <View className="relative">
                      <AWSImage
                        contentFit="cover"
                        placeholderContentFit="cover"
                        style={{ width: wide, height: '100%' }}
                        src={item}
                        size="800x800"
                      />
                      {property.agent_icon && owner.logo && (
                        <View className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2  -translate-y-1/2">
                          <AWSImage
                            contentFit="cover"
                            placeholderContentFit="cover"
                            src={owner.logo}
                            size="300x300"
                            debug
                            style={{ width: 70, height: 70, opacity: 0.7 }}
                          />
                        </View>
                      )}
                    </View>
                  );
                }}
              />

              {/* Dots */}
              <View className="absolute bottom-2 left-0 right-0 flex-row items-center justify-center">
                {property.images.map((_, index) => {
                  return <Dot key={index} index={index} progress={progress} />;
                })}
              </View>

              {property.plan !== 'Free' && (
                <View
                  className={cn(
                    'absolute left-2 top-3  flex w-20 items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ',
                    {
                      'bg-gold': property.plan == 'Gold',
                      'bg-promote': property.plan == 'Promote',
                      'bg-promote_plus': property.plan == 'Promote +',
                      'bg-platinum': property.plan == 'Platinum',
                    }
                  )}>
                  <AppText className="text-xs text-white">{property.plan}</AppText>
                </View>
              )}
              <View className="absolute right-2 top-2 z-10">
                <FavButton property_id={property.objectId} property={property} />
              </View>
            </View>
            <View className="mt-2">
              <View className="flex-row items-center justify-between">
                <View className=" flex-row items-baseline">
                  <AppText className="font-semibold text-[17px] text-secondary">
                    {'€ ' + thoasandseprator(property.price)}
                  </AppText>
                  {property.listing_for !== 'Sale' && (
                    <AppText className="font-medium text-[15px] text-o_light_gray">
                      {' '}
                      / Month
                    </AppText>
                  )}
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <AppText className="font-semibold text-[15px] text-primary">
                  {property.title}
                </AppText>
              </View>
              <AppText className="text-sm text-[#75758A]">
                {stringify_area_district({
                  district: property.district,
                  area_1: property.area_1,
                  area_2: property.area_2,
                })}
              </AppText>
              <View className="mt-1 flex-row items-center justify-start">
                <View className="mr-4 flex-row items-center">
                  <BedIcon
                    height={17}
                    width={17}
                    color={tailwind.theme.colors.o_light_gray}
                    className="text-o_light_gray"
                  />
                  <AppText className="ml-1 mr-0 text-sm text-o_light_gray">
                    {property.bedrooms} beds
                  </AppText>
                </View>
                <View className="mr-4 flex-row items-center">
                  <BathIcon
                    height={17}
                    width={17}
                    color={tailwind.theme.colors.o_light_gray}
                    className="text-o_light_gray"
                  />
                  <AppText className="ml-1 mr-0 text-sm text-o_light_gray">
                    {property.bathrooms} baths
                  </AppText>
                </View>
                <View className="mr-4 flex-row items-center  text-o_light_gray">
                  <SizeIcon
                    height={18}
                    width={18}
                    color={tailwind.theme.colors.o_light_gray}
                    className="text-o_light_gray"
                  />
                  <AppText className="ml-1 mr-0 text-sm text-o_light_gray">
                    {property.size} m²
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default PropertyCard;


function Dot({ index, progress }: any) {
  const style = useAnimatedStyle(() => {
    const selectedIndex = Math.round(progress.value);

    const isMain = selectedIndex === index;
    const isNear = selectedIndex === index + 1 || selectedIndex === index - 1;
    const isFar = selectedIndex === index + 2 || selectedIndex === index - 2;

    return {
      display: isMain || isNear || isFar ? 'flex' : 'none',
      opacity: isMain || isNear || isFar ? 1 : 0,
      width: isMain ? 8 : isNear ? 6 : isFar ? 4 : 0,
      height: isMain ? 8 : isNear ? 6 : isFar ? 4 : 0,
    };
  });

  return (
    <Animated.View
      key={index}
      style={style}
      className={cn(
        'mx-1 rounded-full   bg-white/70',
        // override opacity for main
        {
          'bg-white/90': Math.round(progress.value) === index,
        }
      )}
    />
  );
}
