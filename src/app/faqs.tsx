import { router } from 'expo-router';
import { CaretDownIcon, CaretUpIcon } from 'phosphor-react-native';
import { useState } from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import TopHeader from '~/components/Elements/TopHeader';
import faqs from '~/global/faqs';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';
const Services = () => {
  const [selectedFaq, setSelectedFaq] = useState(-1);
  return (
    <View className="flex-1 bg-white">
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title={'FAQs'}
      />
      <View className="px-5">
        <AppText className="font-semibold text-2xl">Frequently asked Questions 🤔</AppText>
        <AppText className="text-sm text-[#9191A1]">
          Explore Frequently asked Questions about our service plans
        </AppText>
      </View>
      <ScrollView contentContainerClassName="px-5 pb-4 mt-4 gap-2">
        {faqs.map((faq, i) => (
          <TouchableWithoutFeedback
            key={i}
            onPress={() => {

              setSelectedFaq((prev)=>{
                if (prev === i) {
                  return -1;
                }
                return i;
              });
            }}>
            <View
              key={i}
              className={cn('rounded-2xl border border-[#ACACB9]/40 px-3 py-3', {
                'border-2 border-secondary': i === selectedFaq,
              })}>
              <View className="flex-row justify-between">
                <AppText className={cn('font-medium', { 'text-secondary': i === selectedFaq })}>
                  {faq.que}
                </AppText>
                {i === selectedFaq ? (
                  <CaretUpIcon size={20} color={tailwind.theme.colors.secondary} />
                ) : (
                  <CaretDownIcon size={20} color="#ACACB9" />
                )}
              </View>
              {i === selectedFaq && <AppText className="text-sm text-[#575775]">{faq.ans}</AppText>}
            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>
    </View>
  );
};

export default Services;
