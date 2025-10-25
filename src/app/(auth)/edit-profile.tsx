import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon, EnvelopeSimpleOpenIcon, PencilSimpleIcon, PhoneIcon, UserIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, TouchableWithoutFeedback, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import useActivityIndicator from '~/store/useActivityIndicator';
import useSelect from '~/store/useSelectHelper';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';
import tailwind from '~/utils/tailwind';

const EditUser = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View className="flex w-full flex-1 flex-col">
      <View className="relative h-16 flex-row items-center justify-center">
        <Pressable
          className="absolute left-4"
          onPress={() => {
            router.back();
          }}>
          <ArrowLeftIcon size={16} weight="bold" />
        </Pressable>
        <AppText className="font-semibold ">Edit Profile</AppText>
      </View>
      <View className="flex- gap-3  px-4 pt-2">
        <NameInput />
        <NumberInput />
        <EmailInput />
      </View>
    </View>
  );
};

export default EditUser;

const NameInputSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required.' }),
  lastName: z.string().min(1, { message: 'Last Name is required.' }),
});

type NameInputTypes = z.infer<typeof NameInputSchema>;

const NameInput = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const { startActivity, stopActivity } = useActivityIndicator();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NameInputTypes>({
    resolver: zodResolver(NameInputSchema),
    defaultValues: {
      firstName: user?.attributes.first_name,
      lastName: user?.attributes.last_name,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.attributes.first_name,
        lastName: user.attributes.last_name,
      });
    }
  }, [isEditing, user]);

  const onSubmit = async (data: NameInputTypes) => {
    startActivity();
    if (user) {
      console.log('dd', data);
      user.set('first_name', data.firstName);
      user.set('last_name', data.lastName);
      await user.save();
      addToast({
        type: 'success',
        header: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }

    stopActivity();
  };
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
    <View className=" relative flex-row rounded-3xl border px-4 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
        <UserIcon size={16} weight="bold" color={tailwind.theme.colors.secondary} />
      </View>
      <View className="ml-4 flex-1 flex-col gap-2">
        {isEditing && <AppText className="font-semibold text-lg">Update Name</AppText>}
        <AppText className="text-sm text-o_gray-200">Name</AppText>
        <AppText className="font-medium text-base">
          {user?.attributes.first_name} {user?.attributes.last_name}
        </AppText>
        {isEditing && (
          <>
            <ControlledTextInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="First Name"
            />
            <ControlledTextInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
            />
            <View className="mt-2 flex-row justify-end gap-4">
              <Pressable
                className="rounded-full border border-primary px-4 py-3"
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText className="text-primary">Cancel</AppText>
              </Pressable>
              <Pressable
                className="rounded-full bg-secondary px-4 py-3"
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText className="text-white">Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && (
        <Pressable
          className="absolute right-4 top-3 h-6 w-6 items-center justify-center rounded-full bg-[#ebeaec]"
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} duotoneColor={'#acacb9'} />
        </Pressable>
      )}
    </View>
  );
};

const NumberInputSchema = z.object({
  phone: z.string().min(1, { message: 'Phone Number is required.' }),
  country: z.object({
    ISO: z.string(),
    Country: z.string(),
    Code: z.number(),
  }),
});

