import Logo from '@/assets/svg/logo.svg';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { UserCircleIcon, UserIcon } from 'phosphor-react-native';
import { TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

export const HomeTopBar = () => {
  const router = useRouter();
  const { user } = useUser();
  console.log(user);
  return (
    <View className="flex-row items-center justify-between p-4">
      <Image source={Logo} style={{ minHeight: 36, minWidth: 122 }} contentFit="contain" />
      {!user ? (
        <PressableView
          onPress={() => {
            router.push('/login');
          }}
          className="h-10   rounded-full bg-[#ebeaec]">
          <View className="flex-row items-center justify-center gap-1 px-3">
            <UserCircleIcon />
            <AppText>Login now</AppText>
          </View>
        </PressableView>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            router.push('/account');
          }}>
          <View className="flex-row items-center">
            <View>
              <AppText className="text-sm leading-tight text-o_gray-200">Welcome Back!</AppText>
              <AppText className=" font-bold text-base leading-tight text-primary">
                {user ? `${user.attributes.first_name} ${user.attributes.last_name}` : ''}
              </AppText>
            </View>
            <View className="m-2 h-11 w-11 items-center justify-center rounded-full bg-o_gray-200/25">
              <UserIcon color={tailwind.theme.colors.o_light_gray} size={20} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};
