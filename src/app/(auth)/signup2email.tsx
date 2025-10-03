import agent from '@/assets/svg/agent.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircleIcon, UserIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import useActivityIndicator from '~/store/useActivityIndicator';
import useSelect from '~/store/useSelectHelper';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

export default function Login() {
  const { addToast } = useToast();
  const { openSelect } = useSelect();
  const { startActivity, stopActivity } = useActivityIndicator();

  const local: { email: string; password: string } = useLocalSearchParams();
  const router = useRouter();
  const { user, signup } = useUser();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupTypes>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      userType: 'regular',
      company_name: '',
      country: { Code: flags[0].Code, Country: flags[0].Country, ISO: flags[0].ISO },
      terms: false,
      privacy: false,
      share_consent: false,
      firstName: '',
      lastName: '',
      phone: '',
      vat: '',
    },
  });

  useEffect(() => {
    if (!local.email || !local.password) {
      router.replace('/signup');
    }
  }, []);

  const onSubmit = async (data: SignupTypes) => {
    startActivity();
    await signup({ ...data, email: local.email, password: local.password });
    stopActivity();
  };

  useEffect(() => {
    if (user) {
      router.push('/rent');
    }
  }, [user]);

  const onError = () => {
    Object.values(errors).forEach((err) => {
      if (err?.message) {
        addToast({
          type: 'error',
          header: 'Validation Error',
          message: err.message,
        });
      }
    });
  };

  return (
    <View className="flex-1">
      <KeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="mb-14 flex-1 flex-col  justify-center">
            <AppText className="mt-5 text-left text-3xl font-semibold" >Setup your profile ✍️</AppText>
            <AppText className="mt-2" >Enter the details below to finish setting up your profile</AppText>
            <View className="mt-5 w-full flex-col gap-2">
              <View className="flex-col gap-2">
                <AppText className="font-medium" >Register As</AppText>
                <Grid cols={2} gap={2}>
                  {[
                    {
                      label: 'Regular User',
                      value: 'regular',
                      icon: <UserIcon color="black" size={35} style={{ width: 30, height: 30 }} />,
                    },
                    {
                      label: 'Real Estate Agent',
                      value: 'agent',
                      icon: <Image source={agent} style={{ width: 35, height: 35 }} />,
                    },
                  ].map((item) => (
                    <TouchableWithoutFeedback
                      key={item.value}
                      onPress={() => setValue('userType', item.value as 'agent' | 'regular')}>
                      <View
                        className={cn(
                          'relative items-center justify-center gap-2 rounded-3xl border py-5',
                          {
                            'border-secondary': item.value === watch('userType'),
                          }
                        )}>
                        {item.icon}
                        <Text>{item.label}</Text>
                        {item.value === watch('userType') && (
                          <View className="absolute right-2 top-2">
                            <CheckCircleIcon
                              color={tailwind.theme.colors.secondary}
                              size={22}
                              weight="fill"
                            />
                          </View>
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </Grid>
              </View>
              <ControlledTextInput
                control={control}
                name="firstName"
                label="First Name"
                autoComplete="name-given"
                placeholder="Enter your First Name"
              />
              <ControlledTextInput
                control={control}
                name="lastName"
                label="Last Name"
                autoComplete="name-family"
                placeholder="Enter your Last Name"
              />
              {watch('userType') === 'agent' && (
                <>
                  <ControlledTextInput
                    control={control}
                    name="company_name"
                    label="Registered Company Name"
                    placeholder="Registered Company Name"
                  />
                  <ControlledTextInput
                    control={control}
                    name="vat"
                    label="VAT"
                    placeholder="EL000000000"
                  />
                </>
              )}

              <AppText className="-mb-2" >Phone Number</AppText>
              <View className="flex-row items-center gap-0.5">
                <View className="w-2/5 ">
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openSelect({
                        useFlatList: true,
                        label: 'Select Country',
                        options: flags.map((i) => ({
                          label: (
                            <View className="w-11/12 flex-row items-center justify-between">
                              <View className="flex-row gap-2">
                                {i.flag}
                                <Text>{i.Country}</Text>
                              </View>
                              <Text>+{i.Code}</Text>
                            </View>
                          ),
                          value: { Code: i.Code, Country: i.Country, ISO: i.ISO },
                        })),
                        value: watch('country'),
                        onPress: (value) =>
                          setValue(
                            'country',
                            value.value as { Code: number; Country: string; ISO: string }
                          ),
                        // title: 'Select Country',
                      });
                    }}>
                    <View className="mt-2 rounded-2xl border border-[#C6CAD2] bg-white px-2 py-3">
                      <RenderFlagWithCode ISO={watch('country').ISO} />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View className="w-3/5 pr-1">
                  <ControlledTextInput
                    control={control}
                    name="phone"
                    // autoComplete="nu"
                    placeholder="Enter your Phone Number"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <ControlledCheckBox
                control={control}
                name="terms"
                label={
                  <>
                    I confirm that I read and I agree with Oikoteck’s{' '}
                    <Link href="/terms-conditions" className="text-secondary">
                      Terms & Conditions
                    </Link>
                  </>
                }
              />
              <ControlledCheckBox
                control={control}
                name="privacy"
                label={
                  <>
                    I confirm that I read and understood Oikoteck’s{' '}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary">
                      Data Protection Notice
                    </Link>{' '}
                    and the{' '}
                    <Link
                      href="/cookie-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary">
                      Cookies Policy
                    </Link>
                  </>
                }
              />
              <ControlledCheckBox
                control={control}
                name="share_consent"
                label="I consent to the sharing of my contact information and search preferences with real estate agents who offer listings which may align with my interests"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View className="bg-white px-6 py-4">
        <PressableView
          onPress={handleSubmit(onSubmit, onError)}
          className="h-14 w-full flex-row items-center justify-center rounded-full  bg-secondary">
          <AppText className="text-[15px] font-bold text-white" >Sign up</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const SignupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required.' }),
    lastName: z.string().min(1, { message: 'Last Name is required.' }),
    phone: z.string().min(1, { message: 'Phone Number is required.' }),
    country: z.object({
      ISO: z.string(),
      Country: z.string(),
      Code: z.number(),
    }),
    userType: z.enum(['regular', 'agent'], {
      error: 'Please select a user type',
    }),
    vat: z.string().optional(),
    company_name: z.string().optional(),
    terms: z.boolean(),
    privacy: z.boolean(),
    share_consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === 'agent') {
      if (!data.vat) {
        ctx.addIssue({
          code: 'custom',
          path: ['vat'],
          message: 'VAT is Required',
        });
      }
      if (!data.company_name) {
        ctx.addIssue({
          code: 'custom',
          path: ['company_name'],
          message: 'Company Name is Required',
        });
      }
    }

    if (!data.terms) {
      ctx.addIssue({
        code: 'custom',
        path: ['terms'],
        message: 'You Must Agree with Terms and Conditions',
      });
    }

    if (!data.privacy) {
      ctx.addIssue({
        code: 'custom',
        path: ['privacy'],
        message: 'You Must Agree with Privacy Policy',
      });
    }
  });

type SignupTypes = z.infer<typeof SignupSchema>;
