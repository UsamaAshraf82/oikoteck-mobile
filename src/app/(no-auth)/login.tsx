import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
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
    <View className="flex-1">
      {/* Scrollable form */}
      <TopHeader
        onBackPress={() => {
          router.back();
        }}
        title=""
      />

      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View className="mb-20 flex-1 flex-col items-center justify-center">
          <AppText className="mt-20 text-center font-semibold text-3xl">
            Sign in to your account!
          </AppText>
          <AppText className="mt-2">
            Don&apos;t have an account?{' '}
            <Link href="signup" className="text-secondary">
              Sign up
            </Link>
          </AppText>

          <SocialSignin />

          <AppText className="my-14 text-sm text-[#575775]">
            - - - or sign in with email - - -
          </AppText>

          {/* Inputs */}
          <View className="w-full flex-col gap-2">
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
          {/* <View className="w-full flex-row justify-end"> */}
          <Link href="reset-password" className="mt-2 w-full text-right text-sm text-secondary">
            Forgot Password?
          </Link>
          {/* </View> */}
        </View>
      </KeyboardAwareScrollView>

      {/* Fixed Bottom Button */}
      <View className="bg-white px-4 py-4">
        <PressableView
          onPress={handleSubmit(onSubmit, onError)}
          className="h-14 w-full flex-row items-center justify-center rounded-full bg-secondary">
          <AppText className="font-bold text-[15px] text-white">Sign in</AppText>
        </PressableView>
      </View>
    </View>
  );
}

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
