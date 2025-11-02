import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import Parse from 'parse/react-native';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
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
  const { user } = useUser();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupTypes>({ resolver: zodResolver(SignupSchema) });

  const onSubmit = async (data: SignupTypes) => {
    startActivity();
    const data_email = data.email.toLowerCase().trim();
    const Query = new Parse.Query('_User');
    Query.equalTo('username', data_email);
    const email = await Query.count();

    if (email === 0) {
      router.push({
        pathname: '/signup2email',
        params: { email: data_email, password: data.password },
      });
    } else {
      addToast({
        heading: 'Registered Account',
        message: 'Account already exists, please click on log in.',
      });
    }
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
          heading: 'Validation Error',
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
       showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
          <View className="mb-14 flex-1 flex-col items-center justify-center">
            <AppText className="mt-20 text-center text-3xl font-semibold">
              Let's create your free account!
            </AppText>
            <AppText className="mt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-secondary">
                Sign In
              </Link>
            </AppText>

            <SocialSignin />
            <AppText className="my-14 text-sm text-[#575775]">
              - - - - - - - - - - - or sign up with email - - - - - - - - - - -
            </AppText>
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
                autoComplete="new-password"
                secureTextEntry
                placeholder="Create your password"
              />
              <ControlledTextInput
                control={control}
                name="confirmPassword"
                label="Password"
                autoComplete="new-password"
                secureTextEntry
                placeholder="Retype your password"
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
    email: z
      .string()
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
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  });
type SignupTypes = z.infer<typeof SignupSchema>;
