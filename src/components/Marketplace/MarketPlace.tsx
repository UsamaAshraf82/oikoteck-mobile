import pic1 from '@/assets/district/pic1.png';
import pic2 from '@/assets/district/pic2.png';
import pic3 from '@/assets/district/pic3.png';
import pic4 from '@/assets/district/pic4.png';
import pic5 from '@/assets/district/pic5.png';
import pic6 from '@/assets/district/pic6.png';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Parse from 'parse/react-native';
import { FadersHorizontalIcon, SortAscendingIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import PropertyCard from '../Cards/PropertyCard';
import DistrictArea from '../Sheets/District/DistrictArea';
import FilterModal, { filterType } from './FilterModal';
import { SearchView } from './SearchView';
import { HomeTopBar } from './TopBar';

type Props = {
  listing_type: 'Rental' | 'Sale';
};



const limit = 40;

const district_images = [
  { district: 'Athens', image: pic1, url: 'Athens - Center' },
  { district: 'Cyclades', image: pic2, url: 'Cyclades Islands' },
  { district: 'Piraeus', image: pic3, url: 'Piraeus' },
  { district: 'Ionian Islands', image: pic4, url: 'Ioannina Prefecture' },
  { district: 'Thessaloniki', image: pic5, url: 'Thessaloniki' },
  { district: 'Crete', image: pic6, url: 'Crete' },
];

const MarketPlace = ({ listing_type }: Props) => {
  // const params = useLocalSearchParams<filterType>();

  const [districtModal, setDistrictModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);

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
    queryKey: [
      'latest-properties',
      listing_type,
      {
        // skip,
        ...search,
      },
    ],
    queryFn: async ({ pageParam }) => {
      try {
        const skip = pageParam * limit;

        // if (mapView) {
        //   if (!(ne_lat || ne_lng || sw_lat || sw_lng))
        //     return { count: 0, results: [] };

        //   const pro = await Parse.Cloud.run('search-map', {
        //     // skip: skip,
        //     limit: 300,
        //     search: {
        //       district: district,
        //       area_2: area_2,
        //       area_1: area_1,
        //       minPrice: minPrice,
        //       maxPrice: maxPrice,
        //       minSize: minSize,
        //       maxSize: maxSize,
        //       minDate: minDate,
        //       maxDate: maxDate,
        //       bedroom: bedroom,
        //       furnished: furnished,
        //       bathroom: bathroom,
        //       keywords: keywords ? keywords?.split(' ') : null,
        //       property_type: property_type,
        //       property_category: property_category,
        //       ne_lat: parseFloat(ne_lat!),
        //       ne_lng: parseFloat(ne_lng!),
        //       sw_lat: parseFloat(sw_lat!),
        //       sw_lng: parseFloat(sw_lng!),
        //     },

        //     listing_type: listing_type,
        //   });

        //   return pro.properties as { count: number; results: Property_Type[] };
        // }

        const pro = await Parse.Cloud.run('search', {
          skip: skip,
          limit: limit,
          search: {
            ...search,
            keywords: search.keywords ? search.keywords?.split(' ') : null,
          },
          // sort_order: sort_order,
          // sort: sort,
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
    // staleTime: Infinity, // always "fresh"
    // cacheTime: Infinity,   // never garbage collected
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const changeSearch = (filter: Partial<filterType>) => {
    setSearch((i) => ({ ...i, ...filter }));
  };
  const properties = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);
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

  const filters = useMemo(
    () => [
      { filter: 'Sort', icon: <SortAscendingIcon size={20} />, onPress: () => {} },
      { filter: 'Filter', icon: <FadersHorizontalIcon size={20} />, onPress: () => {} },
    ],

    []
  );

  return (
    <View className="flex-1 bg-white ">
      <View className="bg-white">
        <HomeTopBar
          openFilters={() => {
            setFiltersModal(true);
          }}
        />
      </View>

      <LinearGradient colors={['#fff', '#EEF1F7']} className="pb-1">
        <SearchView
          listing_type={listing_type}
          text={stringified_area}
          onPress={() => {
            setDistrictModal(true);
          }}
          onClear={() => {
            changeSearch({ district: null, area_1: null, area_2: null });
          }}
        />
        {hasFilters ? (
          <ScrollView horizontal className="mx-4  py-1">
            {filters.map((i) => (
              <TouchableWithoutFeedback key={i.filter} onPress={i.onPress}>
                <View className="mr-2 h-10 flex-1 flex-row items-center justify-center rounded-2xl border border-[#E2E4E8] bg-white  px-3 py-2 ">
                  {i.icon}
                  <Text className="mx-2 bg-white text-sm text-primary">{i.filter}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        ) : (
          <ScrollView horizontal className="mx-4 py-2">
            {district_images.map((i) => (
              <TouchableWithoutFeedback
                key={i.district}
                onPress={() => changeSearch({ district: i.district })}>
                <View className="mr-2  flex-1 flex-row items-center justify-center rounded-2xl border border-[#E2E4E8] bg-white px-1  py-2 ">
                  <Image
                    contentFit="cover"
                    source={i.image}
                    style={{ width: 70, height: 50, borderRadius: 16 }}
                  />

                  <Text className="mx-2">{i.district}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        )}
      </LinearGradient>
      <View className="flex-1 bg-[#EEF1F7]">
        <FlashList
          className="w-full flex-1"
          data={properties}
          decelerationRate={'fast'}
          estimatedItemSize={(deviceWidth - 16 * 2) / 1.4 + 8} // ✅ improves performance
          keyExtractor={(item) => item.objectId}
          renderItem={({ item }) => {
            return <PropertyCard property={item} />;
          }}
          onEndReached={() => {
            if (!isFetchingNextPage && hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <View className="py-4" />
            )
          }
        />
      </View>

      {/* <Text className="text-2xl">{listing_type}</Text> */}

      <DistrictArea
        visible={districtModal}
        onClose={() => {
          setDistrictModal(false);
        }}
        value={stringified_area}
        onPress={(data) => {
          setDistrictModal(false);
          changeSearch(data);
        }}
      />
      <FilterModal
      listing_type={listing_type}
        visible={filtersModal}
        onClose={() => {
          setFiltersModal(false);
        }}
        value={search}
        onPress={(data) => {
          changeSearch(data);
          setFiltersModal(false);
        }}
      />

      {/* <BottomSheetModal
        index={0}
        enablePanDownToClose
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{ display: 'none' }}
        backgroundStyle={{ borderRadius: 0 }}
        snapPoints={[height]}>
        <BottomSheetView className="flex-1 items-center p-12" style={{ height: height }}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal> */}
    </View>
  );
};
export default MarketPlace;
