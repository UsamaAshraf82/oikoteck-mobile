import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';

const Services = () => {
  return (
    <View className='bg-white flex-1'>
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={'Services'}
      />
      <View className='px-5'>
      <AppText className='font-semibold text-2xl'>Choose a Plan 📄</AppText>
      <AppText className='text-[#9191A1] text-sm'>Discover how our Innovative approach can save you money and boost your business performance!</AppText>
    </View></View>
  );
};

export default Services;
