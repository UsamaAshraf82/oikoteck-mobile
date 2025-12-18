import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDebounceValue } from 'usehooks-ts';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import { cn } from '~/lib/utils';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import { isProperty } from '~/utils/property';
const limit = 50;

export type filter = {
  'min-price': string;
  'max-price': string;
  'min-size': string;
  'max-size': string;
  bedroom: string;
  furnished: string;
  bathroom: string;
  keywords: string;
  property_type: string;
  plan: string;
  visibility: boolean | null;
  property_category: string;
};

type filterType = {
  search: string;
} & filter;

const InitialFilter: filterType = {
  // status: null,
  search: '',
  'min-price': '',
  'max-price': '',
  'min-size': '',
  'max-size': '',
  bedroom: '',
  furnished: '',
  bathroom: '',
  keywords: '',
  property_type: '',
  property_category: '',
  plan: '',
  visibility: null,
};

type sortType = {
  sort: string;
  order: 'asc' | 'des';
} | null;

const Favorities = () => {
  const { user } = useUser();
  const router = useRouter();

  const [listing_for, setListingFor] = useState<'Rental' | 'Sale'>('Rental');
  const [status, setStatus] = useState<
    | 'Approved'
    | 'Deleted Permanent'
    | 'Expired'
    | 'Pending Approval'
    | 'Rejected'
    | 'Deleted'
    | null
  >(null);
  const [filter, setFilter] = useState<filterType>(InitialFilter);
  const [pageParam, setPageParam] = useState<number>(0);
  const [sort, setSort] = useState<sortType>(null);
  ``;
  const [debouncedValue] = useDebounceValue(filter, 500);
  const [debouncedSort] = useDebounceValue(sort, 500);

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      'properties',
      'user_all',
      pageParam,
      {
        limit: limit,
        user: user?.id,
        listing_for,
        ...debouncedSort,
        'min-price': debouncedValue['min-price'],
        'max-price': debouncedValue['max-price'],
        'min-size': debouncedValue['min-size'],
        'max-size': debouncedValue['max-size'],
        bedroom: debouncedValue.bedroom,
        bathroom: debouncedValue.bathroom,
        furnished: debouncedValue.furnished,
        keywords: debouncedValue.keywords,
        keywords_length: debouncedValue.keywords.length,
        property_type: debouncedValue.property_type,
        property_category: debouncedValue.property_category,
        status: status,
        search: debouncedValue.search,
        visobility: debouncedValue.visibility,
        plan: debouncedValue.plan,
        sort: debouncedSort?.sort,
        order: debouncedSort?.order,
      },
    ],
    queryFn: async ({}) => {
      const skip = pageParam * limit;

      if (!user?.id) return { count: 0, results: [], hasmore: false };

      const query = new Parse.Query('Property');
      query.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });

      if (debouncedValue['min-price']) {
        query.greaterThanOrEqualTo('price', parseInt(debouncedValue['min-price']));
      }
      if (debouncedValue['max-price']) {
        query.lessThanOrEqualTo('price', parseInt(debouncedValue['max-price']));
      }

      if (debouncedValue['min-size']) {
        query.greaterThanOrEqualTo('size', parseInt(debouncedValue['min-size']));
      }
      if (debouncedValue['max-size']) {
        query.lessThanOrEqualTo('size', parseInt(debouncedValue['max-size']));
      }
      if (debouncedValue.bedroom) {
        query.greaterThanOrEqualTo('bedrooms', parseInt(debouncedValue.bedroom));
      }
      if (debouncedValue.plan) {
        query.equalTo('plan', debouncedValue.plan);
      }
      if (debouncedValue.visibility !== null) {
        query.equalTo('visible', debouncedValue.visibility);
      }
      if (debouncedValue.bathroom) {
        query.greaterThanOrEqualTo('bathrooms', parseInt(debouncedValue.bathroom));
      }
      if (debouncedValue.furnished) {
        query.equalTo('furnished', debouncedValue.furnished === 'true' ? true : false);
      }

      if (debouncedValue.keywords && debouncedValue.keywords.length !== 0) {
        query.containsAll('keywords', debouncedValue.keywords.split(' '));
      }

      if (debouncedValue.property_type) {
        query.equalTo('property_type', debouncedValue.property_type);
      }
      if (debouncedValue.property_category) {
        query.equalTo('property_category', debouncedValue.property_category);
      }
      query.limit(limit);
      query.skip(skip);

      // if (debouncedValue.search.trim()) {
      //   const inputtrim = RegExp.escape(debouncedValue.search.trim());
      //   const replaceed = inputtrim.replace(/[ ]/gi, '.*');
      //   query.matches('title', new RegExp(`.*${replaceed}.*`), 'i');
      // }

      query.equalTo('listing_for', listing_for);
      if (status) {
        query.equalTo('status', status);
      } else {
        query.notEqualTo('status', 'Deleted Permanent');
      }
      if (debouncedSort) {
        if (debouncedSort.order === 'asc') {
          query.addAscending(debouncedSort.sort);
        } else {
          query.addDescending(debouncedSort.sort);
        }
      } else {
        switch (status) {
          case 'Approved':
            query.addDescending('approved_on');
            break;
          case 'Pending Approval':
            query.addDescending('flag_time');
            break;
          case 'Expired':
            query.addDescending('expires_on');
            break;
          case 'Deleted':
            query.addDescending('deleted_on');
            break;
          case 'Rejected':
            query.addDescending('rejected_on');
            break;
          default:
            query.addAscending('status_priority');
            query.addDescending('flag_time');
            query.addDescending('created_on');
            break;
        }
      }

      query.withCount();

      const property = (await query.find({
        json: true,
      })) as unknown as { count: number; results: Property_Type[] };

      return { ...property, hasmore: property.results.length === limit };

      // return [] as Property_Type[]
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const { data: _stats } = useQuery({
    queryKey: ['properties', 'user_all_stats', user?.id],
    queryFn: async () => {
      const activequery = new Parse.Query('Property');
      activequery.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });

      activequery.equalTo('status', 'Approved');

      const pendingquery = new Parse.Query('Property');
      pendingquery.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });

      pendingquery.equalTo('status', 'Pending Approval');

      const expiredquery = new Parse.Query('Property');
      expiredquery.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });
      expiredquery.equalTo('status', 'Expired');

      const rejectedquery = new Parse.Query('Property');
      rejectedquery.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });
      rejectedquery.equalTo('status', 'Rejected');

      const t: [number, number, number, number] = await Promise.all([
        activequery.count(),
        pendingquery.count(),
        expiredquery.count(),
        rejectedquery.count(),
      ]);

      return {
        active: t[0],
        pending: t[1],
        expired: t[2],
        rejected: t[3],
      };
    },
    initialData: {
      active: 0,
      pending: 0,
      expired: 0,
      rejected: 0,
    },
  });

  const { data: _stats_2 } = useQuery({
    queryKey: [
      'properties',
      'user_all_stats_2',
      {
        limit: limit,
        user: user?.id,
        listing_for,
        ...debouncedSort,
        'min-price': debouncedValue['min-price'],
        'max-price': debouncedValue['max-price'],
        'min-size': debouncedValue['min-size'],
        'max-size': debouncedValue['max-size'],
        bedroom: debouncedValue.bedroom,
        bathroom: debouncedValue.bathroom,
        furnished: debouncedValue.furnished,
        keywords: debouncedValue.keywords,
        keywords_length: debouncedValue.keywords.length,
        property_type: debouncedValue.property_type,
        property_category: debouncedValue.property_category,
        // status: status,
        search: debouncedValue.search,
        visobility: debouncedValue.visibility,
        plan: debouncedValue.plan,
        sort: debouncedSort?.sort,
        order: debouncedSort?.order,
      },
    ],
    queryFn: async () => {
      const createBaseQuery = (status?: string) => {
        const query = new Parse.Query('Property');
        query.equalTo('owner', {
          __type: 'Pointer',
          className: '_User',
          objectId: user?.id,
        });
        query.equalTo('listing_for', listing_for);

        if (debouncedValue['min-price']) {
          query.greaterThanOrEqualTo('price', parseInt(debouncedValue['min-price']));
        }
        if (debouncedValue['max-price']) {
          query.lessThanOrEqualTo('price', parseInt(debouncedValue['max-price']));
        }

        if (debouncedValue['min-size']) {
          query.greaterThanOrEqualTo('size', parseInt(debouncedValue['min-size']));
        }
        if (debouncedValue['max-size']) {
          query.lessThanOrEqualTo('size', parseInt(debouncedValue['max-size']));
        }
        if (debouncedValue.bedroom) {
          query.greaterThanOrEqualTo('bedrooms', parseInt(debouncedValue.bedroom));
        }
        if (debouncedValue.plan) {
          query.equalTo('plan', debouncedValue.plan);
        }
        if (debouncedValue.visibility !== null) {
          query.equalTo('visible', debouncedValue.visibility);
        }
        if (debouncedValue.bathroom) {
          query.greaterThanOrEqualTo('bathrooms', parseInt(debouncedValue.bathroom));
        }
        if (debouncedValue.furnished) {
          query.equalTo('furnished', debouncedValue.furnished === 'true' ? true : false);
        }

        if (debouncedValue.keywords && debouncedValue.keywords.length !== 0) {
          query.containsAll('keywords', debouncedValue.keywords.split(' '));
        }

        if (debouncedValue.property_type) {
          query.equalTo('property_type', debouncedValue.property_type);
        }
        if (debouncedValue.property_category) {
          query.equalTo('property_category', debouncedValue.property_category);
        }

        // if (debouncedValue.search.trim()) {
        //   const inputtrim = escapeRegExp(debouncedValue.search.trim());
        //   const replaceed = inputtrim.replace(/[ ]/gi, '.*');
        //   query.matches('title', new RegExp(`.*${replaceed}.*`), 'i');
        // }

        if (status) query.equalTo('status', status);
        return query;
      };

      const allquery = createBaseQuery();
      const activequery = createBaseQuery('Approved');
      const pendingquery = createBaseQuery('Pending Approval');
      const expiredquery = createBaseQuery('Expired');
      const rejectedquery = createBaseQuery('Rejected');
      const deletedquery = createBaseQuery('Deleted');

      const t: [number, number, number, number, number, number] = await Promise.all([
        allquery.count(),
        activequery.count(),
        pendingquery.count(),
        expiredquery.count(),
        rejectedquery.count(),
        deletedquery.count(),
      ]);

      return {
        all: t[0],
        active: t[1],
        pending: t[2],
        expired: t[3],
        rejected: t[4],
        deleted: t[5],
      };
    },
    initialData: {
      all: 0,
      active: 0,
      pending: 0,
      expired: 0,
      rejected: 0,
      deleted: 0,
    },
  });

  const properties = data?.pages.flatMap((page) => page.results) || [];

  return (
    <View className="flex w-full flex-1 flex-col">
      <View className="relative h-16 flex-row items-center justify-center">
        <Pressable
          hitSlop={20}
          className="absolute left-4"
          onPress={() => {
            router.back();
          }}>
          <ArrowLeftIcon size={16} weight="bold" />
        </Pressable>
        <View className="flex-row gap-2 rounded-full bg-[#E9E9EC] p-1.5">
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Rental');
            }}>
            <View
              className={cn('w-20 items-center justify-center  rounded-full   py-1.5', {
                'bg-white': listing_for === 'Rental',
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'font-medium text-black': listing_for === 'Rental',
                })}>
                Rent
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Sale');
            }}>
            <View
              className={cn('w-20 items-center justify-center  rounded-full   py-1.5', {
                'bg-white': listing_for === 'Sale',
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'font-medium text-black': listing_for === 'Sale',
                })}>
                Sale
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View className="flex-1 px-4 ">
        <View>
          <AppText className="mb-2 font-semibold text-3xl ">My Properties 🏠</AppText>
        </View>
        <ScrollView
          horizontal
          className="max-h-10"
          contentContainerClassName="gap-2 h-10"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {[
            { label: 'All', status: null, id: 'all' },
            { label: 'Active', status: 'Approved', id: 'active' },
            { label: 'Pending', status: 'Pending Approval', id: 'pending' },
            { label: 'Expired', status: 'Expired', id: 'expired' },
            { label: 'Rejected', status: 'Rejected', id: 'rejected' },
            { label: 'Deleted', status: 'Deleted', id: 'deleted' },
          ].map((i: any) => (
            <Pressable
              onPress={() => {
                setStatus(i.status);
              }}
              className={cn(
                'text-gray-3 flex-row items-center justify-center rounded-full border border-[#E2E4E8] bg-[#575775]/5 px-3 py-1 text-xs',
                {
                  'border-primary bg-primary font-medium text-white': status === i.status,
                }
              )}
              key={i.label}>
              <AppText
                className={cn('text-[12px]', {
                  ' text-white': status === i.status,
                })}>
                {i.label}
              </AppText>
              <AppText
                className={cn(
                  'ml-2 rounded-full border border-[#575775]/15 bg-[#575775]/15 px-2 py-1 font-medium text-[12px] text-[#9191A1]',
                  {
                    'border-white bg-white font-semibold text-primary': status === i.status,
                  }
                )}>
                {_stats_2[i.id as keyof typeof _stats_2]}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
        <FlashList
          className="mt-4 w-full flex-1"
          data={properties}
          decelerationRate={'fast'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={(deviceWidth - 16 * 2) / 1.4 + 8} // ✅ improves performance
          keyExtractor={(item) => item.objectId}
          renderItem={({ item }) => {
            if (isProperty(item)) {
              return <PropertyCard property={item} type="dashboard" />;
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
    </View>
  );
};

export default Favorities;
