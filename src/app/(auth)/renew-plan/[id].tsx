import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DateTime } from 'luxon';
import Parse from 'parse/react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PropertyCard from '~/components/Cards/PropertyCardTable';
import AppText from '~/components/Elements/AppText';
import TextInput from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';

const date = new Date();
date.setMonth(date.getMonth() + 1);

const RenewPlan = () => {
  const { addToast } = useToast();
  const router = useRouter();
  const activity = useActivityIndicator();
  const local = useLocalSearchParams<{ id: string }>();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', local.id],
    queryFn: async () => {
      const query = new Parse.Query('Property');
      query.equalTo('objectId', local.id);
      query.include('owner');

      const result = (await query.first({
        json: true,
      })) as unknown as Property_Type;

      return result;
    },
    enabled: !!local.id,
  });

  const onSubmit = async () => {
    activity.startActivity();

    try {
      if (!local.id) return;
      const query = new Parse.Query('Property');
      const pro = await query.get(local.id);
      pro.set('visible', false);
      pro.set('status', 'Pending Approval');
      pro.set('flag', 'RENEW');
      pro.set('flag_time', new Date());
      await pro.save();

      addToast({
        heading: 'Listing Under Review',
        message: 'Your listing is currently being reviewed by OikoTeck customer service team. You will be notified shortly of its approval status.',
      });
      activity.stopActivity();
      router.push('/account');
    } catch (e: any) {
      activity.stopActivity();
      addToast({
        type: 'error',
        heading: 'Error',
        message: e.message || 'Failed to renew membership.',
      });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#82065e" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <TopHeader title="Renew Membership" onBackPress={() => router.back()} />
        <View style={styles.emptyContainer}>
          <AppText style={styles.subTitle}>Property not found.</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopHeader
        title="Renew Membership"
        onBackPress={() => {
          router.back();
        }}
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <AppText style={styles.mainTitle}>Membership Renewal</AppText>
          <AppText style={styles.subTitle}>Manage and renew your membership here.</AppText>
        </View>

        <PropertyCard property={property} type="change_plan" />

        <View style={styles.inputSection}>
          <TextInput
            label="Membership Renewal Through"
            value={DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED)}
            readOnly
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PressableView
          onPress={onSubmit}
          style={styles.submitBtn}>
          <AppText style={styles.submitBtnText}>Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  headerSection: {
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
    marginTop: 4,
  },
  inputSection: {
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: 'white',
  },
  submitBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: 'white',
  },
});

export default RenewPlan;
