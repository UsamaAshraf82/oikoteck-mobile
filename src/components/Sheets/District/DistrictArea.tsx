import { FlashList } from '@shopify/flash-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { GlobeHemisphereEastIcon, XIcon } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import AppText from '~/components/Elements/AppText';
import { stringify_area_district } from '~/lib/stringify_district_area';
import { deviceHeight } from '~/utils/global';

type DistrictOption = { district: string; area_1: string; area_2: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  onPress: (data: DistrictOption) => void;
  value?: string;
};

const DistrictArea = ({ visible, onClose, value = '', onPress }: Props) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  // Focus the input when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Delay to allow modal animation to complete
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

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
          options: DistrictOption[];
          hasmore: boolean;
        };
        return res;
      } catch {
        return { options: [], hasmore: false };
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasmore ? (lastPageParam as number) + 1 : undefined,
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
      coverScreen={false}
      style={styles.modal}
      propagateSwipe>
      <View
        style={[
          styles.container,
          {
            height: deviceHeight * 0.9,
          },
        ]}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Search bar */}
        <View style={styles.header}>
          <View style={styles.searchBox}>
            <GlobeHemisphereEastIcon weight="fill" color="#192234" />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Search district or area"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
            <View style={styles.closeIcon}>
              <XIcon color="#192234" size={24} />
            </View>
          </TouchableNativeFeedback>
        </View>

        {/* FlashList with infinite scroll */}
        <FlashList
          data={allOptions}
          estimatedItemSize={38}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: DistrictOption) => item.district + item.area_1 + item.area_2}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }: { item: DistrictOption }) => {
            const label = stringify_area_district(item);
            const isSelected = value === label;
            return (
              <TouchableOpacity
                onPress={() => {
                  onPress(item);
                  onClose();
                }}
                style={styles.item}>
                <AppText style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                  {label}
                </AppText>
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
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#82065e" />
              </View>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  handle: {
    marginBottom: 12,
    height: 4,
    width: 40,
    alignSelf: 'center',
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 8,
    color: '#333',
    height: Platform.OS === 'ios' ? 'auto' : 40,
  },
  closeIcon: {
    padding: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 14,
    color: '#192234',
  },
  itemTextSelected: {
    color: '#82065e',
    fontFamily: 'LufgaSemiBold',
  },
  loader: {
    padding: 20,
  },
});

export default DistrictArea;
