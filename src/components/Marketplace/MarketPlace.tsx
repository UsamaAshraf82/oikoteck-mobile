// import { View } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import Parse from 'parse/react-native';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import PropertyCard from '../Cards/PropertyCard';
import DistrictArea from '../Sheets/District/DistrictArea';
import { SearchView } from './SearchView';
import { HomeTopBar } from './TopBar';
type Props = {
  listing_type: 'Rental' | 'Sale';
};

type filterType = {
  district: string | null;
  area_1: string | null;
  area_2: string | null;
};

const limit = 40;

const MarketPlace = ({ listing_type }: Props) => {
  // const params = useLocalSearchParams<filterType>();

  const [districtModal,setDistrictModal] = useState(false)

  const [{ district, area_1, area_2 }, setSearch] = useState<filterType>({
    area_1: null,
    area_2: null,
    district: null,
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [
      'latest-properties',
      listing_type,
      {
        // skip,
        // pageParam,
        district,
        area_2,
        area_1,
        // minPrice,
        // maxPrice,
        // minSize,
        // maxSize,
        // minDate,
        // maxDate,
        // bedroom,
        // furnished,
        // bathroom,
        // keywords,
        // property_type,
        // property_category,
        // sort,
        // sort_order,
        // mapView,
        // ne_lat,
        // ne_lng,
        // sw_lat,
        // sw_lng,
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

        console.log(skip);

        const pro = await Parse.Cloud.run('search', {
          skip: skip,
          limit: limit,
          search: {
            district: district,
            area_2: area_2,
            area_1: area_1,
            // minPrice: minPrice,
            // maxPrice: maxPrice,
            // minSize: minSize,
            // maxSize: maxSize,
            // minDate: minDate,
            // maxDate: maxDate,
            // bedroom: bedroom,
            // furnished: furnished,
            // bathroom: bathroom,
            // keywords: keywords ? keywords?.split(' ') : null,
            // property_type: property_type,
            // property_category: property_category,
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

  console.log(data);
  const properties = useMemo(() => data?.pages.flatMap((page) => page.results) ?? [], [data]);

  return (
    <View className="flex-1 bg-white ">
      <View className="bg-white">
        <HomeTopBar />
      </View>

      <LinearGradient
        colors={['#fff', '#EEF1F7']}
        className="pb-3"
        // style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {/* <View className="mb-3 bg-white"> */}
        <SearchView
          listing_type={listing_type}
          text={stringify_area_district({ district, area_1, area_2 })}
          onPress={() => {setDistrictModal(true)
          }}
          onClear={() => {
            setSearch({ district: null, area_1: null, area_2: null });
          }}
        />
        {/* </View> */}
      </LinearGradient>
      <View className="flex-1 bg-[#EEF1F7]">
        <FlashList
          className="w-full flex-1"
          data={properties}
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
        onClose={()=>{setDistrictModal(false)}}
        value={stringify_area_district({ district, area_1, area_2 })}
        onPress={(data) => {
          changeSearch(data);
          setDistrictModal(false)
          // bottomSheetRef.current?.dismiss();
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
