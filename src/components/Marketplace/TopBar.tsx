import { SquaresFourIcon, UserIcon } from 'phosphor-react-native';
import { Text, View } from 'react-native';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

export const HomeTopBar = () => {
  const { user } = useUser();
  return (
    <View className="flex-row items-center justify-between p-4">
      <View className="flex-row items-center">
        <View className="bg-o_gray-200/25 m-2 h-11 w-11 items-center justify-center rounded-full">
          <UserIcon color={tailwind.theme.colors.o_light_gray} size={20} />
        </View>
        <View>
          <Text className="text-o_gray-200 text-sm">Welcome Back!</Text>
          <Text className="text-primary mt-1 text-base font-bold">
            {user ? `${user.attributes.first_name} ${user.attributes.last_name}` : ''}
          </Text>
        </View>
      </View>
      <View>
        <SquaresFourIcon color={tailwind.theme.colors.primary} size={30} />
      </View>
    </View>
  );
};
