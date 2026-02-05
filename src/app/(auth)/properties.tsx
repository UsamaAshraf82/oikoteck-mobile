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
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDebounceValue } from 'usehooks-ts';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
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

const UserProperties = () => {
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

  const [debouncedValue] = useDebounceValue(filter, 500);
  const [debouncedSort] = useDebounceValue(sort, 500);

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      'properties',
      'user_all',
      pageParam,
      {
        limit,
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
        status,
        search: debouncedValue.search,
        visobility: debouncedValue.visibility,
        plan: debouncedValue.plan,
        sort: debouncedSort?.sort,
        order: debouncedSort?.order,
      },
    ],
    queryFn: async () => {
      const skip = pageParam * limit;

      if (!user?.id) return { count: 0, results: [], hasmore: false };

      const query = new Parse.Query('Property');
      query.equalTo('owner', {
        __type: 'Pointer',
        className: '_User',
        objectId: user?.id,
      });

      if (debouncedValue['min-price']) {
        query.greaterThanOrEqualTo('price', parseInt(debouncedValue['min-price'], 10));
      }
      if (debouncedValue['max-price']) {
        query.lessThanOrEqualTo('price', parseInt(debouncedValue['max-price'], 10));
      }

      if (debouncedValue['min-size']) {
        query.greaterThanOrEqualTo('size', parseInt(debouncedValue['min-size'], 10));
      }
      if (debouncedValue['max-size']) {
        query.lessThanOrEqualTo('size', parseInt(debouncedValue['max-size'], 10));
      }
      if (debouncedValue.bedroom) {
        query.greaterThanOrEqualTo('bedrooms', parseInt(debouncedValue.bedroom, 10));
      }
      if (debouncedValue.plan) {
        query.equalTo('plan', debouncedValue.plan);
      }
      if (debouncedValue.visibility !== null) {
        query.equalTo('visible', debouncedValue.visibility);
      }
      if (debouncedValue.bathroom) {
        query.greaterThanOrEqualTo('bathrooms', parseInt(debouncedValue.bathroom, 10));
      }
      if (debouncedValue.furnished) {
        query.equalTo('furnished', debouncedValue.furnished === 'true');
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
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const { data: _stats_2 } = useQuery({
    queryKey: [
      'properties',
      'user_all_stats_2',
      {
        limit,
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
        search: debouncedValue.search,
        visobility: debouncedValue.visibility,
        plan: debouncedValue.plan,
        sort: debouncedSort?.sort,
        order: debouncedSort?.order,
      },
    ],
    queryFn: async () => {
      const createBaseQuery = (s?: string) => {
        const q = new Parse.Query('Property');
        q.equalTo('owner', {
          __type: 'Pointer',
          className: '_User',
          objectId: user?.id,
        });
        q.equalTo('listing_for', listing_for);

        if (debouncedValue['min-price']) {
          q.greaterThanOrEqualTo('price', parseInt(debouncedValue['min-price'], 10));
        }
        if (debouncedValue['max-price']) {
          q.lessThanOrEqualTo('price', parseInt(debouncedValue['max-price'], 10));
        }
        if (debouncedValue['min-size']) {
          q.greaterThanOrEqualTo('size', parseInt(debouncedValue['min-size'], 10));
        }
        if (debouncedValue['max-size']) {
          q.lessThanOrEqualTo('size', parseInt(debouncedValue['max-size'], 10));
        }
        if (debouncedValue.bedroom) {
          q.greaterThanOrEqualTo('bedrooms', parseInt(debouncedValue.bedroom, 10));
        }
        if (debouncedValue.plan) {
          q.equalTo('plan', debouncedValue.plan);
        }
        if (debouncedValue.visibility !== null) {
          q.equalTo('visible', debouncedValue.visibility);
        }
        if (debouncedValue.bathroom) {
          q.greaterThanOrEqualTo('bathrooms', parseInt(debouncedValue.bathroom, 10));
        }
        if (debouncedValue.furnished) {
          q.equalTo('furnished', debouncedValue.furnished === 'true');
        }
        if (debouncedValue.keywords && debouncedValue.keywords.length !== 0) {
          q.containsAll('keywords', debouncedValue.keywords.split(' '));
        }
        if (debouncedValue.property_type) {
          q.equalTo('property_type', debouncedValue.property_type);
        }
        if (debouncedValue.property_category) {
          q.equalTo('property_category', debouncedValue.property_category);
        }

        if (s) q.equalTo('status', s);
        return q;
      };

      const results = await Promise.all([
        createBaseQuery().count(),
        createBaseQuery('Approved').count(),
        createBaseQuery('Pending Approval').count(),
        createBaseQuery('Expired').count(),
        createBaseQuery('Rejected').count(),
        createBaseQuery('Deleted').count(),
      ]);

      return {
        all: results[0],
        active: results[1],
        pending: results[2],
        expired: results[3],
        rejected: results[4],
        deleted: results[5],
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
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          hitSlop={20}
          style={styles.backBtn}
          onPress={() => {
            router.back();
          }}>
          <ArrowLeftIcon size={20} weight="bold" color="#192234" />
        </Pressable>
        <View style={styles.tabSwitcher}>
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Rental');
            }}>
            <View
              style={[
                styles.tabBtn,
                listing_for === 'Rental' && styles.tabBtnActive,
              ]}>
              <AppText
                style={[
                  styles.tabText,
                  listing_for === 'Rental' && styles.tabTextActive,
                ]}>
                Rent
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Sale');
            }}>
            <View
              style={[
                styles.tabBtn,
                listing_for === 'Sale' && styles.tabBtnActive,
              ]}>
              <AppText
                style={[
                  styles.tabText,
                  listing_for === 'Sale' && styles.tabTextActive,
                ]}>
                Sale
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.content}>
        <View>
          <AppText style={styles.mainTitle}>My Properties 🏠</AppText>
        </View>
        <ScrollView
          horizontal
          style={styles.statusScroll}
          contentContainerStyle={styles.statusScrollContent}
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
              key={i.label}
              onPress={() => {
                setStatus(i.status);
              }}
              style={[
                styles.statusBadge,
                status === i.status && styles.statusBadgeActive,
              ]}>
              <AppText
                style={[
                  styles.statusLabel,
                  status === i.status && styles.statusLabelActive,
                ]}>
                {i.label}
              </AppText>
              <AppText
                style={[
                  styles.statusCount,
                  status === i.status && styles.statusCountActive,
                ]}>
                {_stats_2[i.id as keyof typeof _stats_2]}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.listContainer}>
          <FlashList
            data={properties}
            decelerationRate={'fast'}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={(deviceWidth - 16 * 2) / 1.4 + 8}
            keyExtractor={(item) => item.objectId}
            renderItem={({ item }) => {
              if (isProperty(item)) {
                return <PropertyCard property={item} type="dashboard" />;
              }
              return (
                <View style={styles.similarListingHeader}>
                  <AppText style={styles.similarListingText}>
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
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="large" color="#82065e" />
                </View>
              ) : (
                <View style={styles.footerSpacer} />
              )
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    position: 'relative',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    padding: 8,
  },
  tabSwitcher: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#E9E9EC',
    padding: 6,
  },
  tabBtn: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 6,
  },
  tabBtnActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    color: '#9191A1',
    fontFamily: 'LufgaMedium',
  },
  tabTextActive: {
    color: '#192234',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainTitle: {
    marginBottom: 8,
    fontFamily: 'LufgaBold',
    fontSize: 28,
    color: '#192234',
  },
  statusScroll: {
    maxHeight: 40,
    marginBottom: 8,
  },
  statusScrollContent: {
    gap: 8,
    height: 40,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E2E4E8',
    backgroundColor: 'rgba(87, 87, 117, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadgeActive: {
    borderColor: '#192234',
    backgroundColor: '#192234',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9191A1',
    fontFamily: 'LufgaMedium',
  },
  statusLabelActive: {
    color: 'white',
  },
  statusCount: {
    marginLeft: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(87, 87, 117, 0.15)',
    backgroundColor: 'rgba(87, 87, 117, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: '#9191A1',
    fontFamily: 'LufgaMedium',
    overflow: 'hidden',
  },
  statusCountActive: {
    borderColor: 'white',
    backgroundColor: 'white',
    color: '#192234',
    fontFamily: 'LufgaSemiBold',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  similarListingHeader: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  similarListingText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerSpacer: {
    height: 32,
  },
});

export default UserProperties;
