// components/ToastContainer.tsx
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useToast } from '~/store/useToast';
import { deviceWidth } from '~/utils/global';

export const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <View
      className="absolute left-[16px] top-4 z-[9999] flex-col items-center gap-2 bg-black/5"
      pointerEvents="box-none">
      {toasts.map((toast, i) => (
        <Animated.View
          key={toast.id}
          className={'rounded-md border-l-8  border-r-8 bg-white px-3 py-2'}
          style={[
            { width: deviceWidth - 32 },

            toast.type === 'success' && { borderColor: '#4caf50' },
            toast.type === 'error' && { borderColor: '#f44336' },
            toast.type === 'info' && { borderColor: '#333' },
          ]}>
          <Text className="text-left text-lg font-semibold text-secondary">{toast.header}</Text>
          <Text className="text-left  text-primary">{toast.message}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    position: 'absolute',
    width: '80%',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
