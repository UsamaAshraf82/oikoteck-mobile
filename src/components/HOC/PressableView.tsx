import * as React from 'react';
import { ReactNode } from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableNativeFeedback,
    View,
    ViewStyle,
} from 'react-native';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
};

const PressableView: React.FC<Props> = ({ children, style, onPress, disabled }) => {
  return (
    <View style={[styles.container, style, disabled && { opacity: 0.5 }]}>
      <TouchableNativeFeedback onPress={onPress} disabled={disabled}>
        <View style={styles.innerContainer}>{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PressableView;
