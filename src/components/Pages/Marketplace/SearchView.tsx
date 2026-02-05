import { FunnelSimpleIcon, GlobeHemisphereEastIcon, XIcon } from 'phosphor-react-native';
import { Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';

type Props = {
  listing_type: 'Rental' | 'Sale';
  text: string;
  onPress: () => void;
  onFilter: () => void;
  onClear: () => void;
};

export const SearchView = ({ listing_type, text, onPress, onClear, onFilter }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.innerSearch}>
            <GlobeHemisphereEastIcon weight="fill" color="#192234" />
            <AppText
              style={[
                styles.searchText,
                {
                  color: text ? '#000' : '#999',
                },
              ]}>
              {text ||
                (listing_type === 'Sale'
                  ? 'Where are you buying in Greece?'
                  : 'Where are you renting in Greece?')}
            </AppText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.iconSection}>
        {!text ? (
          <TouchableWithoutFeedback onPress={onFilter}>
            <View style={styles.iconButton}>
              <FunnelSimpleIcon color="#cad2df" />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback hitSlop={10} onPress={onClear}>
            <View style={styles.iconButton}>
              <XIcon color="#192234" size={20} />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cad2df',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'white',
  },
  searchSection: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    padding: Platform.OS === 'ios' ? 5 : 0,
    paddingLeft: 8,
  },
  iconSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
});
