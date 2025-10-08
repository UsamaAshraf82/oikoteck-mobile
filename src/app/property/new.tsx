import { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import Basic1, { Basic1Values } from '~/components/Pages/PostProperty/Basic1';
import Basic2, { Basic2Values } from '~/components/Pages/PostProperty/Basic2';
import Basic3, { Basic3Values } from '~/components/Pages/PostProperty/Basic3';
import LocationInfo, { LocationInfoTypes } from '~/components/Pages/PostProperty/LocationInfo';
import PaymentInfo, { PaymentInfoTypes } from '~/components/Pages/PostProperty/PaymentInfo';
import PostListingS from '~/components/Pages/PostProperty/PostListingS';
import PropertyGallery, {
  PropertyGalleryTypes,
} from '~/components/Pages/PostProperty/PropertyGallery';
export default function Index() {
  const [tab, setTab] = useState(4);
  const [data, setData] = useState<{
    basic: Partial<Basic1Values>;
    basic2: Partial<Basic2Values>;
    basic3: Partial<Basic3Values>;
    gallery: Partial<PropertyGalleryTypes>;
    location: Partial<LocationInfoTypes>;
    payment: Partial<PaymentInfoTypes>;
  }>({
    basic: {
      listing_for: 'Rental',
      property_type: 'Residential',
    },
    basic2: {
      property_type: 'Residential',
      furnished: false,
      bedrooms: 1,
      bathrooms: 1,
      floor: 0,
      special_feature: [],
    },
    basic3: { payment_frequency: 1, deposit: 1, level_of_finish: 3 },
    gallery: { files: [], agent_icon: false },
    location: { exact_location: false },
    payment: {},
  });

  useEffect(() => {
    const backAction = () => {
      if (tab > 0) {
        setTab((prev) => prev - 1); // go to previous step
        return true; // prevent default behavior
      }
      return false; // allow default (exit / navigate back) if already at first step
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [tab]);

  switch (tab) {
    case 0:
      return (
        <Basic1
          data={data.basic}
          onSubmit={(data) => {
            setData((i) => ({ ...i, basic: data }));
            setTab(1);
          }}
        />
      );
    case 1:
      return (
        <Basic2
          data={data.basic2}
          extra_data={{
            property_type: data.basic.property_type!,
            property_category: data.basic.property_category!,
          }}
          onSubmit={(data) => {
            setData((i) => ({ ...i, basic2: data }));
            setTab(2);
          }}
        />
      );
    case 2:
      return (
        <Basic3
          data={data.basic3}
          extra_data={{
            listing_for: data.basic.listing_for!,
          }}
          onSubmit={(data) => {
            setData((i) => ({ ...i, basic3: data }));
            setTab(3);
          }}
        />
      );
    case 3:
      return (
        <PropertyGallery
          data={data.gallery}
          extra_data={{
            listing_for: data.basic.listing_for!,
          }}
          onSubmit={(data) => {
            setData((i) => ({ ...i, gallery: data }));
            setTab(4);
          }}
        />
      );
    case 4:
      return (
        <LocationInfo
          data={data.location}
          // extra_data={{
          //   listing_for: data.basic.listing_for!,
          // }}
          onSubmit={(data) => {
            setData((i) => ({ ...i, location: data }));
            setTab(5);
          }}
        />
      );
    case 5:
      return (
        <PaymentInfo
          data={data.payment}
          // extra_data={{
          //   listing_for: data.basic.listing_for!,
          // }}
          onSubmit={(data) => {
            setData((i) => ({ ...i, payment: data }));
            setTab(6);
          }}
        />
      );
    case 6:
      return (
        <PostListingS
          extraData={{
            plan: data.payment.plan!,
          }}
          onSubmit={() => {
            // setData((i) => ({ ...i, payment: data }));
            setTab(7);
          }}
        />
      );
  }

  return <View></View>;
}
