import { GlobeHemisphereEastIcon, MagnifyingGlassIcon, XIcon } from 'phosphor-react-native';
import {
  Platform,
  TextInput,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type Props = {
  listing_type: 'Rental' | 'Sale';
  text: string;
  onPress: () => void;
  onClear: () => void;
};

export const SearchView = ({ listing_type, text, onPress, onClear }: Props) => {
  return (
    <View className="mx-4 flex-row items-center justify-between rounded-full border border-o_light_gray px-2 py-4">
      <TouchableWithoutFeedback onPress={onPress}>
        <View className="flex-row items-center">
          <GlobeHemisphereEastIcon />
          <TextInput
            style={{
              flex: 1,
              fontSize: 14,
              padding: Platform.OS === 'ios' ? 5 : 0,
              paddingLeft: 8,
            }}
            //     onChangeText={text => {
            //     //   props.setText(text);
            //     // }}
            readOnly
            value={text}
            placeholder={
              listing_type === 'Sale'
                ? 'Where are you buying in Greece?'
                : 'Where are you renting in Greece?'
            }
            //     // placeholderTextColor={Colors.input_placeholder_color}
            //     //    placeholderTextColor={'red'}
            //     autoCapitalize="none"
            //     keyboardType={'default'}
            onFocus={() => onPress()}
            //     style={styles.inputFieldStyle}
          />
          {!text ? (
            <MagnifyingGlassIcon />
          ) : (
            <TouchableNativeFeedback onPress={onClear}>
              <XIcon />
            </TouchableNativeFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