type NumberInputTypes = z.infer<typeof NumberInputSchema>;
const NumberInput = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const { startActivity, stopActivity } = useActivityIndicator();
  const { addToast } = useToast();
  const { openSelect } = useSelect();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NumberInputTypes>({
    resolver: zodResolver(NumberInputSchema),
    defaultValues: {
      country: {
        Code: user?.attributes.country_code,
        Country: user?.attributes.country,
        ISO: user?.attributes.country_iso,
      },

      phone: user?.attributes.phone,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        country: {
          Code: user?.attributes.country_code,
          Country: user?.attributes.country,
          ISO: user?.attributes.country_iso,
        },

        phone: user?.attributes.phone,
      });
    }
  }, [isEditing, user]);

  const onSubmit = async (data: NumberInputTypes) => {
    startActivity();
    if (user) {
      user.set('country', data.country.Country);
      user.set('country_code', data.country.Code);
      user.set('country_iso', data.country.ISO);
      user.set('phone', data.phone);
      await user.save();
      addToast({
        type: 'success',
        header: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }

    stopActivity();
  };
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
    <View className=" relative flex-row rounded-3xl border px-4 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
        <PhoneIcon size={16} weight="bold" color={tailwind.theme.colors.secondary} />
      </View>
      <View className="ml-4 flex-1 flex-col gap-2">
        {isEditing && <AppText className="font-semibold text-lg">Update Number</AppText>}
        <AppText className="text-sm text-o_gray-200">Phone Number</AppText>
        <AppText className="font-medium text-base">
          + {user?.attributes.country_code} {user?.attributes.phone}
        </AppText>
        {isEditing && (
          <>
            <AppText className="-mb-2">Phone Number</AppText>
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
                              <AppText>{i.Country}</AppText>
                            </View>
                            <AppText>+{i.Code}</AppText>
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
            <View className="mt-2 flex-row justify-end gap-4">
              <Pressable
                className="rounded-full border border-primary px-4 py-3"
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText className="text-primary">Cancel</AppText>
              </Pressable>
              <Pressable
                className="rounded-full bg-secondary px-4 py-3"
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText className="text-white">Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && (
        <Pressable
          className="absolute right-4 top-3 h-6 w-6 items-center justify-center rounded-full bg-[#ebeaec]"
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} duotoneColor={'#acacb9'} />
        </Pressable>
      )}
    </View>
  );
};

const EmailInputSchema = z.object({
  email: z
    .string()
    .toLowerCase()
    .trim()
    .min(1, { message: 'Email is required' })
    .pipe(z.email('Must be a valid email address.')),
});

type EmailInputTypes = z.infer<typeof EmailInputSchema>;
const EmailInput = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useUser();
  const { startActivity, stopActivity } = useActivityIndicator();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailInputTypes>({
    resolver: zodResolver(EmailInputSchema),
    defaultValues: {
      email: user?.attributes.username,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user?.attributes.username,
      });
    }
  }, [isEditing, user]);

  const onSubmit = async (data: EmailInputTypes) => {
    startActivity();
    if (user) {
      user.set('username', data.email.toLowerCase().trim());
      user.set('email', data.email.toLowerCase().trim());
      await user.save();
      addToast({
        type: 'success',
        header: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }

    stopActivity();
  };
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
    <View className=" relative flex-row rounded-3xl border px-4 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
        <EnvelopeSimpleOpenIcon size={16} weight="bold" color={tailwind.theme.colors.secondary} />
      </View>
      <View className="ml-4 flex-1 flex-col gap-2">
        {isEditing && <AppText className="font-semibold text-lg">Update Email</AppText>}
        <AppText className="text-sm text-o_gray-200">Email Address</AppText>
        <AppText className="font-medium text-base">{user?.attributes.username}</AppText>
        {isEditing && (
          <>
            <ControlledTextInput
              control={control}
              name="email"
              // autoComplete="nu"
              label="Email Address"
              placeholder="Enter your Email Address"
              textContentType="emailAddress"
              keyboardType="email-address"
            />

            <View className="mt-2 flex-row justify-end gap-4">
              <Pressable
                className="rounded-full border border-primary px-4 py-3"
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText className="text-primary">Cancel</AppText>
              </Pressable>
              <Pressable
                className="rounded-full bg-secondary px-4 py-3"
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText className="text-white">Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && !user?.attributes.social_signup && (
        <Pressable
          className="absolute right-4 top-3 h-6 w-6 items-center justify-center rounded-full bg-[#ebeaec]"
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} duotoneColor={'#acacb9'} />
        </Pressable>
      )}
    </View>
  );
};
