import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import { isProperty } from '~/utils/property';

const limit = 50;

const Favorites = () => {
  const { user } = useUser();
  const router = useRouter();

  const [listing_for, setListingFor] = useState<'Rental' | 'Sale'>('Rental');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['properties', 'favorites', listing_for],
    queryFn: async ({ pageParam }) => {
      try {
        const skip = pageParam * limit;

        if (!user?.id) return { count: 0, property: [], hasmore: false };

        const query = new Parse.Query('Favourite');
        query.equalTo('User', user);
        query.equalTo('listing_for', listing_for);

        query.limit(limit);
        query.skip(skip);
        query.withCount();

        query.include('Property');
        query.addDescending('createdAt');
        const property = (await query.find({
          json: true,
        })) as unknown as {
          count: number;
          results: { Property: Property_Type }[];
        };
        return {
          count: property.count,
          property: property.results.map((item) => item.Property),
          hasmore: property.results.length === limit,
        } as {
          count: number;
          property: Property_Type[];
          hasmore: boolean;
        };
      } catch (e: any) {
        return { count: 0, property: [], hasmore: false };
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const properties = data?.pages.flatMap((page) => page.property) || [];

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
            <View style={[styles.tabBtn, listing_for === 'Rental' && styles.tabBtnActive]}>
              <AppText style={[styles.tabText, listing_for === 'Rental' && styles.tabTextActive]}>
                Rent
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Sale');
            }}>
            <View style={[styles.tabBtn, listing_for === 'Sale' && styles.tabBtnActive]}>
              <AppText style={[styles.tabText, listing_for === 'Sale' && styles.tabTextActive]}>
                Sale
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.content}>
        <View>
          <AppText style={styles.mainTitle}>My Favorites</AppText>
        </View>
        <View>
          <AppText style={styles.subTitle}>{data?.pages[0]?.count || 0} favorite listing</AppText>
        </View>
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
                return <PropertyCard property={item} type="favorite" />;
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
    padding: 4,
  },
  tabBtn: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 8,
  },
  tabBtnActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    color: '#9191A1',
    // fontFamily: 'LufgaMedium',
  },
  tabTextActive: {
    color: '#000',
    fontFamily: 'LufgaBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainTitle: {
    marginBottom: 8,
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    marginBottom: 16,
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#9191A1',
  },
  listContainer: {
    flex: 1,
    width: '100%',
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

export default Favorites;
