import React, { ReactNode } from 'react';
import { View } from 'react-native';

type GridProps = {
  cols?: number; // number of columns (like grid-cols-x)
  gap?: number; // spacing between items (like gap-x)
  children: ReactNode;
  className?: string;
};

export default function Grid({ cols = 2, gap = 2, children, className }: GridProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -gap * 2, // cancel outer spacing
      }}
      className={className}>
      {React.Children.map(children, (child) => (
        <View
          style={{
            width: `${100 / cols}%`, // col width
            padding: gap * 2, // inner spacing
          }}>
          {child}
        </View>
      ))}
    </View>
  );
}
