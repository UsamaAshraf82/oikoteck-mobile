import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Slot />
    </View>
  );
}
