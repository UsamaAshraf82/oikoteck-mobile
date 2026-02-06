import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function SizeIcon(props: SvgProps) {
  return (
    <Svg
      width={props.width || 25}
      height={props.height || 25}
      viewBox="0 0 25 25"
      fill="none"
      {...props}>
      <Path
        d="M10.658 19.3123L4.20772 12.862C3.47764 12.132 3.47764 10.7877 4.20772 10.0576L10.658 3.60738C11.3881 2.87729 12.7323 2.87729 13.4624 3.60738L19.9126 10.0576C20.6427 10.7877 20.6427 12.132 19.9126 12.862L13.4624 19.3123C12.7323 20.0423 11.3881 20.0423 10.658 19.3123Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.45996 16.4656L7.69642 21.702"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.4233 21.702L21.6597 16.4656"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
