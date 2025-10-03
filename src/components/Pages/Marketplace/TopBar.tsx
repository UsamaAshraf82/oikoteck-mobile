import { Link } from 'expo-router';
import { SquaresFourIcon, UserIcon } from 'phosphor-react-native';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

export const HomeTopBar = ({ openFilters }: { openFilters: () => void }) => {
  const { user } = useUser();
  return (
    <View className="flex-row items-center justify-between p-4">
      {user ? (
        <View className="flex-row items-center">
          <View className="m-2 h-11 w-11 items-center justify-center rounded-full bg-o_gray-200/25">
            <UserIcon color={tailwind.theme.colors.o_light_gray} size={20} />
          </View>
          <View>
            <AppText className="text-sm text-o_gray-200" >Welcome Back!</AppText>
            <Text className="mt-1 text-base font-bold text-primary">
              {user ? `${user.attributes.first_name} ${user.attributes.last_name}` : ''}
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-row items-center">
          <View className="m-2 h-11 w-11 items-center justify-center rounded-full bg-o_gray-200/25">
            <UserIcon color={tailwind.theme.colors.o_light_gray} size={20} />
          </View>
          <View>
            {/* <TouchableWithoutFeedback
              onPress={() => {
                router.push(`/property/${property.objectId}`);
              }}> */}
              <Link href={'/login'} >
                <AppText className="text-sm font-semibold text-primary" >Login/Register</AppText>
              </Link>
            {/* </TouchableWithoutFeedback> */}
          </View>
        </View>
      )}
      <TouchableWithoutFeedback onPress={() => openFilters()}>
        <View>
          <SquaresFourIcon color={tailwind.theme.colors.primary} size={30} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
