import blobs from '@/assets/svg/blobs_2.svg';
import { ImageBackground } from 'expo-image';
import { Link, router } from 'expo-router';
import { CheckIcon, XIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import { plans } from '~/global/plan';

const Services = () => {
  const [plan, setPlan] = useState('');
  return (
    <View style={styles.container}>
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={'Services'}
      />
      <View style={styles.titleWrapper}>
        <AppText style={styles.heading}>Choose a Plan 📄</AppText>
        <AppText style={styles.subHeading}>
          Discover how our Innovative approach can save you money and boost your business
          performance!
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {plans.map((i, j) => (
          <TouchableWithoutFeedback
            key={j}
            onPress={() => {
              setPlan(i.name);
            }}>
            <View style={[styles.planCard, plan === i.name && styles.planCardActive]}>
              {plan === i.name && (
                <ImageBackground
                  source={blobs}
                  style={styles.blobBackground}
                  blurRadius={50}
                  contentFit="fill"
                />
              )}
              <View style={styles.planCardInner}>
                <View style={styles.planHeader}>
                  <View
                    style={[
                      styles.pkgColorCircle,
                      { backgroundColor: i.pkgColor.split('-')[1] || i.pkgColor },
                    ]}
                  />
                  <AppText style={styles.planName}>{i.name}</AppText>
                </View>
                <View style={styles.priceRow}>
                  <AppText style={styles.priceValue}>{i.price[0]}</AppText>
                  <AppText style={styles.priceUnit}>{i.price[1]}</AppText>
                </View>
                <AppText style={styles.description}>{i.description}</AppText>
                <View style={styles.featuresList}>
                  {i.features.map((f, featureIdx) => (
                    <View key={i.name + '-' + featureIdx} style={styles.featureItemWrapper}>
                      {i.name === 'Free' && (featureIdx === 2 || featureIdx === 1) ? (
                        <View style={styles.featureItem}>
                          <XIcon color="#CCCFD6" size={18} />
                          <AppText style={styles.featureTextDisabled}>{f}</AppText>
                        </View>
                      ) : (
                        <View style={styles.featureItem}>
                          <CheckIcon color="#575775" size={18} />
                          <AppText style={styles.featureText}>{f}</AppText>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
                {['Promote +', 'Gold', 'Platinum'].includes(i.name) && (
                  <View style={styles.pricingLinkWrapper}>
                    <Link href={'/pricing'} style={styles.pricingLink}>
                      Access Pricing Options
                    </Link>
                  </View>
                )}
                {plan === i.name && (
                  <View style={styles.checkBadge}>
                    <CheckIcon color="white" weight="bold" size={16} />
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
      {plan && (
        <View style={styles.footer}>
          <Pressable
            style={styles.selectBtn}
            onPress={() => {
              if (['Free', 'Promote'].includes(plan)) {
                router.push('/property/new');
              } else {
                router.push('/start-membership');
              }
            }}>
            <AppText style={styles.selectBtnText}>Select {plan} Plan</AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  heading: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 24,
    color: '#192234',
  },
  subHeading: {
    fontSize: 14,
    color: '#9191A1',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  planCard: {
    position: 'relative',
    marginTop: 20,
    overflow: 'hidden',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  planCardActive: {
    borderWidth: 2,
    borderColor: '#82065e',
  },
  blobBackground: {
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  planCardInner: {
    position: 'relative',
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pkgColorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  planName: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceValue: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  priceUnit: {
    fontFamily: 'LufgaMedium',
    fontSize: 18,
    color: '#75758A',
  },
  description: {
    fontSize: 14,
    color: '#575775',
  },
  featuresList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItemWrapper: {
    // optional refinement
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#575775',
  },
  featureTextDisabled: {
    fontSize: 14,
    color: '#CCCFD6',
  },
  pricingLinkWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pricingLink: {
    fontFamily: 'LufgaMedium',
    color: '#82065e',
  },
  checkBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
    padding: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  selectBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#82065e',
  },
  selectBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default Services;
