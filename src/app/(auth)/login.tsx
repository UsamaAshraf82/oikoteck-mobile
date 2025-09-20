import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { z } from 'zod';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import KeyboardAvoidingView from '~/components/HOC/KeyboardAvoidingView';
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

  const onSubmit = async (data: SignInValues) => {
    startActivity();
    await login(data.email, data.password);
    stopActivity();
  };

  useEffect(() => {
    if (user) {
      router.push('/rent');
    }
  }, [user]);

  const onError = () => {
    // Collect first error message and show as toast
    // const errorsArray = Object.values(errors);

    Object.values(errors).forEach((err) => {
      if (err?.message) {
        addToast({
          type: 'error',
          header: 'Validation Error',
          message: err.message,
        });
      }
    });
    // if (firstError?.message) {
    //   // Toast.show({
    //   //   type: "error",
    //   //   text1: "Validation Error",
    //   //   text2: firstError.message,
    //   // });
    // }
  };

  return (
    <View className="flex-1">
      {/* Scrollable form */}
      <KeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="mb-20 flex-1 flex-col items-center justify-center">
            <Text className="mt-20 text-center text-3xl font-semibold">
              Sign in to your account!
            </Text>
            <Text className="mt-2">
              Don&apos;t have an account?{' '}
              <Link href="signup" className="text-secondary">
                Sign up
              </Link>
            </Text>

            <SocialSignin />

            <Text className="my-14 text-sm text-[#575775]">- - - or sign in with email - - -</Text>

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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Button */}
      <View className="bg-white px-6 py-4">
        <PressableView
          onPress={handleSubmit(onSubmit, onError)}
          className="h-14 w-full flex-row items-center justify-center rounded-full bg-secondary">
          <Text className="text-[15px] font-bold text-white">Sign in</Text>
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
