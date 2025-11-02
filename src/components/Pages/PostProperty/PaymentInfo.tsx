import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import Checkbox from '~/components/Elements/Checkbox';
import TextInput, { ControlledTextInput } from '~/components/Elements/TextInput';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
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
    resolver: zodResolver(PaymentInfoSchema),
    defaultValues: data,
  });

  const onSubmitInternal = async (data: PaymentInfoTypes) => {
    onSubmit(data);
  };
  const onError = () => {
    Object.values(errors).forEach((err) => {
      if (err?.message) {
        addToast({
          type: 'error',
          heading: 'Validation Error',
          message: err.message,
        });
      }
    });
  };

  return (
    <View className="flex-1 bg-white px-5 pt-5">
      <View className="flex-1">
        <AppText className="font-bold text-2xl">Payments</AppText>
        <AppText className="text-[15px] text-[#575775]">
          Select your option plan and setup payments
        </AppText>
        <KeyboardAvoidingView>
          <ScrollView
            contentContainerClassName="mt-5 flex-grow flex-col gap-4 pb-28"
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <AppText className="font-semibold text-lg">OikoTeck Service Plan</AppText>
            <AppText className="text-sm text-[#575775]">
              Click on a service name to view more details
            </AppText>
            <Checkbox
              labelLast
              label="Free"
              labelClassName="font-light"
              getValue={() => setValue('plan', 'Free')}
              value={watch('plan') === 'Free'}
            />
            <Checkbox
              labelLast
              label="Promote "
              labelClassName="font-light"
              getValue={() => setValue('plan', 'Promote')}
              value={watch('plan') === 'Promote'}
            />
            {watch('plan') === 'Promote' && (
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
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View className="absolute bottom-0 left-0 right-0   px-5 py-4">
        <PressableView
          onPress={handleSubmit(onSubmitInternal, onError)}
          className="h-12 items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-lg text-white">Continue</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const PaymentInfoSchema = z.object({
  plan: z.enum(['Free', 'Promote'], {
    message: 'Plan is Required.',
  }),
  promo: z.string().optional(),
});

export type PaymentInfoTypes = z.infer<typeof PaymentInfoSchema>;
