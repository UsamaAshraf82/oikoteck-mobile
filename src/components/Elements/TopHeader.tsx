import { ArrowLeftIcon } from 'phosphor-react-native';
import { Pressable, Switch, View } from 'react-native';
import AppText from './AppText';
type Props = {
  onBackPress: () => void;
  title: string;
};
const TopHeader = ({ onBackPress, title }: Props) => {
  return (
    <View className="relative h-16 flex-row items-center justify-center">
      <Pressable
        className="absolute left-4"
        onPress={() => {
          onBackPress();
        }}>
        <ArrowLeftIcon size={16} weight="bold" />
      </Pressable>
      <View>
        <AppText className="font-semibold ">{title}</AppText>
        <Switch />
      </View>
    </View>
  );
};
export default TopHeader;
