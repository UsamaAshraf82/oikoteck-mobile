import { useStripe } from '@stripe/stripe-react-native';
import Parse from 'parse/react-native';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import WebView from 'react-native-webview';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { PaymentInfoTypes } from './PaymentInfo';

type Props = { extraData: { plan: PaymentInfoTypes['plan'] }; onSubmit: () => void };

export default function PostListingS({ extraData, onSubmit }: Props) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="font-bold text-2xl">Publish Listing</AppText>
        <AppText className="text-[15px] text-[#575775]">
          Confirm your details and publish your listing
        </AppText>

          <KeyboardAwareScrollView    bottomOffset={50} contentContainerClassName="mt-5 flex-grow flex-col gap-4 pb-28" showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <AppText className="font-semibold text-lg">Service Plan Terms</AppText>
            <WebView />
            <Checkbox label="I, Walid Smith, understand and agree to the “Service Plan Terms” above associated with this purchase, the Terms and Conditions, and the Privacy Policy." />
          </KeyboardAwareScrollView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={async () => {
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
                return
              }
              const { error: paymentSheetError } = await presentPaymentSheet();

              if (paymentSheetError) {
                // handle error
                return
              } else {
                onSubmit();
                // success
              }
            }
          }}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">
            {extraData.plan === 'Free' ? 'Continue' : 'Pay Now'}
          </AppText>
        </PressableView>
      </View>
    </View>
  );
}
