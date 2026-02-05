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
    StyleSheet,
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
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceHeight, deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
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
        icon: <BedIcon width={18} height={18} />,
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
    <View style={styles.container}>
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
          <GestureHandlerRootView style={styles.lightboxBg}>
            <Carousel
              ref={carouselRef}
              data={property.images}
              loop={false}
              width={deviceWidth}
              height={deviceHeight}
              defaultIndex={startIndex}
              onProgressChange={(_: any, absoluteProgress: number) => {
                progress2.value = absoluteProgress;
              }}
              renderItem={({ item }: { item: string }) => {
                return (
                  <View style={styles.relative}>
                    <ZoomableImage src={item} />
                    {property.agent_icon && owner.logo && (
                      <View style={styles.agentLogoCenter}>
                        <AWSImage
                          contentFit="cover"
                          placeholderContentFit="cover"
                          src={owner.logo}
                          size="300x300"
                          style={styles.agentLogoImage}
                        />
                      </View>
                    )}
                  </View>
                );
              }}
            />

            {/* Close button */}
            <View style={styles.backButtonLightbox}>
              <TouchableWithoutFeedback
                hitSlop={20}
                onPress={() => {
                  setLightBoxVisible(false);
                }}>
                <ArrowLeftIcon size={24} color="white" weight="bold" />
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.headerIconsLightbox}>
              <TouchableWithoutFeedback
                onPress={async () => {
                   await Share.share({
                    message: `Hi! I found this property. Enjoy reviewing its features on OikoTeck.\nhttps://www.oikoteck.com/property/${property.objectId}`,
                  });
                }}>
                <ShareFatIcon color="#fff" weight="duotone" size={30} />
              </TouchableWithoutFeedback>
              <FavButton property={property} property_id={property.objectId} size={30} />
            </View>
            <View style={styles.dotsWrapper}>
              {property.images.map((_, index) => {
                return (
                  <Dot
                    key={index}
                    index={index}
                    progress={progress2}
                    activeColor="#82065e"
                  />
                );
              })}
            </View>
          </GestureHandlerRootView>
        </Modal>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.carouselContainer}>
            <Carousel
              data={property.images}
              loop={false}
              pagingEnabled={true}
              snapEnabled={true}
              width={deviceWidth}
              style={styles.fullSize}
              onProgressChange={(_: any, absoluteProgress: number) => {
                progress.value = absoluteProgress;
              }}
              onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                'worklet';
                g.enabled(false);
              }}
              renderItem={({ item, index }: { item: string; index: number }) => {
                return (
                  <Pressable
                    style={styles.relative}
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
                      <View style={styles.agentLogoMain}>
                        <AWSImage
                          contentFit="cover"
                          placeholderContentFit="cover"
                          src={owner.logo}
                          size="300x300"
                          style={styles.agentLogoImage80}
                        />
                      </View>
                    )}
                  </Pressable>
                );
              }}
            />
            <View style={styles.backButtonMain}>
              <TouchableWithoutFeedback
                hitSlop={20}
                onPress={() => {
                  router.back();
                }}>
                <ArrowLeftIcon size={24} color="white" weight="bold" />
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.headerIconsMain}>
              <TouchableWithoutFeedback
                onPress={async () => {
                   await Share.share({
                    message: `Hi! I found this property. Enjoy reviewing its features on OikoTeck.\nhttps://www.oikoteck.com/property/${property.objectId}`,
                  });
                }}>
                <ShareFatIcon color="#fff" weight="duotone" size={30} />
              </TouchableWithoutFeedback>
              <FavButton property={property} property_id={property.objectId} size={30} />
            </View>
            <View style={styles.dotsWrapper}>
              {property.images.map((_, index) => {
                return <Dot key={index} index={index} progress={progress} />;
              })}
            </View>
          </View>
          <View style={styles.infoWrapper}>
            <View style={styles.priceRow}>
              <AppText style={styles.priceText}>
                € {thoasandseprator(property.price)}
              </AppText>
              {property.listing_for === 'Rental' && (
                <AppText style={styles.perMonthText}>/Month</AppText>
              )}
            </View>
            <AppText style={styles.titleText}>{property.title}</AppText>
            <View style={styles.locationRow}>
              <GlobeHemisphereWestIcon
                color="#192234"
                duotoneColor="#192234"
                duotoneOpacity={0.9}
                weight="duotone"
              />
              <AppText style={styles.locationText}>
                {stringify_area_district({
                  district: property.district,
                  area_1: property.area_1,
                  area_2: property.area_2,
                })}
              </AppText>
            </View>
            {property.reference_number && (
              <View style={styles.refRow}>
                <SquaresFourIcon color="#192234" />
                <AppText style={styles.refText}>
                  {property.reference_number}
                </AppText>
              </View>
            )}

            <View style={styles.spacer16} />
            {property.exact_location && (
              <>
                <View style={styles.spacer8} />
                <View style={styles.addressCard}>
                  <AppText style={styles.cardLabel}>Street Address</AppText>
                  <View style={styles.cardInfoRow}>
                    <MapPinIcon size={20} color="#192234" />
                    <AppText style={styles.cardInfoText}>{property.address}</AppText>
                  </View>
                </View>
              </>
            )}
            <View style={styles.spacer8} />
            <Grid cols={2} gap={8}>
              {details.map((i) => {
                return (
                  <View
                    key={i.heading}
                    style={styles.detailCard}>
                    <AppText style={styles.cardLabel}>{i.heading}</AppText>
                    <View style={styles.cardInfoRow}>
                      {i.icon}
                      <AppText style={styles.cardInfoText}>{i.detail}</AppText>
                    </View>
                  </View>
                );
              })}
            </Grid>
            <View style={styles.spacer40} />
            <AppText style={styles.description}>{property.description}</AppText>
            <View style={styles.spacer48} />
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Home Details</AppText>
              {property.special_feature.map((i) => (
                <AppText key={i} style={styles.bulletItem}>• {i}</AppText>
              ))}
              <AppText style={styles.bulletItem}>
                • {property.listing_for === 'Rental' ? 'Earliest Move-in' : 'Earliest Sale'} :{' '}
                {property.move_in_date instanceof Date
                  ? DateTime.fromJSDate(property.move_in_date).toLocaleString(DateTime.DATE_SHORT, {
                      locale: 'en-GB',
                    })
                  : DateTime.fromISO((property.move_in_date as any).iso).toLocaleString(
                      DateTime.DATE_SHORT,
                      {
                        locale: 'en-GB',
                      }
                    )}
              </AppText>
              {!!property?.heating && property?.heating !== 'None' && (
                <AppText style={styles.bulletItem}>• {property?.heating}</AppText>
              )}
              {!!property.heating_expense && (
                <AppText style={styles.bulletItem}>• Heating expenses : € {property.heating_expense}</AppText>
              )}
              {!!property.energy_class && <AppText style={styles.bulletItem}>• Energy : {property.energy_class}</AppText>}
              {!!property.construction_year && (
                <AppText style={styles.bulletItem}>• Construction year : {property.construction_year || ''}</AppText>
              )}
              {!!property.floor && <AppText style={styles.bulletItem}>• Floor : {property.floor || ''}</AppText>}
              {!!property.property_oriantation && (
                <AppText style={styles.bulletItem}>• Orientation : {property.property_oriantation || ''} </AppText>
              )}
              {!!property.plot_size && (
                <AppText style={styles.bulletItem}>• Plot Size : {property.plot_size || ''} m²</AppText>
              )}
            </View>
            <View style={styles.spacer48} />
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitle}>Payment Methods</AppText>
              <AppText style={styles.bulletItem}>
                •{' '}
                {property.payment_frequency === 1
                  ? 'Monthly Payments'
                  : `Payment every ${property.payment_frequency} Months`}
              </AppText>
              <AppText style={styles.bulletItem}>
                • {property.deposit}-{property.deposit === 1 ? 'Month' : 'Months'} Security Deposit
              </AppText>
            </View>
            <View style={styles.spacer48} />
            <View style={styles.sectionHeader}>
              <AppText style={styles.sectionTitleNeighbor}>Neighborhood Overview</AppText>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  region={{
                    latitude: property.marker.latitude,
                    longitude: property.marker.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  style={styles.fullSize}>
                  {property.exact_location ? (
                    <Marker
                      coordinate={{
                        latitude: property.marker.latitude,
                        longitude: property.marker.longitude,
                      }}
                      pinColor="#82065e"
                    />
                  ) : (
                    <Circle
                      center={{
                        latitude: property.marker.latitude,
                        longitude: property.marker.longitude,
                      }}
                      radius={700}
                      strokeWidth={2}
                      strokeColor="#82065e"
                      fillColor="rgba(130, 6, 94, 0.5)"
                    />
                  )}
                </MapView>
              </View>
            </View>
          </View>
          <LinearGradient colors={['#fff', '#EEF1F7']} style={styles.bottomGradient}>
            <View style={styles.spacer20} />
          </LinearGradient>
          <SimilarListing property={property} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Grid cols={2} gap={12}>
          <PressableView
            onPress={() => {
              setSubmitOfferVisible(true);
            }}
            style={styles.offerButton}>
            <View style={styles.footerBtnInner}>
              <FileTextIcon color="#192234" />
              <AppText style={styles.offerBtnText}>Submit Offer</AppText>
            </View>
          </PressableView>
          <PressableView
            onPress={() => {
              setContactOwnerVisible(true);
            }}
            style={styles.contactButton}>
            <View style={styles.footerBtnInner}>
              <ChatCircleIcon color="#fff" />
              <AppText style={styles.contactBtnText}>Contact Owner</AppText>
            </View>
          </PressableView>
        </Grid>
      </View>
    </View>
  );
}

