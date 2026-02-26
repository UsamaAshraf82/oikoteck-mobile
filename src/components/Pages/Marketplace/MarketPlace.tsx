import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import {
  CaretDoubleUpIcon,
  FadersHorizontalIcon,
  GlobeHemisphereEastIcon,
  SortAscendingIcon,
  XIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppText from '~/components/Elements/AppText';
import AWSImage from '~/components/Elements/AWSImage';
import { stringify_area_district } from '~/lib/stringify_district_area';
import useSelect from '~/store/useSelectHelper';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import { isProperty } from '~/utils/property';
import PropertyCard from '../../Cards/PropertyCard';
import DistrictArea from '../../Sheets/District/DistrictArea';
import FilterModal, { filterType } from './FilterModal';
import { SearchView } from './SearchView';
import { HomeTopBar } from './TopBar';

const FlashList = ShopifyFlashList as any;

type Props = {
  listing_type: 'Rental' | 'Sale';
};

const limit = 40;
const topbarHeight = 150;

const district_images = [
  { district: 'Athens', image: 'district/pic1.png', url: 'Athens - Center' },
  { district: 'Thessaloniki', image: 'district/pic5.png', url: 'Thessaloniki' },
  { district: 'Cyclades', image: 'district/pic2.png', url: 'Cyclades Islands' },
  { district: 'Piraeus', image: 'district/pic3.png', url: 'Piraeus' },
  { district: 'Ionian Islands', image: 'district/pic4.png', url: 'Ioannina Prefecture' },
  { district: 'Crete', image: 'district/pic6.png', url: 'Crete' },
];

type sortType = {
  sort: string;
  sort_order: string;
};

type HeadingItem = { objectId: string; type: 'heading' };
type ListItem = Property_Type | HeadingItem;

const MarketPlace = ({ listing_type }: Props) => {
  const { openSelect } = useSelect();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTopCities, setShowTopCities] = useState(true);
  const listRef = useRef<ShopifyFlashList<any>>(null);

  const [districtModal, setDistrictModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [sort, setSort] = useState<{ sort: string; sort_order: string } | null>(null);

  const [search, setSearch] = useState<filterType>({
    area_1: null,
    area_2: null,
    district: null,
    minPrice: null,
    maxPrice: null,
    minSize: null,
    maxSize: null,
    minDate: null,
    maxDate: null,
    bedroom: null,
    furnished: null,
    bathroom: null,
    keywords: null,
    property_type: null,
    property_category: null,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['latest-properties', listing_type, { ...search, ...sort }],
    queryFn: async ({ pageParam }) => {
      try {
        const skip = (pageParam as number) * limit;
        const pro = await Parse.Cloud.run('search', {
          skip: skip,
          limit: limit,
          search: {
            ...search,
            keywords: search.keywords ? search.keywords?.split(' ') : null,
          },
          sort_order: sort?.sort_order,
          sort: sort?.sort,
          listing_type: listing_type,
        });
        return { ...pro.properties, hasmore: pro.properties.results.length === limit } as {
          count: number;
          results: Property_Type[];
          hasmore: boolean;
        };
      } catch {}
      return { count: 0, results: [], hasmore: false };
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasmore ? (lastPageParam as number) + 1 : undefined;
    },
    initialPageParam: 0,
  });

  const { data: similar } = useQuery({
    queryKey: [
      'similar-properties',
      listing_type,
      {
        ...search,
        ...sort,
      },
    ],
    enabled: data?.pages[data.pages.length - 1].hasmore === false,
    staleTime: 600000,
    queryFn: async () => {
      try {
        const pro = await Parse.Cloud.run('similar', {
          limit: limit * 5,
          search: {
            search: {
              ...search,
              keywords: search.keywords ? search.keywords?.split(' ') : null,
            },
          },
          sort_order: sort?.sort_order,
          sort: sort?.sort,
          listing_type: listing_type,
        });

        return pro.properties as { count: number; results: Property_Type[] };
      } catch {}

      return { count: 0, results: [] };
    },
  });

  const changeSearch = (filter: Partial<filterType>) => {
    setSearch((i) => ({ ...i, ...filter }));
  };

  const properties: ListItem[] = useMemo(() => {
    const main = data?.pages.flatMap((page) => page.results) ?? [];
    if (similar?.results?.length) {
      return [
        { objectId: 'main-heading', type: 'heading' as const },
        ...main,
        { objectId: 'similar-heading', type: 'heading' as const },
        ...similar.results,
      ];
    }
    return [{ objectId: 'main-heading', type: 'heading' as const }, ...main];
  }, [data, similar]);

  const stringified_area = useMemo(
    () =>
      stringify_area_district({
        district: search.district,
        area_1: search.area_1,
        area_2: search.area_2,
      }),
    [search.district, search.area_1, search.area_2]
  );

  const hasFilters = useMemo(() => {
    return Object.keys(search).some((i) => search[i as keyof filterType] !== null);
  }, [search]);

  const sortTitle = useMemo(() => {
    if (!sort?.sort) return 'Sort';
    if (sort?.sort === 'price') {
      if (sort?.sort_order === 'asc') return 'Price: Low to High';
      return 'Price: High to Low';
    }
    if (sort?.sort === 'bedrooms') {
      if (sort?.sort_order === 'asc') return 'Bedrooms: Less to More';
      return 'Bedrooms: More to Less';
    }
    if (sort?.sort === 'bathrooms') {
      if (sort?.sort_order === 'asc') return 'Bathrooms: Less to More';
      return 'Bathrooms: More to Less';
    }
    if (sort?.sort === 'size') {
      if (sort?.sort_order === 'asc') return 'Size: Small to Large';
      return 'Size: Large to Small';
    }
    return sort?.sort;
  }, [sort?.sort, sort?.sort_order]);

  const filters = useMemo(() => {
    const filter: {
      filter: string;
      iconFirst?: boolean;
      icon: React.ReactNode;
      onPress: () => void;
    }[] = [
      {
        filter: sortTitle,
        iconFirst: true,
        icon: <SortAscendingIcon size={20} color="#192234" weight="bold" />,
        onPress: () => {
          openSelect({
            label: 'Sort by',
            hasXIcon: true,
            options: [
              { label: 'Most Recent', value: null },
              { label: 'Price: High to Low', value: { sort: 'price', sort_order: 'des' } },
              { label: 'Price: Low to High', value: { sort: 'price', sort_order: 'asc' } },
              { label: 'Bedrooms: Less to More', value: { sort: 'bedrooms', sort_order: 'asc' } },
              { label: 'Bedrooms: More to Less', value: { sort: 'bedrooms', sort_order: 'des' } },
              { label: 'Bathrooms: Less to More', value: { sort: 'bathrooms', sort_order: 'asc' } },
              { label: 'Bathrooms: More to Less', value: { sort: 'bathrooms', sort_order: 'des' } },
              { label: 'Size: Small to Large', value: { sort: 'size', sort_order: 'asc' } },
              { label: 'Size: Large to Small', value: { sort: 'size', sort_order: 'des' } },
            ],
            value: sort,
            onPress: (data: any) => {
              setSort(data.value as sortType);
            },
          });
        },
      },
      {
        filter: 'Filters',
        iconFirst: true,
        icon: <FadersHorizontalIcon size={20} color="#192234" weight="bold" />,
        onPress: () => {
          setFiltersModal(true);
        },
      },
    ];

    if (search.bedroom !== null) {
      filter.push({
        filter: 'Bedrooms: ' + search.bedroom + '+',
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ bedroom: null }),
      });
    }
    if (search.bathroom !== null) {
      filter.push({
        filter: 'Bathrooms: ' + search.bathroom + '+',
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ bathroom: null }),
      });
    }
    if (search.furnished !== null) {
      filter.push({
        filter: 'Furnished: ' + (search.furnished ? 'Yes' : 'No'),
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ furnished: null }),
      });
    }
    if (search.keywords !== null) {
      filter.push({
        filter: 'Keywords: ' + search.keywords,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ keywords: null }),
      });
    }
    if (search.minDate !== null || search.maxDate !== null) {
      let text = 'Move-in Date: ';
      if (search.minDate !== null && search.maxDate !== null) {
        text =
          text +
          DateTime.fromJSDate(search.minDate).toLocaleString(DateTime.DATE_SHORT) +
          ' - ' +
          DateTime.fromJSDate(search.maxDate).toLocaleString(DateTime.DATE_SHORT);
      } else if (search.minDate !== null) {
        text =
          text +
          DateTime.fromJSDate(search.minDate).toLocaleString(DateTime.DATE_SHORT) +
          ' - Any Time';
      } else if (search.maxDate !== null) {
        text =
          text +
          'Any Time - ' +
          DateTime.fromJSDate(search.maxDate).toLocaleString(DateTime.DATE_SHORT);
      }
      filter.push({
        filter: text,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ maxDate: null, minDate: null }),
      });
    }
    if (search.minPrice !== null || search.maxPrice !== null) {
      let text = 'Price: ';
      if (search.minPrice !== null && search.maxPrice !== null) {
        text = text + search.minPrice + ' - ' + search.maxPrice;
      } else if (search.minPrice !== null) {
        text = text + search.minPrice + ' - Any Price';
      } else {
        text = text + 'Any Price - ' + search.maxPrice;
      }
      filter.push({
        filter: text,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ maxPrice: null, minPrice: null }),
      });
    }
    if (search.minSize !== null || search.maxSize !== null) {
      let text = 'Size: ';
      if (search.minSize !== null && search.maxSize !== null) {
        text = text + search.minSize + ' - ' + search.maxSize;
      } else if (search.minSize !== null) {
        text = text + search.minSize + ' - Any Size';
      } else {
        text = text + 'Any Size - ' + search.maxSize;
      }
      filter.push({
        filter: text,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ minSize: null, maxSize: null }),
      });
    }
    if (search.property_type !== null) {
      filter.push({
        filter: 'Property Type: ' + search.property_type,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ property_type: null }),
      });
    }
    if (search.property_category !== null) {
      filter.push({
        filter: 'Property Category: ' + search.property_category,
        icon: <XIcon size={14} color="#82065e" weight="bold" />,
        onPress: () => changeSearch({ property_category: null }),
      });
    }

    return filter;
  }, [sort, search]);

  const topHeight = useSharedValue(topbarHeight);

  useEffect(() => {
    topHeight.value = withTiming(showTopCities ? topbarHeight : 0, {
      duration: 250,
    });
  }, [showTopCities]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: topHeight.value,
  }));

  console.log('properties', data?.pages?.[0]?.results);

  return (
    <View style={styles.container}>
      <View style={styles.topBarWrapper}>
        <HomeTopBar />
      </View>
      <LinearGradient colors={['#fff', '#EEF1F7']} style={styles.headerGradient}>
        <SearchView
          listing_type={listing_type}
          text={stringified_area}
          onPress={() => setDistrictModal(true)}
          onFilter={() => setFiltersModal(true)}
          onClear={() => changeSearch({ district: null, area_1: null, area_2: null })}
        />
        {hasFilters ? (
          <ScrollView
            horizontal
            key="filter"
            style={styles.filterScroll}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {filters.map((i, idx) => {
              if (i.filter === 'Sort' || i.filter === 'Filters') {
                const isFilter = i.filter === 'Filters';
                return (
                  <TouchableWithoutFeedback key={i.filter + idx} onPress={i.onPress}>
                    <View style={styles.sortFilterBadge}>
                      {i.iconFirst && i.icon}
                      <AppText style={styles.sortFilterText}>{i.filter}</AppText>
                      {!i.iconFirst && i.icon}
                      {isFilter && filters.length > 1 && (
                        <View style={styles.filterCount}>
                          <AppText style={styles.filterCountText}>{filters.length - 1}</AppText>
                        </View>
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                );
              }
              if (i.filter === sortTitle) {
                return (
                  <View key={i.filter + idx} style={styles.activeFilterBadge}>
                    <TouchableWithoutFeedback onPress={i.onPress}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
                        {i.iconFirst && <View>{i.icon}</View>}
                        <AppText style={styles.activeFilterText}>{i.filter}</AppText>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSort(null);
                      }}>
                      <View>
                        <XIcon size={14} color="#82065e" weight="bold" />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                );
              }
              return (
                <View key={i.filter + idx} style={styles.activeFilterBadge}>
                  {i.iconFirst && (
                    <TouchableWithoutFeedback onPress={i.onPress}>
                      <View>{i.icon}</View>
                    </TouchableWithoutFeedback>
                  )}
                  <AppText style={styles.activeFilterText}>{i.filter}</AppText>
                  {!i.iconFirst && (
                    <TouchableWithoutFeedback onPress={i.onPress}>
                      <View>{i.icon}</View>
                    </TouchableWithoutFeedback>
                  )}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
            {/* <AppText style={styles.exploreHeading}>Explore Popular Cities</AppText> */}
            <ScrollView
              horizontal
              key="district"
              style={styles.districtScroll}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {district_images.map((i) => (
                <Pressable
                  key={i.district}
                  android_ripple={{ color: '#E2E4E8' }}
                  style={styles.districtCard}
                  onPress={() => changeSearch({ district: i.url })}>
                  <AWSImage
                    contentFit="cover"
                    src={i.image || ''}
                    size="180x180"
                    style={styles.districtImage}
                  />
                  <AppText style={styles.districtName} numberOfLines={1}>
                    {i.district}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </LinearGradient>

      <View style={styles.listContainer}>
        <FlashList
          ref={listRef}
          data={properties}
          decelerationRate="normal"
          onScroll={(e: any) => {
            const y = e.nativeEvent.contentOffset.y;
            setShowTopCities(showTopCities ? y < 200 : y < 20);
            setShowScrollTop(y > 2500);
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={(deviceWidth - 32) / 1.2 + 14}
          keyExtractor={(item: any) => item.objectId}
          renderItem={({ item }: { item: any }) => {
            if (isProperty(item)) {
              return <PropertyCard property={item} />;
            }
            const isMain = item.objectId === 'main-heading';
            return (
              <View style={isMain ? styles.mainHeading : styles.similarHeading}>
                <AppText style={styles.headingText}>
                  {isMain
                    ? hasFilters
                      ? `We found ${data?.pages?.[0]?.count} listings matching your criteria`
                      : 'Explore all listing'
                    : 'Similar listing according to your criteria'}
                </AppText>
              </View>
            );
          }}
          onEndReached={() => {
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="large" color="#82065e" />
              </View>
            ) : (
              <View style={styles.footerSpacer} />
            )
          }
        />

        <View style={styles.floatingButtons}>
          <Pressable
            style={styles.mapButton}
            onPress={() => {


            }}>
            <GlobeHemisphereEastIcon color="#fff" weight="fill" size={18} />
            <AppText style={styles.mapButtonText}>Map</AppText>
          </Pressable>

          {showScrollTop && (
            <Pressable
              onPress={() => listRef.current?.scrollToOffset({ offset: 0, animated: true })}
              style={styles.scrollTopButton}>
              <CaretDoubleUpIcon size={22} color="white" />
            </Pressable>
          )}
        </View>
      </View>

      <DistrictArea
        visible={districtModal}
        onClose={() => setDistrictModal(false)}
        value={stringified_area}
        onPress={(data: any) => {
          setDistrictModal(false);
          changeSearch(data);
        }}
      />
      <FilterModal
        listing_type={listing_type}
        visible={filtersModal}
        onClose={() => setFiltersModal(false)}
        value={search}
        onPress={(data: any) => {
          changeSearch(data);
          setFiltersModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBarWrapper: {
    backgroundColor: 'white',
  },
  headerGradient: {
    paddingBottom: 4,
  },
  filterScroll: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 4,
  },
  sortFilterBadge: {
    position: 'relative',
    marginRight: 12,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortFilterText: {
    marginHorizontal: 8,
    fontSize: 13,
    color: '#192234',
    fontFamily: 'LufgaMedium',
  },
  filterCount: {
    position: 'absolute',
    right: -4,
    top: -4,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#82065e',
    backgroundColor: '#82065e',
  },
  filterCountText: {
    fontFamily: 'LufgaMedium',
    fontSize: 12,
    color: 'white',
  },
  activeFilterBadge: {
    marginRight: 12,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#82065e',
    backgroundColor: 'rgba(130, 6, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeFilterText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#82065e',
  },
  exploreHeading: {
    marginLeft: 16,
    marginTop: 12,
    fontFamily: 'LufgaMedium',
    fontSize: 14,
  },
  districtScroll: {
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  districtCard: {
    marginRight: 8,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    backgroundColor: 'white',
    paddingHorizontal: 4,
    paddingBottom: 4,
    paddingTop: 4,
  },
  districtImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  districtName: {
    marginHorizontal: 0,
    fontSize: 14,
    width: 90,
    textAlign: 'center',
    color: '#192234',
    // borderWidth: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#EEF1F7',
  },
  flashList: {
    width: '100%',
    flex: 1,
  },
  mainHeading: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  similarHeading: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headingText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  footerLoader: {
    paddingVertical: 16,
  },
  footerSpacer: {
    height: 16,
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    backgroundColor: '#82065e',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  mapButtonText: {
    fontFamily: 'LufgaMedium',
    fontSize: 13,
    color: 'white',
    width: 32,
  },
  scrollTopButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 999,
    backgroundColor: '#82065e',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MarketPlace;
