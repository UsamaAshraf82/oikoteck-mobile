import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, TouchableWithoutFeedback, View } from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import { cn } from '~/lib/utils';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { deviceWidth } from '~/utils/global';
import { isProperty } from '~/utils/property';
const limit = 50;
const Favorities = () => {
  const { user } = useUser();
  const router = useRouter();

  const [listing_for, setListingFor] = useState<'Rental' | 'Sale'>('Rental');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['properties', 'faviorites', listing_for],
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
      } catch {}
      return { count: 0, property: [], hasmore: false };
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const properties = data?.pages.flatMap((page) => page.property) || [];

  return (
    <View className="flex w-full flex-1 flex-col">
      <View className="relative h-16 flex-row items-center justify-center">
        <Pressable
          className="absolute left-4"
          onPress={() => {
            router.back();
          }}>
          <ArrowLeftIcon size={16} weight="bold" />
        </Pressable>
        <View className="flex-row gap-2 rounded-full bg-[#E9E9EC] p-2">
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Rental');
            }}>
            <View
              className={cn('w-20 items-center justify-center  rounded-full   py-2', {
                'bg-white': listing_for === 'Rental',
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'text-medium text-primary': listing_for === 'Rental',
                })}>
                Rental
              </AppText>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setListingFor('Sale');
            }}>
            <View
              className={cn('w-20 items-center justify-center  rounded-full   py-2', {
                'bg-white': listing_for === 'Sale',
              })}>
              <AppText
                className={cn('text-[#9191A1]', {
                  'text-medium text-primary': listing_for === 'Sale',
                })}>
                Sale
              </AppText>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View className="flex-1 px-4 ">
        <View>
          <AppText className="mb-2 font-bold text-xl">My Favourites</AppText>
        </View>
        <View>
          <AppText
            className="mb-2 font-medium text-[#9191A1]">
            {data?.pages[0]?.count} favourite listings
          </AppText>
        </View>
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
              return <PropertyCard property={item} type="favorite" />;
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
