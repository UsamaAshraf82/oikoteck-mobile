import * as React from 'react';
import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

export type GridProps = {
  cols?: number; // number of columns (like grid-cols-x)
  gap?: number; // spacing between items (like gap-x)
  children: ReactNode;
  style?: ViewStyle;
};

export default function Grid({ cols = 2, gap = 4, children, style }: GridProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          margin: -gap, // cancel outer spacing
        },
        style,
      ]}>
      {React.Children.map(children, (child: any) => (
        <View
          style={{
            width: `${100 / cols}%`, // col width
            padding: gap, // inner spacing
          }}>
          {child}
        </View>
      ))}
    </View>
  );
}
