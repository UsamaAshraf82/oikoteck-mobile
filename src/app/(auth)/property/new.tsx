import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon, XIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import Basic1, { Basic1Values } from '~/components/Pages/PostProperty/Basic1';
import Basic2, { Basic2Values } from '~/components/Pages/PostProperty/Basic2';
import Basic3, { Basic3Values } from '~/components/Pages/PostProperty/Basic3';
import LocationInfo, {
  LocationInfoTypes,
} from '~/components/Pages/PostProperty/LocationInfo';
import PaymentInfo, {
  PaymentInfoTypes,
} from '~/components/Pages/PostProperty/PaymentInfo';
import PostListingS from '~/components/Pages/PostProperty/PostListingS';
import PropertyGallery, {
  PropertyGalleryTypes,
} from '~/components/Pages/PostProperty/PropertyGallery';
import { emailsAddress } from '~/global';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';

export default function PostProperty() {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const { addToast } = useToast();
  const { startActivity, stopActivity } = useActivityIndicator();

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
      property_category: 'Apartment',
      property_oriantation: 'North-Facing',
      description: 'Description',
      title: 'Title',
    },
    basic2: {
      property_type: 'Residential',
      furnished: false,
      bedrooms: 1,
      bathrooms: 1,
      floor: 1,
      construction_year: 2000,
      energy_class: 'A',
      heating: 'Autonomous Heating',
      level_of_finish: 3,
      plot_size: 1000,
      property_category: 'Apartment',
      heating_expense: 100,
      special_feature: ['Parking Spot'],
      size: 100,
    },
    basic3: {
      contact_method: 'Both',
      listing_for: 'Rental',
      price: 5000,
      reference_number: '123456789',
      payment_frequency: 1,
      deposit: 1,
      level_of_finish: 3,
      move_in_date: new Date().toISOString(),
    },
    gallery: {
      files: [
        {
          file: undefined,
          isUploading: false,
          temp: 'file:///data/user/0/com.oikoteck.app/cache/ImageManipulator/e32f7281-ac89-491b-a769-0dcebe3fa0ea.webp',
          url: 'image/ff65bff955c_1772777742977_',
        },
        {
          file: undefined,
          isUploading: false,
          temp: 'file:///data/user/0/com.oikoteck.app/cache/ImageManipulator/f8a5c8d3-321c-498a-8148-4fb78fad5077.webp',
          url: 'image/bff65bff955_1772777740024_',
        },
        {
          file: undefined,
          isUploading: false,
          temp: 'file:///data/user/0/com.oikoteck.app/cache/ImageManipulator/9376142a-4369-4ac5-917f-c0969166fb7e.webp',
          url: 'image/f65bff955c3_1772778162843_',
        },
      ],
      agent_icon: false,
    },
    location: { exact_location: false },
    payment: {},
  });

  useEffect(() => {
    const backAction = () => {
      if (tab > 0) {
        setTab((prev) => prev - 1);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [tab]);

  const onSubmit = async () => {
    startActivity();
    const Property = new Parse.Object('Property');

    const images = data.gallery.files;

    try {
      Property.set('listing_for', data.basic.listing_for);
      Property.set(
        'images',
        images?.map((i) => i?.url)
      );
      Property.set('title', data.basic.title);
      Property.set('description', data.basic.description);
      Property.set('contact_method', data.basic3.contact_method);
      Property.set('move_in_date', new Date(data.basic3.move_in_date!));
      Property.set('price', data.basic3.price);
      Property.set('property_type', data.basic.property_type);
      Property.set('property_category', data.basic.property_category);
      Property.set('property_oriantation', data.basic.property_oriantation);
      Property.set('special_feature', data.basic2.special_feature);
      Property.set('bedrooms', data.basic2.bedrooms);
      Property.set('bathrooms', data.basic2.bathrooms);
      Property.set('size', data.basic2.size);
      Property.set('plot_size', data.basic2.plot_size || 0);
      Property.set('furnished', data.basic2.furnished);
      Property.set('deposit', data.basic3.deposit);
      Property.set('payment_frequency', data.basic3.payment_frequency);
      Property.set('level_of_finish', data.basic3.level_of_finish);
      Property.set('reference_number', data.basic3.reference_number);
      Property.set('agent_icon', data.gallery.agent_icon);
      Property.set(
        'construction_year',
        data.basic2.construction_year ? data.basic2.construction_year : 0
      );
      Property.set('heating', data.basic2.heating);
      Property.set('heating_expense', data.basic2.heating_expense);
      Property.set('energy_class', data.basic2.energy_class);
      Property.set('floor', data.basic2.floor);

      Property.set('district', data.location.district);
      Property.set('area_1', data.location.area_1);
      Property.set('area_2', data.location.area_2 || '');
      Property.set('address', data.location.address);
      Property.set('exact_location', data.location.exact_location);
      Property.set('status', 'Pending Approval');
      Property.set('flag', 'NEW');
      Property.set('flag_time', new Date());

      Property.set(
        'marker',
        new Parse.GeoPoint({
          latitude: data.location.marker?.lat || 0,
          longitude: data.location.marker?.lng || 0,
        })
      );
      Property.set('owner', Parse.User.current());
      Property.set('plan', data.payment.plan);

      const result = await Property.save();
      await fetch(emailsAddress, {
        method: 'POST',
        body: JSON.stringify({ email: 'listing_review_free', id: result.id }),
      });

      addToast({
        heading: 'Listing Under Review',
        message:
          'Your listing is currently being reviewed by Oikoteck customer service team. You will be notified shortly of its approval status.',
      });
      router.push(`/account`);
      stopActivity();
    } catch (e: any) {
      addToast({
        type: 'error',
        heading: 'Error',
        message: e.message || 'Failed to post listing.',
      });
      stopActivity();
    }
  };

  const renderHeader = (onBack: () => void) => (
    <View style={styles.header}>
      <Pressable hitSlop={20} onPress={onBack}>
        <ArrowLeftIcon color='#192234' size={24} />
      </Pressable>
      <AppText style={styles.headerTitle}>Post a listing</AppText>
      <Pressable hitSlop={20} onPress={() => router.back()}>
        <XIcon color='#192234' size={24} />
      </Pressable>
    </View>
  );

  switch (tab) {
    case 0:
      return (
        <View style={styles.container}>
          {/* {renderHeader(() => router.back())} */}
          <Basic1
            onBack={() => router.back()}
            data={data.basic}
            onSubmit={(val) => {
              setData((i) => ({ ...i, basic: val }));
              setTab(1);
            }}
          />
        </View>
      );
    case 1:
      return (
        <View style={styles.container}>
          <Basic2
            onBack={(val) => {
              setData((i) => ({ ...i, basic2: val }));
              setTab(0);
            }}
            data={data.basic2}
            extra_data={{
              property_type: data.basic.property_type!,
              property_category: data.basic.property_category!,
            }}
            onSubmit={(val) => {
              setData((i) => ({ ...i, basic2: val }));
              setTab(2);
            }}
          />
        </View>
      );
    case 2:
      return (
        <View style={styles.container}>
          <Basic3
            onBack={(val) => {
              setData((i) => ({ ...i, basic3: val }));
              setTab(1);
            }}
            data={data.basic3}
            extra_data={{
              listing_for: data.basic.listing_for!,
            }}
            onSubmit={(val) => {
              setData((i) => ({ ...i, basic3: val }));
              setTab(3);
            }}
          />
        </View>
      );
    case 3:
      return (
        <View style={styles.container}>
          {/* {renderHeader(() => setTab(2))} */}
          <PropertyGallery
            onBack={(val) => {
              setData((i) => ({ ...i, gallery: val }));
              setTab(2);
            }}
            data={data.gallery}
            extra_data={{
              listing_for: data.basic.listing_for!,
            }}
            onSubmit={(val) => {
              setData((i) => ({ ...i, gallery: val }));
              setTab(4);
            }}
          />
        </View>
      );
    case 4:
      return (
        <View style={styles.container}>
          {/* {renderHeader(() => setTab(3))} */}
          <LocationInfo
            onBack={(val) => {
              setData((i) => ({ ...i, location: val }));
              setTab(3);
            }}
            data={data.location}
            onSubmit={(val) => {
              setData((i) => ({ ...i, location: val }));
              setTab(5);
            }}
          />
        </View>
      );
    case 5:
      return (
        <PaymentInfo

          onBack={(val) => {
            setData((i) => ({ ...i, payment: val }));
            setTab(4);
          }}
          data={data.payment}
          onSubmit={(val) => {
            setData((i) => ({ ...i, payment: val }));
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
          onBack={() => {
            setTab(5);
          }}
          onSubmit={() => {
            onSubmit();
          }}
        />
      );
    default:
      return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: 'LufgaMedium',
    fontSize: 18,
    color: '#192234',
  },
});
