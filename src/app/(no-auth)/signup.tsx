import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import PressableView from '~/components/HOC/PressableView';
import SocialSignin from '~/components/Pages/Auth/SocialSignin';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';

const SignupSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .toLowerCase()
      .trim()
      .min(1, { message: 'Email is required' })
      .pipe(z.email('Must be a valid email address.')),

    password: z
      .string({ error: 'Password is required' })
      .min(8, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[A-Z]/g, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[a-z]/g, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[0-9]/g, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      }),
    confirmPassword: z.string({
      error: 'Please re-type your password.',
    }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  });

type SignupTypes = z.infer<typeof SignupSchema>;

const displayNames: Record<keyof SignupTypes, string> = {
  email: 'Email address',
  password: 'Password',
  confirmPassword: 'Confirm password',
};

export default function Signup() {
  const { addToast } = useToast();
  const router = useRouter();
  const activity = useActivityIndicator();
  const { user } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupTypes>({ resolver: zodResolver(SignupSchema) });

  const onSubmit = async (formData: SignupTypes) => {
    activity.startActivity();
    const data_email = formData.email.toLowerCase().trim();
    const Query = new Parse.Query('_User');
    Query.equalTo('username', data_email);
    const emailCount = await Query.count();

    if (emailCount === 0) {
      router.push({
        pathname: '/signup2email',
        params: { email: data_email, password: formData.password },
      });
    } else {
      addToast({
        heading: 'Registered Account',
        message: 'Account already exists, please click on log in.',
      });
    }
    activity.stopActivity();
  };

  useEffect(() => {
    if (user) {
      router.push('/rent');
    }
  }, [user]);

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
          <AppText style={styles.title}>Let's create your free account!</AppText>
          <AppText style={styles.subtext}>
            Already have an account?{' '}
            <Link href="/login" style={styles.linkText}>
              Sign In
            </Link>
          </AppText>

          <SocialSignin />
          <AppText style={styles.dividerText}>
            - - - - - - or sign up with email - - - - - -
          </AppText>
          <View style={styles.inputGroup}>
            <ControlledTextInput
              control={control}
              name="email"
              label="Email Address"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Enter your email address"
            />
            <ControlledTextInput
              control={control}
              name="password"
              label="Password"
              autoComplete="new-password"
              secureTextEntry
              placeholder="Create your password"
            />
            <ControlledTextInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              autoComplete="new-password"
              secureTextEntry
              placeholder="Retype your password"
            />
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
    // backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  formWrapper: {
    marginBottom: 56, // mb-14
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 80, // mt-20
    textAlign: 'center',
    fontFamily: 'LufgaSemiBold',
    fontSize: 28, // Scaled down slightly for better fit
    color: '#192234',
  },
  subtext: {
    marginTop: 8,
    fontFamily: 'LufgaRegular',
    fontSize: 14,
    color: '#575775',
  },
  linkText: {
    color: '#82065e',
    fontFamily: 'LufgaBold',
  },
  dividerText: {
    marginVertical: 48, // Reduced from original my-14 for better layout balance
    fontSize: 12,
    color: '#575775',
    fontFamily: 'LufgaRegular',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 12,
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 24, // px-6
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
});
