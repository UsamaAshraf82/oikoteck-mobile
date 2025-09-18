
// parse-react-native.d.ts
declare module "parse/react-native" {
  import Parse from "parse";
  export default Parse;
}

declare module "*.png" {
  const value: ImageSourcePropType;
  export default value;
}
declare module "*.svg" {
  const value: ImageSourcePropType;
  export default value;
}
