import { ArrowLeftIcon } from 'phosphor-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';

type Props = {
  onBackPress: () => void;
  title: string;
  right?: React.ReactNode;
};

const TopHeader = ({ onBackPress, title, right }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={20}
        style={styles.backButton}
        onPress={() => {
          onBackPress();
        }}>
        <ArrowLeftIcon size={18} weight="bold" color="#192234" />
      </Pressable>
      <View>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      {right && <View style={styles.rightContainer}>{right}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  title: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: '#192234',
  },
  rightContainer: {
    position: 'absolute',
    right: 16,
  },
});

export default TopHeader;
