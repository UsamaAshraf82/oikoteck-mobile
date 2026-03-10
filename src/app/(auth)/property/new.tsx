import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
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
    },
    basic2: {
      bedrooms: 0,
      bathrooms: 0,
      floor: 0,
      special_feature: [],
    },
    basic3: {},
    gallery: {
      agent_icon: false,
    },
    location: {
      exact_location: false,
      marker: {
        lat: 37.9755,
        lng: 23.735,
      },
      center: {
        lat: 37.9755,
        lng: 23.735,
      },
    },
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

  switch (tab) {
    case 0:
      return (
        <View style={styles.container}>
          <Basic1
            onCancel={() => router.back()}
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
            onCancel={() => router.back()}
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
            onCancel={() => router.back()}
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
            onCancel={() => router.back()}
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
            onCancel={() => router.back()}
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
          onCancel={() => router.back()}
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
          onCancel={() => router.back()}
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
