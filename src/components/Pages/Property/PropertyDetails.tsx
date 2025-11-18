import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChatCircleIcon,
  CouchIcon,
  FileTextIcon,
  GlobeHemisphereWestIcon,
  HouseLineIcon,
  MapPinIcon,
  ShareFatIcon,
  SquaresFourIcon,
  StairsIcon,
} from 'phosphor-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  ColorValue,
  Modal,
  Pressable,
  ScrollView,
  Share,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import FavButton from '~/components/Cards/FavButton';
import AppText from '~/components/Elements/AppText';
import AWSImage from '~/components/Elements/AWSImage';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import SimilarListing from '~/components/Pages/Property/SimilarListing';
import BathIcon from '~/components/SVG/Bath';
import BedIcon from '~/components/SVG/Bed';
import SizeIcon from '~/components/SVG/Size';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { cn } from '~/lib/utils';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceHeight, deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
import tailwind, { tailwind_color } from '~/utils/tailwind';
import ContactOwner from './ContactOwner';
import SubmitOffer from './SubmitOffer';

export default function PropertyDetails({ property }: { property: Property_Type }) {
  const router = useRouter();
  const progress = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const [lightBoxVisible, setLightBoxVisible] = useState(false);
  const [contactOwnerVisible, setContactOwnerVisible] = useState(false);
  const [SubmitOfferVisible, setSubmitOfferVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

  const details = useMemo(() => {
    const base = [
      {
        icon:
          property.property_type === 'Commercial' ? (
            <BedIcon width={18} height={18} />
          ) : (
            <BedIcon width={18} height={18} />
          ),
        heading: 'Bedrooms',
        detail: property.property_type === 'Land' ? 'N/A' : property.bedrooms,
      },
      {
        icon: <BathIcon width={18} height={18} />,
        heading: 'Bathrooms',
        detail: property.property_type === 'Land' ? 'N/A' : property.bathrooms,
      },
      {
        icon: <SizeIcon width={18} height={18} />,
        heading: property.property_type === 'Land' ? 'Plot Size' : 'Size',
        detail: property.size + ' m²',
      },
      {
        heading: 'Type',
        icon: <HouseLineIcon size={20} />,
        detail: property.property_type,
      },
    ];

    // Dynamically insert Floor No
    if (property.property_type !== 'Land') {
      base.push({
        heading: 'Floor No',
        icon: <StairsIcon size={20} />,
        detail: property.floor === 0 ? 'Ground' : property.floor,
      });
    }

    base.push(
      {
        heading: 'Listing Date',
        icon: <CalendarIcon size={20} />,
        detail: new Date(property.createdAt).toLocaleDateString('en-GB'),
      },
      {
        heading: 'Furnished',
        icon: <CouchIcon size={20} />,
        detail: property.furnished ? 'Yes' : 'No',
      }
    );

    return base;
  }, [property]);

  let owner: User_Type;
  if (property.owner instanceof Parse.User) {
    // @ts-ignore
    owner = property.owner.toJSON();
  } else {
    owner = property.owner as User_Type;
  }

  return (
    <View className="relative flex-1">
      {SubmitOfferVisible && (
        <SubmitOffer property={property} onClose={() => setSubmitOfferVisible(false)} />
      )}
      <ContactOwner
        property={property}
        visible={contactOwnerVisible}
        onClose={() => setContactOwnerVisible(false)}
      />

      <View>
        <Modal visible={lightBoxVisible} transparent={true}>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black' }}>
            <Carousel
              ref={carouselRef}
              data={property.images}
              loop={false}
              width={deviceWidth}
              height={deviceHeight}
              defaultIndex={startIndex}
              onProgressChange={(_, absoluteProgress) => {
                progress2.value = absoluteProgress;
              }}
              renderItem={({ item }) => {
                return (
                  <View className="relative">
                    <ZoomableImage src={item} />
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

            {/* Close button */}
            <View className="absolute left-4 top-4">
              <TouchableWithoutFeedback
                onPress={() => {
                  setLightBoxVisible(false);
                }}>
                <ArrowLeftIcon size={24} color="white" weight="bold" />
              </TouchableWithoutFeedback>
            </View>

            <View className="absolute right-4 top-4 z-10 flex-row gap-3">
              <TouchableWithoutFeedback
                onPress={async () => {
                  const result = await Share.share({
                    message: `Hi! I found this property. Enjoy reviewing its features on OikoTeck.\nhttps://www.oikoteck.com/property/${property.objectId}`,
                  });
                  console.log(Share, result);
                }}>
                <ShareFatIcon color="#fff" duotoneColor={'#000'} weight="duotone" size={30} />
              </TouchableWithoutFeedback>
              <FavButton property={property} property_id={property.objectId} size={30} />
            </View>
            <View className="absolute bottom-2 left-0 right-0 flex-row items-center justify-center">
              {property.images.map((_, index) => {
                return (
                  <Dot
                    key={index}
                    index={index}
                    progress={progress2}
                    activeColor={tailwind_color.secondary}
                  />
                );
              })}
            </View>
          </GestureHandlerRootView>
        </Modal>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View className="mb-10 flex-1 bg-white">
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
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    className="relative"
                    onPress={() => {
                      setStartIndex(index);
                      setLightBoxVisible(true);
                    }}>
                    <AWSImage
                      contentFit="cover"
                      placeholderContentFit="cover"
                      style={{ width: deviceWidth, height: '100%' }}
                      src={item}
                      fitin={true}
                      size="800x800"
                    />
                    {property.agent_icon && owner.logo && (
                      <View className="absolute bottom-4 right-3 z-10">
                        <AWSImage
                          contentFit="cover"
                          placeholderContentFit="cover"
                          src={owner.logo}
                          size="300x300"
                          debug
                          style={{ width: 80, height: 80, opacity: 0.7 }}
                        />
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
            <View className="absolute left-4 top-4">
              <TouchableWithoutFeedback
                onPress={() => {
                  router.back();
                }}>
                <ArrowLeftIcon size={24} color="white" weight="bold" />
              </TouchableWithoutFeedback>
            </View>
            <View className="absolute right-4 top-4 z-10 flex-row gap-3">
              <TouchableWithoutFeedback
                onPress={async () => {
                  const result = await Share.share({
                    message: `Hi! I found this property. Enjoy reviewing its features on OikoTeck.\nhttps://www.oikoteck.com/property/${property.objectId}`,
                  });
                  console.log(Share, result);
                }}>
                <ShareFatIcon color="#fff" duotoneColor={'#000'} weight="duotone" size={30} />
              </TouchableWithoutFeedback>
              <FavButton property={property} property_id={property.objectId} size={30} />
            </View>
            <View className="absolute bottom-2 left-0 right-0 flex-row items-center justify-center">
              {property.images.map((_, index) => {
                return <Dot key={index} index={index} progress={progress} />;
              })}
            </View>
          </View>
          <View className="mt-5 p-4">
            <View className="flex-row items-baseline ">
              <AppText className="font-bold text-2xl text-secondary">
                € {thoasandseprator(property.price)}
              </AppText>
              {property.listing_for === 'Rental' && (
                <AppText className="font-medium text-[15px] text-[#8D95A5]">/Month</AppText>
              )}
            </View>
            <AppText className="mt-5 font-bold text-xl text-primary">{property.title}</AppText>
            <View className="mt-4 flex-row items-center">
              <GlobeHemisphereWestIcon
                color={tailwind.theme.colors.primary}
                duotoneColor={tailwind.theme.colors.primary}
                duotoneOpacity={0.9}
                weight="duotone"
              />
              <AppText className="ml-2 font-medium text-sm text-primary">
                {stringify_area_district({
                  district: property.district,
                  area_1: property.area_1,
                  area_2: property.area_2,
                })}
              </AppText>
            </View>
            {property.reference_number && (
              <View className="mt-5 flex-row items-center">
                <SquaresFourIcon color={tailwind.theme.colors.primary} />
                <AppText className="ml-2 font-medium text-sm text-primary">
                  {property.reference_number}
                </AppText>
              </View>
            )}

            <View className="mt-4" />
            {property.exact_location && (
              <>
                <View className="mt-2" />
                <View className="flex-col rounded-2xl bg-[#f4f4f6] p-3 text-primary">
                  <AppText>Street Address</AppText>
                  <View className="mt-2 flex-row items-center gap-2">
                    <MapPinIcon size={20} />
                    <AppText className="font-medium text-[15px]">{property.address}</AppText>
                  </View>
                </View>
              </>
            )}
            <View className="mt-2" />
            <Grid cols={2} gap={2}>
              {details.map((i, j) => {
                return (
                  <View
                    key={i.heading}
                    className={cn('flex-col rounded-2xl bg-[#f4f4f6] p-3 text-primary')}>
                    <AppText>{i.heading}</AppText>
                    <View className="mt-2 flex-row items-center gap-2">
                      {i.icon}
                      <AppText className="font-medium text-[15px]">{i.detail}</AppText>
                    </View>
                  </View>
                );
              })}
            </Grid>
            <View className="mt-10" />
            <AppText className="text-base">{property.description}</AppText>
            <View className="mt-12" />
            <View className="flex-col gap-3">
              <AppText className="font-semibold text-2xl">Home Details</AppText>
              {property.special_feature.map((i) => (
                <AppText key={i}>• {i}</AppText>
              ))}
              <AppText>
                • {property.listing_for === 'Rental' ? 'Earliest Move-in' : 'Earliest Sale'} :{' '}
                {property.move_in_date instanceof Date
                  ? DateTime.fromJSDate(property.move_in_date).toLocaleString(DateTime.DATE_SHORT, {
                      locale: 'en-GB',
                    })
                  : DateTime.fromISO(property.move_in_date.iso).toLocaleString(
                      DateTime.DATE_SHORT,
                      {
                        locale: 'en-GB',
                      }
                    )}
              </AppText>
              {!!property?.heating && property?.heating !== 'None' && (
                <AppText>• {property?.heating}</AppText>
              )}
              {!!property.heating_expense && (
                <AppText>• Heating expenses : € {property.heating_expense}</AppText>
              )}
              {!!property.energy_class && <AppText>• Energy : {property.energy_class}</AppText>}
              {!!property.construction_year && (
                <AppText>• Construction year : {property.construction_year || ''}</AppText>
              )}
              {!!property.floor && <AppText>• Floor : {property.floor || ''}</AppText>}
              {!!property.property_oriantation && (
                <AppText>• Orientation : {property.property_oriantation || ''} </AppText>
              )}
              {!!property.plot_size && (
                <AppText>• Plot Size : {property.plot_size || ''} m²</AppText>
              )}
            </View>
            <View className="mt-12" />
            <View className="flex-col gap-3">
              <AppText className="font-semibold text-2xl">Payment Methods</AppText>
              <AppText>
                •{' '}
                {property.payment_frequency === 1
                  ? 'Monthly Payments'
                  : `Payment every ${property.payment_frequency} Months`}
              </AppText>
              <AppText>
                • {property.deposit}-{property.deposit === 1 ? 'Month' : 'Months'} Security Deposit
              </AppText>
            </View>
            <View className="mt-12" />
            <View className="flex-col gap-1">
              <AppText className="mb-4 font-semibold text-2xl">Neighborhood Overview</AppText>
              <View className="h-96">
                <MapView
                  provider={PROVIDER_GOOGLE}
                  region={{
                    latitude: property.marker.latitude,
                    longitude: property.marker.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  style={{ flex: 1 }}>
                  {property.exact_location ? (
                    <Marker
                      coordinate={{
                        latitude: property.marker.latitude,
                        longitude: property.marker.longitude,
                      }}
                      pinColor={tailwind.theme.colors.secondary}
                    />
                  ) : (
                    <Circle
                      center={{
                        latitude: property.marker.latitude,
                        longitude: property.marker.longitude,
                      }}
                      radius={700}
                      strokeWidth={2}
                      strokeColor={tailwind.theme.colors.secondary}
                      fillColor={tailwind.theme.colors.secondary + '80'}
                    />
                  )}
                </MapView>
              </View>
            </View>
          </View>
          <LinearGradient colors={['#fff', '#EEF1F7']} className="pb-1">
            <View className="mt-5" />
          </LinearGradient>
          <SimilarListing property={property} />
        </View>
      </ScrollView>
      <Grid cols={2} className="my-2 px-3 bg-white">
        <PressableView
          onPress={() => {
            setSubmitOfferVisible(true);
          }}
          className="h-12  items-center justify-center rounded-full border border-primary ">
          <View className="flex-row items-center  gap-2">
            <FileTextIcon color={tailwind.theme.colors.primary} />
            <AppText className="text-primary font-semibold text-[13px]">Submit Offer</AppText>
          </View>
        </PressableView>
        <PressableView
          onPress={() => {
            setContactOwnerVisible(true);
          }}
          className="h-12  items-center justify-center rounded-full border border-secondary bg-secondary">
          <View className="flex-row items-center gap-2">
            <ChatCircleIcon color="#fff" />
            <AppText className="text-white font-semibold text-[13px]">Contact Owner</AppText>
          </View>
        </PressableView>
      </Grid>
    </View>
  );
}

const AnimatedImage = Animated.createAnimatedComponent(AWSImage);

function ZoomableImage({ src, onSwipeDown }: { src: string; onSwipeDown?: () => void }) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value > 1 ? withSpring(1) : withSpring(2); // toggle zoom
      translateX.value = withSpring(0); // reset X when zoom toggles
    });

  // Pinch gesture (zoom)
  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) scale.value = 1;
    });

  // Pan gesture (only horizontal drag)
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      translateX.value = withDecay({ velocity: e.velocityX });
    })
    .activeOffsetY([-9999, 9999]); // disables vertical drag

  const composed = Gesture.Exclusive(doubleTap, Gesture.Simultaneous(pinch, pan));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <AnimatedImage
        contentFit="contain"
        placeholderContentFit="contain"
        // style={{ width: deviceWidth, height: '100%' }}
        src={src}
        style={[{ width: '100%', height: '100%' }, animatedStyle]}
      />
    </GestureDetector>
  );
}

type DotProps = {
  index: number;
  progress: SharedValue<number>;
  activeColor?: ColorValue;
  inactiveColor?: ColorValue;
};

function Dot({
  index,
  progress,
  activeColor = 'rgba(255,255,255,0.9)',
  inactiveColor = 'rgba(255,255,255,0.7)',
}: DotProps) {
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
      backgroundColor: isMain ? activeColor : inactiveColor,
    };
  });

  return <Animated.View key={index} style={style} className={cn('mx-1 rounded-full ')} />;
}
