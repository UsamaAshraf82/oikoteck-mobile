import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { EnvelopeSimpleOpenIcon, PencilSimpleIcon, PhoneIcon, UserIcon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import TopHeader from '~/components/Elements/TopHeader';
import useActivityIndicator from '~/store/useActivityIndicator';
import useSelect from '~/store/useSelectHelper';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';

const EditUser = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TopHeader onBackPress={() => router.back()} title="Edit Profile" />
      <View style={styles.formWrapper}>
        <NameInput />
        <NumberInput />
        <EmailInput />
      </View>
    </View>
  );
};

export default EditUser;

// --- Components ---

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
      user.set('first_name', data.firstName);
      user.set('last_name', data.lastName);
      await user.save();
      addToast({
        type: 'success',
        heading: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }
    stopActivity();
  };

  const onError = () => {
    Object.values(errors).forEach((err: any) => {
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
    <View style={styles.inputRow}>
      <View style={styles.iconContainer}>
        <UserIcon size={16} weight="bold" color="#82065e" />
      </View>
      <View style={styles.inputContent}>
        {isEditing && <AppText style={styles.editTitle}>Update Name</AppText>}
        <AppText style={styles.inputLabel}>Name</AppText>
        <AppText style={styles.inputValue}>
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
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText style={styles.cancelBtnText}>Cancel</AppText>
              </Pressable>
              <Pressable
                style={styles.saveBtn}
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText style={styles.saveBtnText}>Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && (
        <Pressable
          style={styles.editBtn}
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} />
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
        heading: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }
    stopActivity();
  };

  const onError = () => {
    Object.values(errors).forEach((err: any) => {
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
    <View style={styles.inputRow}>
      <View style={styles.iconContainer}>
        <PhoneIcon size={16} weight="bold" color="#82065e" />
      </View>
      <View style={styles.inputContent}>
        {isEditing && <AppText style={styles.editTitle}>Update Number</AppText>}
        <AppText style={styles.inputLabel}>Phone Number</AppText>
        <AppText style={styles.inputValue}>
          + {user?.attributes.country_code} {user?.attributes.phone}
        </AppText>
        {isEditing && (
          <>
            <AppText style={styles.labelBelow}>Phone Number</AppText>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryPicker}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    openSelect({
                      useFlatList: true,
                      label: 'Select Country',
                      options: flags.map((i) => ({
                        label: (
                          <View style={styles.countryOption}>
                            <View style={styles.countryOptionLeft}>
                              {i.flag}
                              <AppText>{i.Country}</AppText>
                            </View>
                            <AppText>+{i.Code}</AppText>
                          </View>
                        ),
                        value: { Code: i.Code, Country: i.Country, ISO: i.ISO },
                      })),
                      value: watch('country'),
                      onPress: (value: any) =>
                        setValue(
                          'country',
                          value.value as { Code: number; Country: string; ISO: string }
                        ),
                    });
                  }}>
                  <View style={styles.flagBox}>
                    <RenderFlagWithCode ISO={watch('country').ISO} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.phoneInputBox}>
                <ControlledTextInput
                  control={control}
                  name="phone"
                  placeholder="Enter your Phone Number"
                  textContentType="telephoneNumber"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText style={styles.cancelBtnText}>Cancel</AppText>
              </Pressable>
              <Pressable
                style={styles.saveBtn}
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText style={styles.saveBtnText}>Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && (
        <Pressable
          style={styles.editBtn}
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} />
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
    .email({ message: 'Must be a valid email address.' }),
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
        heading: 'Profile Updated',
        message: 'Your name has been updated successfully.',
      });
      setIsEditing(false);
    }
    stopActivity();
  };

  const onError = () => {
    Object.values(errors).forEach((err: any) => {
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
    <View style={styles.inputRow}>
      <View style={styles.iconContainer}>
        <EnvelopeSimpleOpenIcon size={16} weight="bold" color="#82065e" />
      </View>
      <View style={styles.inputContent}>
        {isEditing && <AppText style={styles.editTitle}>Update Email</AppText>}
        <AppText style={styles.inputLabel}>Email Address</AppText>
        <AppText style={styles.inputValue}>{user?.attributes.username}</AppText>
        {isEditing && (
          <>
            <ControlledTextInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter your Email Address"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <View style={styles.actionButtons}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => {
                  setIsEditing(false);
                  reset();
                }}>
                <AppText style={styles.cancelBtnText}>Cancel</AppText>
              </Pressable>
              <Pressable
                style={styles.saveBtn}
                onPress={handleSubmit(onSubmit, onError)}>
                <AppText style={styles.saveBtnText}>Save Changes</AppText>
              </Pressable>
            </View>
          </>
        )}
      </View>
      {!isEditing && !user?.attributes.social_signup && (
        <Pressable
          style={styles.editBtn}
          onPress={() => {
            setIsEditing(true);
          }}>
          <PencilSimpleIcon size={16} weight="fill" color={'#acacb9'} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formWrapper: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputRow: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(130, 6, 94, 0.1)',
  },
  inputContent: {
    marginLeft: 16,
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  editTitle: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 18,
    color: '#192234',
  },
  inputLabel: {
    fontSize: 14,
    color: '#9191A1',
  },
  inputValue: {
    fontFamily: 'LufgaMedium',
    fontSize: 16,
    color: '#192234',
  },
  labelBelow: {
    fontSize: 14,
    color: '#9191A1',
    marginBottom: -8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  countryPicker: {
    flex: 2,
  },
  phoneInputBox: {
    flex: 3,
    paddingRight: 4,
  },
  countryOption: {
    width: '91.67%', // 11/12
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryOptionLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  flagBox: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  actionButtons: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cancelBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#192234',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#192234',
    fontFamily: 'LufgaMedium',
  },
  saveBtn: {
    borderRadius: 999,
    backgroundColor: '#82065e',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveBtnText: {
    color: 'white',
    fontFamily: 'LufgaMedium',
  },
  editBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#ebeaec',
  },
});