const AnimatedImage = Animated.createAnimatedComponent(AWSImage);

function ZoomableImage({ src }: { src: string }) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value > 1 ? withSpring(1) : withSpring(2);
      translateX.value = withSpring(0);
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) scale.value = 1;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      translateX.value = withDecay({ velocity: e.velocityX });
    })
    .activeOffsetY([-9999, 9999]);

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
        src={src}
        style={[styles.fullSize, animatedStyle]}
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

  return <Animated.View key={index} style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 40,
  },
  lightboxBg: {
    flex: 1,
    backgroundColor: 'black',
  },
  relative: {
    position: 'relative',
    flex: 1,
  },
  agentLogoCenter: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: 10,
    transform: [{ translateX: -35 }, { translateY: -35 }],
  },
  agentLogoImage: {
    width: 70,
    height: 70,
    opacity: 0.7,
  },
  agentLogoImage80: {
    width: 80,
    height: 80,
    opacity: 0.7,
  },
  backButtonLightbox: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  headerIconsLightbox: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
    flexDirection: 'row',
    gap: 12,
  },
  dotsWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselContainer: {
    position: 'relative',
    height: 380,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  agentLogoMain: {
    position: 'absolute',
    bottom: 16,
    right: 12,
    zIndex: 10,
  },
  backButtonMain: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  headerIconsMain: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 10,
    flexDirection: 'row',
    gap: 12,
  },
  infoWrapper: {
    marginTop: 20,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#82065e',
  },
  perMonthText: {
    fontFamily: 'LufgaMedium',
    fontSize: 15,
    color: '#8D95A5',
  },
  titleText: {
    marginTop: 20,
    fontFamily: 'LufgaBold',
    fontSize: 20,
    color: '#192234',
  },
  locationRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 8,
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  refRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refText: {
    marginLeft: 8,
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  spacer16: {
    marginTop: 16,
  },
  spacer8: {
    marginTop: 8,
  },
  spacer20: {
    marginTop: 20,
  },
  spacer40: {
    marginTop: 40,
  },
  spacer48: {
    marginTop: 48,
  },
  addressCard: {
    flexDirection: 'column',
    borderRadius: 16,
    backgroundColor: '#f4f4f6',
    padding: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#192234',
  },
  cardInfoRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardInfoText: {
    fontFamily: 'LufgaMedium',
    fontSize: 15,
    color: '#192234',
  },
  detailCard: {
    flexDirection: 'column',
    borderRadius: 16,
    backgroundColor: '#f4f4f6',
    padding: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#192234',
  },
  sectionHeader: {
    flexDirection: 'column',
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 24,
    color: '#192234',
  },
  sectionTitleNeighbor: {
    marginBottom: 16,
    fontFamily: 'LufgaSemiBold',
    fontSize: 24,
    color: '#192234',
  },
  bulletItem: {
    fontSize: 14,
    color: '#192234',
  },
  mapContainer: {
    height: 384,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bottomGradient: {
    paddingBottom: 4,
  },
  footer: {
    paddingHorizontal: 12,
    marginVertical: 8,
    backgroundColor: 'white',
  },
  offerButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#192234',
  },
  contactButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  footerBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  offerBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 13,
    color: '#192234',
  },
  contactBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 13,
    color: '#white',
  },
  dot: {
    marginHorizontal: 4,
    borderRadius: 999,
  },
});
