import blobs from '@/assets/svg/blob.svg';
import { ImageBackground } from 'expo-image';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import SocialSignin from '~/components/Pages/Auth/SocialSignin';

export default function Login() {
  return (
    <View className="relative flex-1 bg-white">
      <ImageBackground
        source={blobs}
        style={{
          flex: 1,
          filter: 'blur(80px)',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
        }}
        blurRadius={5}
        contentFit="cover"
      />
      <View className="absolute top-0 w-full flex-1 px-6">
        <View className="flex-col items-center">
          <Text className="mt-20 text-2xl font-semibold">Sign in to your account!</Text>
          <Text className="mt-2">
            Don't have an account?{' '}
            <Link href="signup" className="text-secondary">
              Sign up
            </Link>
          </Text>
          <SocialSignin />
          <Text className="mb-5 mt-5 text-sm text-[#575775]">
            - - - - - - - - - - - or sign in with email - - - - - - - - - - -{' '}
          </Text>
        </View>
      </View>
    </View>
  );
}
