import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import z, { RefinementCtx } from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';

const PasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      message: 'Password is required.',
    }),
    password: z
      .string()
      .min(8, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[A-Z]/, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[a-z]/, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      })
      .regex(/[0-9]/, {
        message:
          'Please enter a valid password that is at least 8 characters long, and includes at least one number and one upper-case letter.',
      }),
    confirmPassword: z.string().min(1, {
      message: 'Please re-type your password.',
    }),
  })
  .superRefine((data: any, ctx: RefinementCtx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Your passwords do not match.',
      });
    }
  });

type PasswordValues = z.infer<typeof PasswordSchema>;

const ChangePassword = () => {
  const { user } = useUser();
  const router = useRouter();
  const { addToast } = useToast();
  const { startActivity, stopActivity } = useActivityIndicator();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitInternal: SubmitHandler<PasswordValues> = async (data) => {
    startActivity();
    if (user) {
      try {
        await (user as any).verifyPassword(data.current_password);
        user.setPassword(data.password);

        await user?.save();
        addToast({
          type: 'success',
          heading: 'Password Changed',
          message:
            'Password is now successfully changed. You can now login with your new password.',
        });
      } catch (e: any) {
        addToast({
          type: 'error',
          heading: 'Invalid Password',
          message: e.message || 'Your current password is invalid. Please re-enter your password',
        });
      }
    }
    stopActivity();
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
    <View style={styles.container}>
      <TopHeader onBackPress={() => router.back()} title="" />
      <View style={styles.header}>
        <AppText style={styles.title}>Change Password 🔒</AppText>
        <AppText style={styles.subTitle}>Update your current password here</AppText>
      </View>
      <View style={styles.form}>
        <ControlledTextInput
          control={control}
          name="current_password"
          label="Current Password"
          secureTextEntry
          placeholder="Enter Current Password"
        />
        <ControlledTextInput
          control={control}
          name="password"
          label="New Password"
          secureTextEntry
          placeholder="Enter New Password"
        />
        <ControlledTextInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          secureTextEntry
          placeholder="Repeat New Password"
        />
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.submitBtn} onPress={handleSubmit(onSubmitInternal, onError)}>
          <AppText style={styles.submitBtnText}>Change Password</AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  subTitle: {
    fontSize: 14,
    color: '#575775',
    marginBottom: 4,
    marginTop: 12,
  },
  form: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  submitBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#82065e',
  },
  submitBtnText: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 16,
    color: 'white',
  },
});

export default ChangePassword;
