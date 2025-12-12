import PostLisitngIcon from '@/assets/svg/post-listing.svg';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { XIcon } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import PressableView from '~/components/HOC/PressableView';
const PostListing = () => {
  const router = useRouter();
  return (
    <View className="h-full flex-col bg-white">
      <View className="h-10 flex-row items-center justify-end px-6">
        <Pressable onPress={() => router.back()}>
          <XIcon />
        </Pressable>
      </View>
      <View className="flex-1 " style={{ maxHeight: '50%' }}>
        <Image
          source={PostLisitngIcon}
          contentFit="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <View className=" flex-1 grow  px-6 ">
        <AppText className="font-bold text-3xl text-primary" style={{ fontFamily: 'LufgaBold' }}>
          Post a listing
        </AppText>
        <AppText className="my-1 mb-4 text-[15px] text-[#575775]">
          Post a listing on OikoTeck in just 3 simple and easy steps, and enjoy hassle free property
          management
        </AppText>
        <View className="relative flex-col gap-4">
          {['Add your property details', 'Upload property images', 'And you’re done!!!'].map(
            (i, j) => (
              <View key={j} className="my-1 flex-row items-center">
                <View
                  className="mr-2 h-10 w-10 items-center justify-center rounded-full bg-white"
                  style={{
                    shadowColor: 'rgba(87, 87, 117, 0.25)',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 1,
                    shadowRadius: 8,
                    elevation: 4, // Android support
                  }}>
                  <AppText className="text-base text-primary">{j + 1}</AppText>
                </View>
                <AppText>{i}</AppText>
              </View>
            )
          )}
          <View className="absolute left-5 z-[-1] h-full w-0.5 overflow-hidden py-2">
            <View className="h-full bg-[#ACACB9]" />
          </View>
        </View>
      </View>
      <View className="px-4">
        <PressableView
          onPress={() => {
            router.push('/property/new');
          }}
          className="mb-2 h-14 w-full flex-row items-center justify-center rounded-full bg-primary">
          <View>
            <AppText className="font-bold text-[15px] text-white">Post my listing</AppText>
          </View>
        </PressableView>
      </View>
    </View>
  );
};

export default PostListing;
