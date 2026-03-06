import { useStripe } from '@stripe/stripe-react-native';
import { useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { ArrowLeftIcon, XLogoIcon } from 'phosphor-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import WebView from 'react-native-webview';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { PaymentInfoTypes } from './PaymentInfo';

type Props = {
  extraData: { plan: PaymentInfoTypes['plan'] };
  onSubmit: () => void;
  onBack: () => void;
};

export default function PostListingS({ extraData, onSubmit, onBack }: Props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();
  const handlePress = async () => {
    if (extraData.plan === 'Free') {
      onSubmit();
    } else {
      const res = await Parse.Cloud.run('stripe', { price: 30 });
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'OikoTeck',
        paymentIntentClientSecret: res.clientSecret,
      });
      if (error) {
        // handle error
        return;
      }
      const { error: paymentSheetError } = await presentPaymentSheet();

      if (paymentSheetError) {
        // handle error
        return;
      } else {
        onSubmit();
        // success
      }
    }
  };

  const url = useMemo(() => {
    switch (extraData.plan) {
      case 'Free':
        return 'https://oikoteck.com/mobile/service-plan-terms/free';
      case 'Promote':
        return 'https://oikoteck.com/mobile/service-plan-terms/promote';

      default:
        return 'https://oikoteck.com/mobile/service-plan-terms/free';
    }
  }, [extraData.plan]);

  return (
    <>
      <View style={styles.header}>
        <Pressable
          hitSlop={20}
          onPress={() => {
            onBack();
          }}
        >
          <ArrowLeftIcon color='#192234' size={24} />
        </Pressable>
        <AppText style={styles.headerTitle}>Post a listing</AppText>
        <Pressable hitSlop={20} onPress={() => router.back()}>
          <XLogoIcon color='#192234' size={24} />
        </Pressable>
      </View>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <AppText style={styles.title}>Publish Listing</AppText>
          <AppText style={styles.subtitle}>
            Confirm your details and publish your listing
          </AppText>

          <KeyboardAwareScrollView
            bottomOffset={50}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <AppText style={styles.sectionTitle}>Service Plan Terms</AppText>
            <View style={styles.webviewContainer}>
              <WebView
                source={{
                  uri: url,
                }}
                cacheEnabled
                decelerationRate={0.998}
              />
            </View>
            <Checkbox
              label='I, Walid Smith, understand and agree to the “Service Plan Terms” above associated with this purchase, the Terms and Conditions, and the Privacy Policy.'
              labelStyle={styles.checkboxLabel}
            />
          </KeyboardAwareScrollView>
        </View>
        <View style={styles.footer}>
          <PressableView onPress={handlePress} style={styles.continueBtn}>
            <AppText style={styles.continueBtnText}>
              {extraData.plan === 'Free' ? 'Continue' : 'Pay Now'}
            </AppText>
          </PressableView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 15,
    color: '#575775',
  },
  scrollContent: {
    marginTop: 20,
    flexGrow: 1,
    flexDirection: 'column',
    gap: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  webviewContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  checkboxLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  continueBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  continueBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 18,
    color: 'white',
  },
});
