import agent from '@/assets/svg/agent.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { CheckCircleIcon, UserIcon } from 'phosphor-react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import { emailsAddress } from '~/global';
import useActivityIndicator from '~/store/useActivityIndicator';
import useSelect from '~/store/useSelectHelper';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';
import { User_Type } from '~/type/user';

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
      message: 'Please select a user type',
    }),
    vat: z.string().optional(),
    company_name: z.string().optional(),
    terms: z.boolean(),
    privacy: z.boolean(),
    share_consent: z.boolean(),
  })
  .superRefine((data: SignupTypes, ctx: z.RefinementCtx) => {
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

const displayNames: Record<keyof SignupTypes, string> = {
  company_name: 'Company Name',
  country: 'Country',
  firstName: 'First Name',
  lastName: 'Last Name',
  phone: 'Phone',
  privacy: 'Privacy Policy',
  share_consent: 'Share Consent',
  terms: 'Terms and Conditions',
  userType: 'User Type',
  vat: 'VAT',
};

export default function Signup2Social() {
  const { addToast } = useToast();
  const { openSelect } = useSelect();
  const activity = useActivityIndicator();

  const local = useLocalSearchParams<{ email: string; firstName: string; lastName: string }>();
  const router = useRouter();
  const { user, setUser } = useUser();
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
      firstName: local.firstName || '',
      lastName: local.lastName || '',
      phone: '',
      vat: '',
    },
  });

  useEffect(() => {
    if (!local.email) {
      router.replace('/signup');
    }
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/rent');
    }
  }, [user]);

  const onSubmit = async (formData: SignupTypes) => {
    activity.startActivity();
    const currentUser = Parse.User.current();

    if (currentUser) {
      currentUser.set('username', local.email.toLowerCase());
      currentUser.set('email', local.email.toLowerCase());
      currentUser.set('first_name', formData.firstName);
      currentUser.set('phone', formData.phone);
      currentUser.set('last_name', formData.lastName);
      currentUser.set('country_code', formData.country.Code);
      currentUser.set('country', formData.country.Country);
      currentUser.set('country_iso', formData.country.ISO);
      currentUser.set('user_type', formData.userType);
      currentUser.set('vat', formData.vat);
      currentUser.set('company_name', formData.company_name);
      currentUser.set('terms', formData.terms);
      currentUser.set('privacy', formData.privacy);
      currentUser.set(
        'share_consent',
        formData.userType === 'agent' ? true : formData.share_consent
      );
      currentUser.set('social_signup', true);

      const customACL = new Parse.ACL();
      customACL.setPublicReadAccess(true);
      customACL.setPublicWriteAccess(true);

      currentUser.setACL(customACL);

      await currentUser.save();

      await fetch(emailsAddress, {
        method: 'POST',
        body: JSON.stringify({ email: 'account_greetings', id: currentUser?.id }),
      });

      setUser(currentUser as Parse.User<User_Type>);
    }
    activity.stopActivity();
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof SignupTypes)[];
    for (let index = 0; index < keys.length; index++) {
      const element = errors[keys[index]];
      if (element?.message) {
        addToast({
          type: 'error',
          heading: displayNames[keys[index]],
          message: element.message,
        });
      }
    }
  };

  const selectedUserType = watch('userType');

  return (
    <View style={styles.container}>
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title=""
      />
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.formWrapper}>
          <AppText style={styles.title}>Setup your profile ✍️</AppText>
          <AppText style={styles.subtext}>
            Enter the details below to finish setting up your profile
          </AppText>

          <View style={styles.inputGroup}>
            <View style={styles.userTypeWrapper}>
              <AppText style={styles.label}>Register As</AppText>
              <Grid cols={2} gap={16}>
                {[
                  {
                    label: 'Regular User',
                    value: 'regular',
                    icon: <UserIcon color="#192234" size={30} />,
                  },
                  {
                    label: 'Real Estate Agent',
                    value: 'agent',
                    icon: <Image source={agent} style={styles.agentIcon} />,
                  },
                ].map((item) => (
                  <TouchableWithoutFeedback
                    key={item.value}
                    onPress={() => setValue('userType', item.value as 'agent' | 'regular')}>
                    <View
                      style={[
                        styles.userTypeCard,
                        selectedUserType === item.value && styles.userTypeCardActive,
                      ]}>
                      {item.icon}
                      <AppText style={styles.userTypeLabel}>{item.label}</AppText>
                      {selectedUserType === item.value && (
                        <View style={styles.checkIcon}>
                          <CheckCircleIcon color="#82065e" size={22} weight="fill" />
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
              placeholder="Enter your first name"
            />
            <ControlledTextInput
              control={control}
              name="lastName"
              label="Last Name"
              autoComplete="name-family"
              placeholder="Enter your last name"
            />

            {selectedUserType === 'agent' && (
              <>
                <ControlledTextInput
                  control={control}
                  name="company_name"
                  label="Registered Company Name"
                  placeholder="Registered company name"
                />
                <ControlledTextInput
                  control={control}
                  name="vat"
                  label="VAT"
                  placeholder="EL000000000"
                />
              </>
            )}

            <AppText style={styles.phoneLabel}>Phone Number</AppText>
            <View style={styles.phoneRow}>
              <View style={styles.countryPickerWrapper}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    openSelect({
                      useFlatList: true,
                      label: 'Select Country',
                      options: flags.map((i) => ({
                        label: (
                          <View style={styles.countryOption}>
                            <View style={styles.countryInfo}>
                              {i.flag}
                              <AppText style={styles.countryName}>{i.Country}</AppText>
                            </View>
                            <AppText style={styles.countryCode}>+{i.Code}</AppText>
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
                    });
                  }}>
                  <View style={styles.countryPicker}>
                    <RenderFlagWithCode ISO={watch('country').ISO} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.phoneInputWrapper}>
                <ControlledTextInput
                  control={control}
                  name="phone"
                  placeholder="Enter your phone number"
                  textContentType="telephoneNumber"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.checkboxGroup}>
              <ControlledCheckBox
                control={control}
                alignTop
                name="terms"
                label={
                  <AppText style={styles.checkboxText}>
                    I confirm that I read and I agree with Oikoteck’s{' '}
                    <Link href="/terms-conditions" style={styles.linkText}>
                      Terms & Conditions
                    </Link>{' '}
                    *
                  </AppText>
                }
              />
              <ControlledCheckBox
                control={control}
                alignTop
                name="privacy"
                label={
                  <AppText style={styles.checkboxText}>
                    I confirm that I read and understood Oikoteck’s{' '}
                    <Link href="/privacy-policy" style={styles.linkText}>
                      Data Protection Notice
                    </Link>{' '}
                    and the{' '}
                    <Link href="/cookie-policy" style={styles.linkText}>
                      Cookies Policy
                    </Link>{' '}
                    *
                  </AppText>
                }
              />
              <ControlledCheckBox
                control={control}
                alignTop
                name="share_consent"
                label={
                  <AppText style={styles.checkboxText}>
                    I consent to the sharing of my contact information and search preferences with
                    real estate agents who offer listings which may align with my interests
                  </AppText>
                }
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmit, onError)} style={styles.submitBtn}>
          <AppText style={styles.submitBtnText}>Sign up</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  formWrapper: {
    marginBottom: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 30,
    color: '#192234',
    textAlign: 'left',
  },
  subtext: {
    marginTop: 8,
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  inputGroup: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'column',
    gap: 16,
  },
  userTypeWrapper: {
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
  },
  userTypeCard: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E9E9EC',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  userTypeCardActive: {
    borderColor: '#82065e',
    borderWidth: 2,
  },
  agentIcon: {
    width: 35,
    height: 35,
  },
  userTypeLabel: {
    fontFamily: 'LufgaRegular',
    fontSize: 13,
    color: '#192234',
  },
  checkIcon: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  phoneLabel: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#192234',
    marginBottom: -8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryPickerWrapper: {
    width: '38%',
  },
  countryPicker: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  checkboxGroup: {
    marginTop: 8,
    flexDirection: 'column',
    gap: 12,
  },
  checkboxText: {
    fontFamily: 'LufgaRegular',
    fontSize: 13,
    color: '#575775',
    lineHeight: 18,
  },
  linkText: {
    color: '#82065e',
    fontFamily: 'LufgaBold',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitBtn: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#82065e',
  },
  submitBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 15,
    color: 'white',
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryName: {
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#192234',
  },
  countryCode: {
    fontFamily: 'LufgaMedium',
    fontSize: 14,
    color: '#575775',
  },
});
