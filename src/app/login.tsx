import blobs from '@/assets/svg/blob.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageBackground } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { z } from 'zod';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import PressableView from '~/components/HOC/PressableView';
import SocialSignin from '~/components/Pages/Auth/SocialSignin';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';

export default function Login() {
  const { addToast } = useToast();
  const router = useRouter();
  const { login, user } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({ resolver: zodResolver(SignInSchema) });

  const onSubmit = (data: SignInValues) => {
    login(data.email, data.password);
  };

  useEffect(() => {
    if (user) {
      router.push('/rent')
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
    <View className="relative flex-1 bg-white">
      <ImageBackground
        source={blobs}
        style={{
          flex: 1,
          filter: 'blur(80px)',
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
        }}
        blurRadius={5}
        contentFit="cover"
      />
      <View className="absolute top-0 w-full flex-1  flex-col justify-between px-6">
        <View className="flex-col items-center justify-center">
          <Text className="mt-20 text-2xl font-semibold">Sign in to your account!</Text>
          <Text className="mt-2">
            Don't have an account?{' '}
            <Link href="signup" className="text-secondary">
              Sign up
            </Link>
          </Text>
          <SocialSignin />
          <Text className="mb-5 mt-5 text-sm text-[#575775]">
            - - - - - - - - - - - or sign in with email - - - - - - - - - - -
          </Text>
          <View className="w-full flex-col gap-2">
            <ControlledTextInput
              control={control}
              name="email"
              label="Email Address"
              autoComplete="email"
              keyboardType="email-address"
            />
            <ControlledTextInput
              control={control}
              name="password"
              label="Password"
              autoComplete="password"
              secureTextEntry
            />
          </View>
        </View>
      </View>
      <View className="absolute bottom-5 w-full px-6">
        <PressableView
          onPress={handleSubmit(onSubmit, onError)}
          className="h-14 w-full flex-row items-center justify-center rounded-full  bg-secondary">
          <Text className="text-[15px] font-bold text-white">Sign in</Text>
        </PressableView>
      </View>
    </View>
  );
}

const SignInSchema = z.object({
  email: z
    .email({
      error: 'Must be a valid email address.',
    })
    .min(1, {
      message: 'Email is required',
    }),

  password: z.string({ error: 'Password is required' }).min(1, {
    message: 'Password is required',
  }),
});

type SignInValues = z.infer<typeof SignInSchema>;
