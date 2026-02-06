import * as React from 'react';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, TouchableNativeFeedback, View, ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const PressableView: React.FC<Props> = ({ children, style, onPress }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableNativeFeedback onPress={onPress}>
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
