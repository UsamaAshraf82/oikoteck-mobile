import React, { ReactNode } from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { cn } from '~/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
};

const PressableView: React.FC<Props> = ({ children, className, onPress }) => {
  return (
    <View className={cn('overflow-hidden', className)}>
      <TouchableNativeFeedback
        onPress={onPress}
        // background={TouchableNativeFeedback.Ripple('rgba(255,255,255,0.3)', true)}
      >
        <View className="flex-1 w-full h-full items-center justify-center">{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default PressableView;
