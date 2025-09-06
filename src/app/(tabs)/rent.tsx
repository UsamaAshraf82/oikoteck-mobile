import React from "react";
import { Dimensions } from "react-native";
import MarketPlace from "~/components/Marketplace/MarketPlace";

const PAGE_WIDTH = Dimensions.get("window").width;
const PAGE_HEIGHT = Dimensions.get("window").height;
const Rental = () => {
  // const [data, setData] = React.useState<{ src: string; blurhash: string }[]>(
  //   []
  // );

  // useEffect(() => {
  //   const getData = async () => {
  //     const searchParams = new URLSearchParams();
  //     searchParams.set("query", "girl");
  //     searchParams.set(
  //       "client_id",
  //       "XRACyM6i07yewDJvrzcY3a5QhK8TV4K3-GR4QmKZk5c"
  //     );
  //     searchParams.set("orientation", "portrait");
  //     searchParams.set("count", "30");

  //     const response = await fetch(
  //       `https://api.unsplash.com/photos/random?${searchParams.toString()}`
  //     );
  //     const data: unsplashType[] = await response.json();



  //     setData(
  //       data.map((item) => ({
  //         src: item.urls.regular,
  //         blurhash: item.blur_hash,
  //       }))
  //     );
  //   };
  //   getData();
  // }, []);

  // const animationStyle: TAnimationStyle = React.useCallback((value: number) => {
  //   "worklet";

  //   const zIndex = Math.round(interpolate(value, [-1, 0, 1], [10, 20, 30]));
  //   const scale = interpolate(value, [-1, 0, 1], [1.25, 1, 0.25]);
  //   const opacity = interpolate(value, [-0.75, 0, 1], [0, 1, 0]);

  //   return {
  //     transform: [{ scale }],
  //     zIndex,
  //     opacity,
  //   };
  // }, []);

  return (
    <MarketPlace listing_type='Rental' />
  );
};


export default Rental;
