import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ChatCircleIcon,
  CouchIcon,
  FileTextIcon,
  GlobeHemisphereWestIcon,
  HouseLineIcon,
  MapPinIcon,
  SquaresFourIcon,
  StairsIcon,
  XIcon,
} from 'phosphor-react-native';
import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
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
import { deviceHeight, deviceWidth } from '~/utils/global';
import tailwind from '~/utils/tailwind';
import ContactOwner from './ContactOwner';
import SubmitOffer from './SubmitOffer';
export default function PropertyDetails({ property }: { property: Property_Type }) {
  const router = useRouter();
  const progress = useSharedValue(0);
  const [lightBoxVisible, setLightBoxVisible] = useState(false);
  const [contactOwnerVisible, setContactOwnerVisible] = useState(false);
  const [SubmitOfferVisible, setSubmitOfferVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);

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
              renderItem={({ item }) => {

                return <ZoomableImage src={item} />;
              }}
            />

            {/* Close button */}
            <TouchableOpacity
              className="absolute right-5 top-5"
              // style={{ position: 'absolute', top: 40, right: 20, padding: 10 }}
              onPress={() => setLightBoxVisible(false)}>
              <XIcon size={20} color="white" />
            </TouchableOpacity>
            <View className="absolute bottom-2 left-0 right-0 h-24 flex-row justify-center">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 4 }}>
                {property.images.map((item, index) => {

                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        carouselRef.current?.scrollTo({ index, animated: true });
                      }}
                      style={{ marginHorizontal: 4 }}>
                      <AWSImage
                        contentFit="contain" // keep aspect ratio
                        placeholderContentFit="contain"
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 6,
                        }}
                        size='800x800'
                        src={item}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </GestureHandlerRootView>
        </Modal>
      </View>
      <ScrollView>
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
                      size='800x800'
                      // placeholder={lazy}
                    />
                  </Pressable>
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
              <AppText className="text-2xl font-bold text-secondary" >€ {property.price}</AppText>
              {property.listing_for === 'Rental' && (
                <AppText className="text-sm font-medium text-[#8D95A5]" >/Month</AppText>
              )}
            </View>
            <AppText className="mt-2 text-xl font-bold text-primary" >{property.title}</AppText>
            <View className="mt-3 flex-row items-center">
              <GlobeHemisphereWestIcon
                color={tailwind.theme.colors.primary}
                duotoneColor={tailwind.theme.colors.primary}
                duotoneOpacity={0.9}
                weight="duotone"
              />
              <AppText className="ml-2 text-sm font-medium text-primary">
                {stringify_area_district({
                  district: property.district,
                  area_1: property.area_1,
                  area_2: property.area_2,
                })}
              </AppText>
            </View>
            {property.reference_number && (
              <View className="mt-3 flex-row items-center">
                <SquaresFourIcon color={tailwind.theme.colors.primary} />
                <AppText className="ml-2 text-sm font-medium text-primary">
                  {property.reference_number}
                </AppText>
              </View>
            )}
            {property.exact_location && (
              <>
                <View className="mt-2" />
                <View className="flex-col rounded-2xl bg-[#f4f4f6] p-3 text-primary">
                  <AppText>Street Address</AppText>
                  <View className="mt-2 flex-row items-center gap-2">
                    <MapPinIcon size={20} />
                    <AppText className="text-[15px] font-medium" >{property.address}</AppText>
                  </View>
                </View>
              </>
            )}
            <View className="mt-2" />
            <Grid cols={2} gap={2}>
              {[
                {
                  icon:
                    property.property_type === 'Commercial' ? (
                      <BedIcon width={18} height={18} />
                    ) : (
                      <BedIcon width={18} height={18} />
                    ),
                  heading: 'Bedrooms',
                  className: '',
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
                {
                  heading: 'Floor No',
                  icon: <StairsIcon size={20} />,
                  className: property.property_type === 'Land' ? 'hidden' : '',
                  detail: property.floor === 0 ? 'Ground' : property.floor,
                },
                {
                  heading: 'Listing Date',
                  icon: <CalendarIcon size={20} />,
                  detail: new Date(property.createdAt).toLocaleDateString('en-GB'),
                },
                {
                  heading: 'Furnished',
                  icon: <CouchIcon size={20} />,
                  detail: property.furnished ? 'Yes' : 'No',
                },
              ].map((i, j) => (
                <View
                  key={i.heading}
                  className={cn('flex-col rounded-2xl bg-[#f4f4f6] p-3 text-primary', i.className)}>
                  <AppText>{i.heading}</AppText>
                  <View className="mt-2 flex-row items-center gap-2">
                    {i.icon}
                    <AppText className="text-[15px] font-medium" >{i.detail}</AppText>
                  </View>
                </View>
              ))}
            </Grid>
            <View className="mt-4" />
            <AppText className="text-base" >{property.description}</AppText>
            <View className="mt-5" />
            <View className="flex-col gap-3">
              <AppText className="text-2xl font-semibold" >Home Details</AppText>
              {property.special_feature.map((i) => (
                <AppText key={i} >• {i}</AppText>
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
              {!!property.plot_size && <AppText>• Plot Size : {property.plot_size || ''} m²</AppText>}
            </View>
            <View className="mt-5" />
            <View className="flex-col gap-3">
              <AppText className="text-2xl font-semibold" >Payment Methods</AppText>
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
            <View className="mt-5" />
            <View className="flex-col gap-1">
              <AppText className="mb-4 text-2xl font-semibold" >Neighborhood Overview</AppText>
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
      <Grid cols={2} className='my-2 px-3' >
        <PressableView
          onPress={() => {
            setSubmitOfferVisible(true);
          }}
          className="h-12  items-center justify-center rounded-full border border-primary ">
          <View className="flex-row items-center  gap-2">
            <FileTextIcon color={tailwind.theme.colors.primary} />
            <AppText className="text-primary" >Submit Offer</AppText>
          </View>
        </PressableView>
        <PressableView
          onPress={() => {
            setContactOwnerVisible(true);
          }}
          className="h-12  items-center justify-center rounded-full border border-secondary bg-secondary">
          <View className="flex-row items-center gap-2">
            <ChatCircleIcon color="#fff" />
            <AppText className="text-white" >Contact Owner</AppText>
          </View>
        </PressableView>
      </Grid>
    </View>
  );
}

function Dot({ index, progress }: { index: number; progress: SharedValue<number> }) {
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

const AnimatedImage = Animated.createAnimatedComponent(AWSImage);

function ZoomableImage({
  src,
  onSwipeDown,
}: {
  src:string
  onSwipeDown?: () => void;
}) {
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
