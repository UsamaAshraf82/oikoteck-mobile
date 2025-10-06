import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import Parse from 'parse/react-native';
import { GlobeHemisphereEastIcon, XIcon } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { cn } from '~/lib/utils';
import { deviceHeight } from '~/utils/global';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPress: (data: string) => void;
  value?: string;
};

const District = ({ visible, onClose, value = '', onPress }: Props) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(value);
  }, [value]);

  // Query for districts/areas
  const { data } = useQuery({
    enabled: visible,
    queryKey: ['districts', text],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const res = (await Parse.Cloud.run('district', {
          input: text,
          pageParam,
        })) as string []

        console.log(res)
        return res;
      } catch {
        return []
      }
    },

    staleTime: Infinity,
  });

  const allOptions =data// data?.flatMap((page) => page.options) ?? [];

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
        className="rounded-t-[20px] bg-white py-4 "
        style={{
          height: deviceHeight * 0.9,
        }}>
        {/* Handle bar */}
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />

        {/* Search bar */}
        <View className="flex-row items-center justify-between">
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
              placeholder="Search district"
              autoFocus
            />
          </View>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>

        {/* FlashList with infinite scroll */}
        <FlashList
          data={allOptions}
          estimatedItemSize={38}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => {
            // const label = stringify_area_district(item);
            return (
              <TouchableOpacity
                onPress={() => {
                  onPress(item);
                  onClose();
                }}
                className=""
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}>
                <Text className={cn('text-primary ', { 'text-secondary': value === item })}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}

          onEndReachedThreshold={0.5}

        />
      </View>
    </Modal>
  );
};

export default District;
