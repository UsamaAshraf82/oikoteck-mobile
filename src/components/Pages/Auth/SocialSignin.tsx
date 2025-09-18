import apple from '@/assets/svg/apple.svg';
import facebook from '@/assets/svg/facebook.svg';
import google from '@/assets/svg/google.svg';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import PressableView from '~/components/HOC/PressableView';

const  SocialSignin = () => {
  return (
    <View className="w-full">
      <PressableView className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={google} style={{ width: 20, height: 20 }} />
          <Text className="font-medium text-primary text-sm">Continue with Google</Text>
        </View>
      </PressableView>
      <PressableView className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={facebook} style={{ width: 20, height: 20 }} />
          <Text className="font-medium text-primary text-sm">Continue with Facebook</Text>
        </View>
      </PressableView>
      <PressableView className="mt-4 h-12 w-full  rounded-full bg-white">
        <View className="flex-row items-center justify-center gap-3">
          <Image source={apple} style={{ width: 20, height: 20 }} />
          <Text className="font-medium text-primary text-sm">Continue with Apple</Text>
        </View>
      </PressableView>
    </View>
  );
};

export default SocialSignin;
