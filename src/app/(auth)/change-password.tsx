import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import useActivityIndicator from '~/store/useActivityIndicator';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';

const ChnagePassword = () => {
  const { user } = useUser();
  const router = useRouter();
  const { addToast } = useToast();
  const { startActivity, stopActivity } = useActivityIndicator();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PasswordType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {},
  });

  const onSubmitInternal: SubmitHandler<PasswordType> = async (data) => {
    startActivity();
    if (user)
      try {
        await (user as any).verifyPassword(data.current_password);
        user.setPassword(data.password);

        await user?.save();
        addToast({
          heading: 'Password Changed',
          message:
            'Password is now successfully changed. You can now login with your new password.',
        });
      } catch {
        addToast({
          heading: 'Invalid Password',
          message: 'Your current password is invalid. Please re-enter your password',
        });
      }
    stopActivity();
  };

  const onError = () => {
    Object.values(errors).forEach((err) => {
      console.log(err)
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
    <View className="flex w-full flex-1 flex-col">
      <TopHeader onBackPress={() => router.back()} title="Change Password" />
      <View className="px-4">
        <AppText className="font-bold text-2xl">Change Password 🔒</AppText>
        <AppText className="mb-1 text-sm text-[#575775]">Update your current password here</AppText>
      </View>
      <View className="flex-1 gap-3 px-4 pt-2">
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
          label="Repeat Password"
          secureTextEntry
          placeholder="Repeat New Password"
        />
      </View>
      <View className=" px-5 py-1">
        <Pressable
          className="h-12 items-center justify-center rounded-full bg-secondary"
          onPress={handleSubmit(onSubmitInternal, onError)}>
          <AppText className="font-semibold text-white">Change Password</AppText>
        </Pressable>
      </View>
    </View>
  );
};

export default ChnagePassword;
const PasswordSchema = z
  .object({
    current_password: z
      .string({ error: 'Password is required' })

      .min(1, {
        message: 'Password is required.',
      }),
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

type PasswordType = z.infer<typeof PasswordSchema>;
// const NameInput = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const { user } = useUser();
//   const { startActivity, stopActivity } = useActivityIndicator();
//   const { addToast } = useToast();

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<NameInputTypes>({
//     resolver: zodResolver(NameInputSchema),
//     defaultValues: {
//       firstName: user?.attributes.first_name,
//       lastName: user?.attributes.last_name,
//     },
//   });

//   useEffect(() => {
//     if (user) {
//       reset({
//         firstName: user.attributes.first_name,
//         lastName: user.attributes.last_name,
//       });
//     }
//   }, [isEditing, user]);

//   const onSubmit = async (data: NameInputTypes) => {
//     startActivity();
//     if (user) {
//       console.log('dd', data);
//       user.set('first_name', data.firstName);
//       user.set('last_name', data.lastName);
//       await user.save();
//       addToast({
//         type: 'success',
//         heading: 'Profile Updated',
//         message: 'Your name has been updated successfully.',
//       });
//       setIsEditing(false);
//     }

//     stopActivity();
//   };
//   const onError = () => {
//     Object.values(errors).forEach((err) => {
//       if (err?.message) {
//         addToast({
//           type: 'error',
//           heading: 'Validation Error',
//           message: err.message,
//         });
//       }
//     });
//   };

//   return (
//     <View className=" relative flex-row rounded-3xl border px-4 py-3">
//       <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
//         <UserIcon size={16} weight="bold" color={tailwind.theme.colors.secondary} />
//       </View>
//       <View className="ml-4 flex-1 flex-col gap-2">
//         {isEditing && <AppText className="font-semibold text-lg">Update Name</AppText>}
//         <AppText className="text-sm text-o_gray-200">Name</AppText>
//         <AppText className="font-medium text-base">
//           {user?.attributes.first_name} {user?.attributes.last_name}
//         </AppText>
//         {isEditing && (
//           <>
//             <ControlledTextInput
//               control={control}
//               name="firstName"
//               label="First Name"
//               placeholder="First Name"
//             />
//             <ControlledTextInput
//               control={control}
//               name="lastName"
//               label="Last Name"
//               placeholder="Last Name"
//             />
//             <View className="mt-2 flex-row justify-end gap-4">
//               <Pressable
//                 className="rounded-full border border-primary px-4 py-3"
//                 onPress={() => {
//                   setIsEditing(false);
//                   reset();
//                 }}>
//                 <AppText className="text-primary">Cancel</AppText>
//               </Pressable>
//               <Pressable
//                 className="rounded-full bg-secondary px-4 py-3"
//                 onPress={handleSubmit(onSubmit, onError)}>
//                 <AppText className="text-white">Save Changes</AppText>
//               </Pressable>
//             </View>
//           </>
//         )}
//       </View>
//       {!isEditing && (
//         <Pressable
//           className="absolute right-4 top-3 h-6 w-6 items-center justify-center rounded-full bg-[#ebeaec]"
//           onPress={() => {
//             setIsEditing(true);
//           }}>
//           <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} duotoneColor={'#acacb9'} />
//         </Pressable>
//       )}
//     </View>
//   );
// };
