import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import TextInput, { ControlledTextInput } from '~/components/Elements/TextInput';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';

type Props = { data: Partial<PaymentInfoTypes>; onSubmit: (data: PaymentInfoTypes) => void };

export default function PaymentInfo({ data, onSubmit }: Props) {
  const { addToast } = useToast();

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentInfoTypes>({
    resolver: zodResolver(PaymentInfoSchema) as any,
    defaultValues: data,
  });

  const onSubmitInternal = async (formData: PaymentInfoTypes) => {
    onSubmit(formData);
  };

  const onError = () => {
    Object.values(errors).forEach((err: any) => {
      if (err?.message) {
        addToast({
          type: 'error',
          heading: 'Validation Error',
          message: err.message,
        });
      }
    });
  };

  const selectedPlan = watch('plan');

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <AppText style={styles.title}>Payments</AppText>
        <AppText style={styles.subtitle}>
          Select your option plan and setup payments
        </AppText>
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <AppText style={styles.sectionTitle}>OikoTeck Service Plan</AppText>
          <AppText style={styles.sectionSubtitle}>
            Click on a service name to view more details
          </AppText>
          <Checkbox
            labelLast
            label="Free"
            labelStyle={styles.checkboxLabel}
            getValue={() => setValue('plan', 'Free')}
            value={selectedPlan === 'Free'}
          />
          <Checkbox
            labelLast
            label="Promote "
            labelStyle={styles.checkboxLabel}
            getValue={() => setValue('plan', 'Promote')}
            value={selectedPlan === 'Promote'}
          />
          {selectedPlan === 'Promote' && (
            <>
              <ControlledTextInput
                control={control}
                name="promo"
                label="Promo Code"
                placeholder="Promo Code"
              />
              <TextInput label="One-Time Payment" value="30 €" readOnly />
            </>
          )}
        </KeyboardAwareScrollView>
      </View>
      <View style={styles.footer}>
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          style={styles.continueBtn}>
          <AppText style={styles.continueBtnText}>Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  sectionSubtitle: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  checkboxLabel: {
    fontFamily: 'LufgaLight',
    fontSize: 16,
    color: '#192234',
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

const PaymentInfoSchema = z.object({
  plan: z.enum(['Free', 'Promote'], {
    message: 'Plan is Required.',
  }),
  promo: z.string().optional(),
});

export type PaymentInfoTypes = z.infer<typeof PaymentInfoSchema>;
