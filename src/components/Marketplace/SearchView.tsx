import { GlobeHemisphereEastIcon, MagnifyingGlassIcon } from 'phosphor-react-native';
import { Platform, TextInput, TouchableWithoutFeedback, View } from 'react-native';

type Props = {
  listing_type: 'Rental' | 'Sale';
  text: string;
  onPress: () => void;
};

export const SearchView = ({ listing_type, text, onPress }: Props) => {
  return (
    <View className="border-o_light_gray mx-4 flex-row items-center justify-between rounded-full border px-2 py-4">
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
          <MagnifyingGlassIcon />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
