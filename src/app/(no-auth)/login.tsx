import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
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

const SignInSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, { message: 'Email is required' })
    .pipe(z.email('Must be a valid email address.')),

  password: z.string({ error: 'Password is required' }).min(1, {
    message: 'Password is required',
  }),
});

type SignInValues = z.infer<typeof SignInSchema>;

const displayNames: Record<keyof SignInValues, string> = {
  email: 'Email address',
  password: 'Password',
};

export default function Login() {
  const { addToast } = useToast();
  const router = useRouter();
  const { startActivity, stopActivity } = useActivityIndicator();
  const { login, user } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(SignInSchema) });

  useEffect(() => {
    if (user) {
      router.push('/rent');
    }
  }, [user]);

  const onSubmit = async (data: SignInValues) => {
    startActivity();
    await login(data.email, data.password);
    stopActivity();
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof SignInValues)[];
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
          <AppText style={styles.title}>Sign in to your account!</AppText>
          <AppText style={styles.subtext}>
            Don&apos;t have an account?{' '}
            <Link href="signup" style={styles.linkText}>
              Sign up
            </Link>
          </AppText>

          <SocialSignin />

          <AppText style={styles.dividerText}>- - - or sign in with email - - -</AppText>

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
              autoComplete="password"
              secureTextEntry
              placeholder="Enter your password"
            />
          </View>
          <Link href="reset-password" style={styles.forgotPassword}>
            Forgot Password?
          </Link>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <PressableView onPress={handleSubmit(onSubmit, onError)} style={styles.submitBtn}>
          <AppText style={styles.submitBtnText}>Sign in</AppText>
        </PressableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
    // experimental_backgroundImage:'url(./assets/svg/blob.svg)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  formWrapper: {
    marginBottom: 80,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 80,
    textAlign: 'center',
    fontFamily: 'LufgaSemiBold',
    fontSize: 30,
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
    marginVertical: 56,
    fontSize: 14,
    color: '#575775',
    fontFamily: 'LufgaRegular',
  },
  inputGroup: {
    width: '100%',
    flexDirection: 'column',
    gap: 8,
  },
  forgotPassword: {
    marginTop: 8,
    width: '100%',
    textAlign: 'right',
    fontSize: 14,
    color: '#82065e',
    fontFamily: 'LufgaMedium',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
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
