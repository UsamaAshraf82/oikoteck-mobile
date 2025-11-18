import { FunnelSimpleIcon, GlobeHemisphereEastIcon, XIcon } from 'phosphor-react-native';
import { Platform, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import tailwind from '~/utils/tailwind';

type Props = {
  listing_type: 'Rental' | 'Sale';
  text: string;
  onPress: () => void;
  onFilter: () => void;
  onClear: () => void;
};

export const SearchView = ({ listing_type, text, onPress, onClear, onFilter }: Props) => {
  return (
    <View className="mx-4 flex-row items-center justify-between overflow-hidden rounded-full border border-o_light_gray px-2 py-1">
      <View className="shrink flex-row items-center">
        <TouchableWithoutFeedback onPress={onPress}>
          <View className="flex-row items-center">
            <GlobeHemisphereEastIcon weight='fill' color={tailwind.theme.colors.primary}/>
            <AppText
              style={{
                flex: 1,
                fontSize: 14,
                padding: Platform.OS === 'ios' ? 5 : 0,
                paddingLeft: 8,
                color: text ? '#000' : '#999',
              }}>
              {text ||
                (listing_type === 'Sale'
                  ? 'Where are you buying in Greece?'
                  : 'Where are you renting in Greece?')}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View className="w-10 grow">
        {!text ? (
          <TouchableWithoutFeedback onPress={onFilter}>
            <View className="p-2">
              <FunnelSimpleIcon color={tailwind.theme.colors.o_light_gray} />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback hitSlop={100} onPress={onClear}>
            <View className="p-2">
              <XIcon />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};
