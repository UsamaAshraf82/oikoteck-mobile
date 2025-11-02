import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import { FadersHorizontalIcon, SortAscendingIcon, XCircleIcon } from 'phosphor-react-native';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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

type Props = {
  listing_type: 'Rental' | 'Sale';
};

const limit = 40;

const district_images = [
  { district: 'Athens', image: 'district/pic1.png', url: 'Athens - Center' },
  { district: 'Cyclades', image: 'district/pic2.png', url: 'Cyclades Islands' },
  { district: 'Piraeus', image: 'district/pic3.png', url: 'Piraeus' },
  { district: 'Ionian Islands', image: 'district/pic4.png', url: 'Ioannina Prefecture' },
  { district: 'Thessaloniki', image: 'district/pic5.png', url: 'Thessaloniki' },
  { district: 'Crete', image:  'district/pic6.png', url: 'Crete' },
];

type sortType = {
  sort: string;
  sort_order: string;
};

type HeadingItem = { objectId: string; type: 'heading' };
type ListItem = Property_Type | HeadingItem;

const MarketPlace = ({ listing_type }: Props) => {
  // const params = useLocalSearchParams<filterType>();
  const { openSelect } = useSelect();

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
        const skip = pageParam * limit;
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
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
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
    queryFn: async ({ meta }) => {
      try {
        const pro = await Parse.Cloud.run('similar', {
          // skip: skip,
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
    if (!hasNextPage && similar?.results?.length) {
      // inject a "marker" item so we can show heading before similar listings
      return [
        ...main,
        { objectId: 'similar-heading', type: 'heading' as const },
        ...similar.results,
      ];
    }
    return main;
  }, [data, hasNextPage, similar]);

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

  const filters = useMemo(() => {
    const filter: {
      filter: string;
      iconFirst?: boolean;
      icon: React.JSX.Element;
      onPress: () => void;
    }[] = [
      {
        filter: 'Sort',
        iconFirst: true,
        icon: <SortAscendingIcon size={20} />,
        onPress: () => {
          openSelect({
            label: 'Sort by',
            options: [
              {
                label: 'Most Recent',
                value: null,
              },
              {
                label: 'Price: High to Low',
                value: { sort: 'price', sort_order: 'des' },
              },
              {
                label: 'Price: Low to High',
                value: { sort: 'price', sort_order: 'asc' },
              },
              {
                label: 'Bedrooms: Less to More',
                value: { sort: 'bedrooms', sort_order: 'asc' },
              },
              {
                label: 'Bedrooms: More to Less',
                value: { sort: 'bedrooms', sort_order: 'des' },
              },
              {
                label: 'Bathrooms: Less to More',
                value: { sort: 'bathrooms', sort_order: 'asc' },
              },
              {
                label: 'Bathrooms: More to Less',
                value: { sort: 'bathrooms', sort_order: 'des' },
              },
              {
                label: 'Size: Small to Large',
                value: { sort: 'size', sort_order: 'asc' },
              },
              {
                label: 'Size: Large to Small',
                value: { sort: 'size', sort_order: 'des' },
              },
            ],
            value: sort,
            onPress: (data) => {
              setSort(data.value as sortType);
            },
          });
        },
      },
      {
        filter: 'Filter',
        iconFirst: true,
        icon: <FadersHorizontalIcon size={20} />,
        onPress: () => {
          setFiltersModal(true);
        },
      },
    ];

    if (search.bedroom !== null) {
      filter.push({
        filter: 'Bedrooms: ' + search.bedroom + '+',
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ bedroom: null });
        },
      });
    }
    if (search.bathroom !== null) {
      filter.push({
        filter: 'Bathrooms: ' + search.bathroom + '+',
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ bathroom: null });
        },
      });
    }
    if (search.furnished !== null) {
      filter.push({
        filter: 'Furnished: ' + (search.furnished ? 'Yes' : 'No'),
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ bathroom: null });
        },
      });
    }
    if (search.keywords !== null) {
      filter.push({
        filter: 'Keywords: ' + search.keywords,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ bathroom: null });
        },
      });
    }
    if (search.minDate !== null || search.maxDate !== null) {
      let text = 'Move-in Date: ';
      if (search.minDate !== null && search.maxDate !== null) {
        text =
          'Move-in Date: ' +
          DateTime.fromJSDate(search.minDate).toLocaleString(DateTime.DATE_SHORT) +
          ' - ' +
          DateTime.fromJSDate(search.maxDate).toLocaleString(DateTime.DATE_SHORT);
      }

      if (search.minDate !== null && search.maxDate === null) {
        text =
          'Move-in Date: ' +
          DateTime.fromJSDate(search.minDate).toLocaleString(DateTime.DATE_SHORT) +
          ' - ' +
          'Any Time';
      }
      if (search.minDate === null && search.maxDate !== null) {
        text =
          'Move-in Date: ' +
          'Any Time' +
          ' - ' +
          DateTime.fromJSDate(search.maxDate).toLocaleString(DateTime.DATE_SHORT);
      }

      filter.push({
        filter: text,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ maxDate: null, minDate: null });
        },
      });
    }
    if (search.minPrice !== null || search.maxPrice !== null) {
      let text = 'Price: ';
      if (search.minPrice !== null && search.maxPrice !== null) {
        text = 'Price: ' + search.minPrice + ' - ' + search.maxPrice;
      }

      if (search.minPrice !== null && search.maxPrice === null) {
        text = 'Price: ' + search.minPrice + ' - ' + 'Any Price';
      }
      if (search.minPrice === null && search.maxPrice !== null) {
        text = 'Price: ' + 'Any Price' + ' - ' + search.maxPrice;
      }

      filter.push({
        filter: text,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ maxPrice: null, minPrice: null });
        },
      });
    }
    if (search.minSize !== null || search.maxSize !== null) {
      let text = 'Size: ';
      if (search.minSize !== null && search.maxSize !== null) {
        text = 'Size: ' + search.minSize + ' - ' + search.maxSize;
      }

      if (search.minSize !== null && search.maxSize === null) {
        text = 'Size: ' + search.minSize + ' - ' + 'Any Size';
      }
      if (search.minSize === null && search.maxSize !== null) {
        text = 'Size: ' + 'Any Size' + ' - ' + search.maxSize;
      }

      filter.push({
        filter: text,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ minSize: null, maxSize: null });
        },
      });
    }
    if (search.property_type !== null) {
      filter.push({
        filter: 'Property Type: ' + search.property_type,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ property_type: null });
        },
      });
    }
    if (search.property_category !== null) {
      filter.push({
        filter: 'Property Category: ' + search.property_category,
        icon: <XCircleIcon size={20} />,
        onPress: () => {
          changeSearch({ property_category: null });
        },
      });
    }

    // Object.keys(search).forEach((i) => {
    //   if (search[i as keyof filterType] !== null) {
    //     filter.push({
    //       filter: i + ': ' + search[i as keyof filterType],
    //       icon: <XCircleIcon size={20} />,
    //       onPress: () => {
    //         changeSearch({ [i]: null });
    //       },
    //     });
    //   }
    // })

    return filter;
  }, [sort, search]);

  return (
    <View className="flex-1 bg-white ">
      <View className="bg-white">
        <HomeTopBar />
      </View>
      <LinearGradient colors={['#fff', '#EEF1F7']} className="pb-1">
        <SearchView
          listing_type={listing_type}
          text={stringified_area}
          onPress={() => {
            setDistrictModal(true);
          }}
          onFilter={() => {
            setFiltersModal(true);
          }}
          onClear={() => {
            changeSearch({ district: null, area_1: null, area_2: null });
          }}
        />
        {hasFilters ? (
          <ScrollView horizontal key="filter" className="mx-4  py-1" showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {filters.map((i) => (
              <TouchableWithoutFeedback key={i.filter} onPress={i.onPress}>
                <View className="mr-2 h-10 flex-1 flex-row items-center justify-center rounded-2xl border border-[#E2E4E8] bg-white  px-3 py-2 ">
                  {i.iconFirst ? i.icon : null}
                  <AppText className="mx-2 bg-white text-sm text-primary">{i.filter}</AppText>
                  {i.iconFirst ? null : i.icon}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            horizontal
            key="district"
            className="mx-4 py-2"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            {district_images.map((i) => (
              <Pressable
                key={i.district}
                shouldRasterizeIOS
                android_ripple={{ color: '#E2E4E8' }}
                className="mr-2 flex-1  flex-col items-center  justify-center gap-2 rounded-2xl border border-[#E2E4E8] bg-white px-1  pb-2 pt-1 active:bg-black/20 "
                onPress={() => changeSearch({ district: i.url })}>
                <AWSImage
                  contentFit="cover"
                  src={i.image || ''}
                  size='180x180'
                  style={{ width: 90, height: 90, borderRadius: 13 }}
                />

                <AppText className="mx-2">{i.district}</AppText>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </LinearGradient>
      <View className="flex-1 bg-[#EEF1F7]">
        <FlashList
          className="w-full flex-1"
          data={properties}
          decelerationRate={'fast'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={(deviceWidth - 16 * 2) / 1.4 + 8} // ✅ improves performance
          keyExtractor={(item) => item.objectId}
          renderItem={({ item }) => {
            if (isProperty(item)) {
              return <PropertyCard property={item} />;
            }
            return (
              <View className="px-4 py-6">
                <AppText className="font-semibold text-lg text-gray-800">
                  Similar Listings According to Your Criteria
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
              <View className="py-4">
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <View className="py-4" />
            )
          }
        />
      </View>
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
    </View>
  );
};
export default MarketPlace;
