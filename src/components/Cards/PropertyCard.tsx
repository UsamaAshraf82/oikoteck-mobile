import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceWidth } from '~/utils/global';
import { thoasandseprator } from '~/utils/number';
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
    <View style={styles.cardWrapper}>
      <Pressable
        onPress={() => {
          router.push(`/property/${property.objectId}`);
        }}>
        <View
          style={[
            styles.cardContainer,
            {
              width: wide,
              height: height,
            },
          ]}>
          <View style={styles.contentWrapper}>
            <View style={styles.imageContainer}>
              <Carousel
                data={property.images}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                width={wide}
                style={styles.fullWidth}
                onProgressChange={(_: any, absoluteProgress: number) => {
                  progress.value = absoluteProgress;
                }}
                onConfigurePanGesture={(g: { enabled: (arg0: boolean) => any }) => {
                  'worklet';
                  g.enabled(false);
                }}
                renderItem={({ item }: { item: string }) => {
                  return (
                    <View style={styles.relative}>
                      <AWSImage
                        contentFit="cover"
                        placeholderContentFit="cover"
                        style={{ width: wide, height: '100%' }}
                        src={item}
                        size="800x800"
                      />
                      {property.agent_icon && owner.logo && (
                        <View style={styles.agentLogoWrapper}>
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
              <View style={styles.dotsWrapper}>
                {property.images.map((_: any, index: number) => {
                  return <Dot key={index} index={index} progress={progress} />;
                })}
              </View>

              {property.plan !== 'Free' && (
                <View
                  style={[
                    styles.badge,
                    property.plan === 'Gold' && styles.bgGold,
                    property.plan === 'Promote' && styles.bgPromote,
                    property.plan === 'Promote +' && styles.bgPromotePlus,
                    property.plan === 'Platinum' && styles.bgPlatinum,
                  ]}>
                  <AppText style={styles.badgeText}>{property.plan}</AppText>
                </View>
              )}
              <View style={styles.favButtonWrapper}>
                <FavButton property_id={property.objectId} property={property} />
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.rowBetween}>
                <View style={styles.rowBaseline}>
                  <AppText style={styles.priceText}>
                    {'€ ' + thoasandseprator(property.price)}
                  </AppText>
                  {property.listing_for !== 'Sale' && (
                    <AppText style={styles.perMonthText}> / Month</AppText>
                  )}
                </View>
              </View>
              <View style={styles.rowBetween}>
                <AppText style={styles.titleText}>{property.title}</AppText>
              </View>
              <AppText style={styles.locationText}>
                {stringify_area_district({
                  district: property.district,
                  area_1: property.area_1,
                  area_2: property.area_2,
                })}
              </AppText>
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <BedIcon height={17} width={17} color="#7D7D7D" />
                  <AppText style={styles.featureText}>{property.bedrooms} beds</AppText>
                </View>
                <View style={styles.featureItem}>
                  <BathIcon height={17} width={17} color="#7D7D7D" />
                  <AppText style={styles.featureText}>{property.bathrooms} baths</AppText>
                </View>
                <View style={styles.featureItem}>
                  <SizeIcon height={18} width={18} color="#7D7D7D" />
                  <AppText style={styles.featureText}>{property.size} m²</AppText>
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
  const animatedStyle = useAnimatedStyle(() => {
    const selectedIndex = Math.round(progress.value);

    const isMain = selectedIndex === index;
    const isNear = selectedIndex === index + 1 || selectedIndex === index - 1;
    const isFar = selectedIndex === index + 2 || selectedIndex === index - 2;

    return {
      display: isMain || isNear || isFar ? 'flex' : 'none',
      opacity: isMain || isNear || isFar ? 1 : 0,
      width: isMain ? 8 : isNear ? 6 : isFar ? 4 : 0,
      height: isMain ? 8 : isNear ? 6 : isFar ? 4 : 0,
      backgroundColor: isMain ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
    };
  });

  return <Animated.View key={index} style={[animatedStyle, styles.dotBase]} />;
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: 'relative',
    marginBottom: 14,
    marginLeft: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: 'white',
    padding: 12,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 16,
  },
  fullWidth: {
    width: '100%',
  },
  relative: {
    position: 'relative',
  },
  agentLogoWrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    zIndex: 10,
    transform: [{ translateX: -35 }, { translateY: -35 }],
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
  badge: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bgGold: { backgroundColor: '#e6c623' },
  bgPromote: { backgroundColor: '#5412a1' },
  bgPromotePlus: { backgroundColor: '#398be9' },
  bgPlatinum: { backgroundColor: '#ff9c46' },
  badgeText: {
    fontSize: 12,
    color: 'white',
  },
  favButtonWrapper: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 10,
  },
  detailsContainer: {
    marginTop: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 17,
    color: '#82065e',
  },
  perMonthText: {
    fontFamily: 'LufgaMedium',
    fontSize: 15,
    color: '#7D7D7D',
  },
  titleText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 15,
    color: '#192234',
  },
  locationText: {
    fontSize: 14,
    color: '#75758A',
  },
  featuresContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  featureItem: {
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 4,
    marginRight: 0,
    fontSize: 14,
    color: '#7D7D7D',
  },
  dotBase: {
    marginHorizontal: 4,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
