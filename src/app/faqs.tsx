import { router } from 'expo-router';
import { CaretDownIcon, CaretUpIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import faqs from '~/global/faqs';

const Faqs = () => {
  const [selectedFaq, setSelectedFaq] = useState(-1);
  return (
    <View style={styles.container}>
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={'FAQs'}
      />
      <View style={styles.titleWrapper}>
        <AppText style={styles.heading}>Frequently asked Questions 🤔</AppText>
        <AppText style={styles.subHeading}>
          Explore Frequently asked Questions about our service plans
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {faqs.map((faq, i) => (
          <TouchableWithoutFeedback
            key={i}
            onPress={() => {
              setSelectedFaq((prev) => (prev === i ? -1 : i));
            }}>
            <View style={[styles.faqCard, i === selectedFaq && styles.faqCardActive]}>
              <View style={styles.faqHeader}>
                <AppText style={[styles.faqQuestion, i === selectedFaq && styles.faqActiveText]}>
                  {faq.que}
                </AppText>
                {i === selectedFaq ? (
                  <CaretUpIcon size={20} color="#82065e" />
                ) : (
                  <CaretDownIcon size={20} color="#ACACB9" />
                )}
              </View>
              {i === selectedFaq && <AppText style={styles.faqAnswer}>{faq.ans}</AppText>}
            </View>
          </TouchableWithoutFeedback>
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
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#9191A1',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: 16,
    gap: 12,
  },
  faqCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(172, 172, 185, 0.4)',
    padding: 16,
    backgroundColor: '#fff',
  },
  faqCardActive: {
    borderWidth: 2,
    borderColor: '#82065e',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontFamily: 'LufgaMedium',
    fontSize: 16,
    color: '#192234',
    flex: 1,
    marginRight: 10,
  },
  faqActiveText: {
    color: '#82065e',
  },
  faqAnswer: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
    marginTop: 12,
    lineHeight: 20,
  },
});

export default Faqs;
