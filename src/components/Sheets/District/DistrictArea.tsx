import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';
import { useInfiniteQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { GlobeHemisphereEastIcon, MagnifyingGlassIcon } from 'phosphor-react-native';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { stringify_area_district } from '~/lib/stringify_district_area';
const { height } = Dimensions.get('window');

type Props = {
  ref: React.ForwardedRef<BottomSheetModal>;
  onPress: (data: { district: string; area_1: string; area_2: string }) => void;
};

const DistrictArea = ({ ref, ...props }: Props) => {
  // const {}

  const [open, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const fetchingRef = useRef(false);


  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    enabled: open,
    queryKey: ['districts_area', text],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const res = (await Parse.Cloud.run('district_area', {
          input: text,
          pageParam,
        })) as {
          options: { district: string; area_1: string; area_2: string }[];
          hasmore: boolean;
        };
        // console.log(res);
        return res;
      } catch (e) {
        return { options: [], hasmore: false };
      }
    },

    staleTime: Infinity, // always "fresh"
    // cacheTime: Infinity,   // never garbage collected
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
  });

  const allOptions = useMemo(() => data?.pages.flatMap((page) => page.options) ?? [], [data]);

  console.log(allOptions, data?.pages);

  return (
    <BottomSheetModal
      index={0}
      enablePanDownToClose
      ref={ref}
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      handleIndicatorStyle={{ display: 'none' }}
      backgroundStyle={{ borderRadius: 0 }}
      onChange={(index) => setIsOpen(index >= 0)}
      snapPoints={[height]}>
      <BottomSheetView className="flex-1 py-2" style={{ minHeight: height }}>
        {/* Search bar */}
        <View className="mx-4 flex-row items-center justify-between rounded-full border border-o_light_gray px-2 py-4">
          <View className="flex-row items-center">
            <GlobeHemisphereEastIcon />
            <TextInput
              style={{
                flex: 1,
                fontSize: 14,
                padding: Platform.OS === 'ios' ? 5 : 0,
                paddingLeft: 8,
                width: '100%',
              }}
              value={text}
              onChangeText={setText}
              autoFocus
            />
            <MagnifyingGlassIcon />
          </View>
        </View>

        {/* <ScrollView className='flex-1'> */}
        {/* FlashList with infinite scroll */}
        <BottomSheetFlashList
          className="w-full flex-1"
          data={allOptions}
          estimatedItemSize={38} // ✅ improves performance
          keyExtractor={(item) => item.district + item.area_1 + item.area_2}
          renderItem={({ item }) => {
            const text = stringify_area_district({
              district: item.district,
              area_1: item.area_1,
              area_2: item.area_2,
            });
            return (
              <TouchableWithoutFeedback onPress={() => props.onPress(item)}>
                <Text className="p-2 text-lg text-primary last:mb-0">{text}</Text>
              </TouchableWithoutFeedback>
            );
          }}
          onEndReached={() => {

            if (!fetchingRef.current && hasNextPage) {
              fetchingRef.current = true;
              fetchNextPage().finally(() => {
                fetchingRef.current = false;
              });
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
        {/* </ScrollView> */}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default DistrictArea;
