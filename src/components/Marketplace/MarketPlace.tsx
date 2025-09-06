// import { View } from 'lucide-react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef } from 'react';
import { Text, View } from 'react-native';
import DistrictArea from '../Sheets/District/DistrictArea';
import { SearchView } from './SearchView';
import { HomeTopBar } from './TopBar';

type Props = {
  listing_type: 'Rental' | 'Sale';
};

const MarketPlace = ({ listing_type }: Props) => {
  // ref
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return (
    <View className="flex-1 ">
      <View className="bg-white">
        <HomeTopBar />
      </View>

      <View className="bg-white">
        <SearchView
          listing_type={listing_type}
          text=""
          onPress={() => {
            console.log('snapped1 2');
            bottomSheetRef.current?.present();
          }}
        />
      </View>
      <Text className="text-2xl">{listing_type}</Text>

      <DistrictArea ref={bottomSheetRef} onPress={()=>{
        console.log('snapped1');
        bottomSheetRef.current?.dismiss();
      }} />

      {/* <BottomSheetModal
        index={0}
        enablePanDownToClose
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{ display: 'none' }}
        backgroundStyle={{ borderRadius: 0 }}
        snapPoints={[height]}>
        <BottomSheetView className="flex-1 items-center p-12" style={{ height: height }}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheetModal> */}
    </View>
  );
};
export default MarketPlace;
