import Svg, { Path, SvgProps } from 'react-native-svg';
const BathIcon = (props: SvgProps) => (
  <Svg width={props.width || 25} height={props.height || 25} fill="none" {...props}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={props.strokeWidth || 1.5}
      d="M6 4.389c0-.413-.176-.808-.488-1.1a1.729 1.729 0 0 0-1.179-.456c-.442 0-.866.164-1.178.456a1.505 1.505 0 0 0-.488 1.1v3.11M2 7.5h12m-2.333 5.333L12 14.167m-7.667-1.334L4 14.167m9.333-4V7.5H2.667v2.667a2.667 2.667 0 0 0 2.666 2.666h5.334a2.667 2.667 0 0 0 2.666-2.666Z"
    />
  </Svg>
);
export default BathIcon;
