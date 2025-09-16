import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const BedIcon = (props: SvgProps) => (
  <Svg
      width={props.width || 25}
      height={props.height || 25}
    fill="none"
    {...props}
  >
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.926 12.833V11.39M2.074 12.833V11.39m12.593 0H1.333V9.222c0-.191.078-.375.217-.51a.75.75 0 0 1 .524-.212h11.852a.75.75 0 0 1 .524.212c.139.135.217.319.217.51v2.167Zm-1.482-6.5a.713.713 0 0 0-.217-.51.75.75 0 0 0-.524-.212H3.555a.75.75 0 0 0-.523.211.713.713 0 0 0-.217.511V8.5h10.37V4.89Z"
    />
  </Svg>
)
export default BedIcon
