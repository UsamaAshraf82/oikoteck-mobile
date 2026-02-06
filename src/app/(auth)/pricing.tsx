import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import Grid from '~/components/HOC/Grid';
import { onepricetable } from '~/global/plan_price';
import { thoasandseprator } from '~/utils/number';

const Pricing = () => {
  return (
    <View style={styles.container}>
      <TopHeader onBackPress={() => router.back()} title="Pricing" />
      <View style={styles.header}>
        <View>
          <AppText style={styles.title}>Pricing Breakdown</AppText>
          <AppText style={styles.subTitle}>
            View pricing details about each of the premium services we offer
          </AppText>
        </View>

        <Grid cols={4} style={styles.gridHeader}>
          <AppText style={styles.pointsLabel}>Points</AppText>
          <View style={styles.planCol}>
            <View style={styles.planNameRow}>
              <View style={[styles.dot, { backgroundColor: '#398be9' }]} />
              <AppText style={styles.planName}>Promote +</AppText>
            </View>
            <AppText style={styles.pricePerPointLabel}>Price Per Point</AppText>
          </View>
          <View style={styles.planCol}>
            <View style={styles.planNameRow}>
              <View style={[styles.dot, { backgroundColor: '#e6c623' }]} />
              <AppText style={styles.planName}>Gold</AppText>
            </View>
            <AppText style={styles.pricePerPointLabel}>Price Per Point</AppText>
          </View>
          <View style={styles.planCol}>
            <View style={styles.planNameRow}>
              <View style={[styles.dot, { backgroundColor: '#ff9c46' }]} />
              <AppText style={styles.planName}>Platinum</AppText>
            </View>
            <AppText style={styles.pricePerPointLabel}>Price Per Point</AppText>
          </View>
        </Grid>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {onepricetable.map((i, j) => (
          <Grid cols={4} key={j} style={styles.gridRow}>
            <View>
              <AppText style={styles.rangeText}>
                {thoasandseprator(i.low)}{' '}
                {i.high === Number.MAX_SAFE_INTEGER ? '+' : ' - ' + thoasandseprator(i.high)}
              </AppText>
              <AppText style={styles.pointsSubText}>Points</AppText>
            </View>

            <AppText style={styles.priceText}>€ {i.promote.toFixed(3)}</AppText>
            <AppText style={styles.priceText}>€ {i.gold.toFixed(3)}</AppText>
            <AppText style={styles.priceText}>€ {i.platinum.toFixed(3)}</AppText>
          </Grid>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    fontSize: 14,
    color: '#9191A1',
    marginTop: 4,
  },
  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    marginTop: 16,
    paddingBottom: 8,
  },
  pointsLabel: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: '#192234',
  },
  planCol: {
    flexDirection: 'column',
    gap: 4,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  planName: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
  },
  pricePerPointLabel: {
    fontSize: 10,
    color: '#9191A1',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    paddingVertical: 12,
  },
  rangeText: {
    fontSize: 14,
    color: '#192234',
    fontFamily: 'LufgaMedium',
  },
  pointsSubText: {
    fontSize: 12,
    color: '#9191A1',
  },
  priceText: {
    fontFamily: 'LufgaMedium', // Using Lufga instead of font-mono for consistency if desired, or keep as monospace
    fontSize: 13,
    color: '#192234',
  },
});

export default Pricing;
