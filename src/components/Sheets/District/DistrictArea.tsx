import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { GlobeHemisphereEastIcon, MagnifyingGlassIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { stringify_area_district } from '~/lib/stringify_district_area';

const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onPress: (data: { district: string; area_1: string; area_2: string }) => void;
  value?: string;
};

const DistrictArea = ({ visible, onClose, value = '', onPress }: Props) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(value);
  }, [value]);

  // Query for districts/areas
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    enabled: visible,
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
        return res;
      } catch {
        return { options: [], hasmore: false };
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? lastPageParam + 1 : undefined,
    initialPageParam: 0,
    staleTime: Infinity,
  });

  const allOptions = data?.pages.flatMap((page) => page.options) ?? [];

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
    hardwareAccelerated
      style={{ justifyContent: 'flex-end', margin: 0 }}
      propagateSwipe>
      <View
        style={{
          height: height * 0.9,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingVertical: 10,
        }}>
        {/* Handle bar */}
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ccc',
            marginBottom: 10,
          }}
        />

        {/* Search bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 30,
            paddingHorizontal: 12,
            marginHorizontal: 16,
            paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          }}>
          <GlobeHemisphereEastIcon />
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              paddingLeft: 8,
              color: '#333',
            }}
            value={text}
            onChangeText={setText}
            placeholder="Search district or area"
            autoFocus
          />
          <MagnifyingGlassIcon />
        </View>

        {/* FlashList with infinite scroll */}
        <FlashList
          data={allOptions}
          estimatedItemSize={38}
          keyExtractor={(item) => item.district + item.area_1 + item.area_2}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const label = stringify_area_district(item);
            return (
              <TouchableOpacity
                onPress={() => {
                  onPress(item);
                  onClose();
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}>
                <Text style={{ fontSize: 16, color: '#333' }}>{label}</Text>
              </TouchableOpacity>
            );
          }}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="large" />
              </View>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};

export default DistrictArea;
