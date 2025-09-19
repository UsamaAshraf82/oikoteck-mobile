import blobs from '@/assets/svg/blob.svg';
import { ImageBackground } from 'expo-image';
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Background */}
      <ImageBackground
        source={blobs}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          filter: 'blur(80px)',
        }}
        blurRadius={50}
        contentFit="cover"
      />
      <Slot />
    </View>
  );
}
