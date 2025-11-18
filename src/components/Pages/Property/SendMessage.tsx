'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Modal from 'react-native-modal';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
import { emailsAddress } from '~/global';
import useActivityIndicator from '~/store/useActivityIndicator';
import useSelect from '~/store/useSelectHelper';
import { useToast } from '~/store/useToast';
import useUser from '~/store/useUser';
import { Property_Type } from '~/type/property';
import { deviceHeight } from '~/utils/global';
type SendOfferModalType = {
  onClose: () => void;
  property: Property_Type;
};

const SendMessage = ({ onClose, property }: SendOfferModalType) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const { openSelect } = useSelect();

  const { startActivity, stopActivity } = useActivityIndicator();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SendOfferValues>({
    resolver: zodResolver(SendOfferSchema),
    defaultValues: {
      country: { Code: flags[0].Code, Country: flags[0].Country, ISO: flags[0].ISO },
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      message: 'I would like to know more about this property.',
    },
  });

  const onSubmit: SubmitHandler<SendOfferValues> = async (data) => {
    startActivity();
    const myNewObject = new Parse.Object('Messages');
    myNewObject.set('Property', {
      __type: 'Pointer',
      className: 'Property',
      objectId: property.objectId,
    });
    myNewObject.set('User', user);
    myNewObject.set('owner', property.owner);
    myNewObject.set('first_name', data.firstName);
    myNewObject.set('last_name', data.lastName);
    myNewObject.set('listing_type', property.listing_for);
    if (data.phone) {
      myNewObject.set('phone', data.country.Code + ' ' + data.phone);
    }
    myNewObject.set('email', data.email.toLowerCase());

    myNewObject.set('message', data.message);

    myNewObject.set('read', false);

    await myNewObject.save();
    stopActivity();
    addToast({
      heading: 'Message submission',
      message: 'Your message is now sent. Listing owner will contact you soon',
    });
    await fetch(emailsAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: 'message_owner',
        id: property.objectId,
        sender: data.firstName + ' ' + data.lastName,
        message: data.message,
        email_address: data.email.toLowerCase(),
        phone_number: data.country.Code + ' ' + data.phone,
      }),
    });
    onClose();
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof SendOfferValues)[];
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
    <Modal
      isVisible={true}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      // swipeDirection="down"
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View
        className="mr-px rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        {/* <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" /> */}
        <View className="flex-row items-center justify-between">
          <AppText className="font-bold text-2xl text-primary">Send a Message</AppText>
          <TouchableNativeFeedback hitSlop={100} onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>

        <View style={{ maxHeight: deviceHeight * 0.9 }}>
          <KeyboardAwareScrollView
            bottomOffset={50}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <AppText className="mb-4 mt-3  text-[15px] text-[#575775]">
              Send a message to the listing owner
            </AppText>
            <View className="flex-col gap-2">
              <ControlledTextInput
                control={control}
                name="message"
                multiline={true}
                label="Message to the Owner"
                className="h-52 align-top"
              />
              <AppText className="mb-6 mt-6 font-semibold text-xl text-primary">
                How can we get back to you?
              </AppText>
              <Grid cols={2} gap={2}>
                <ControlledTextInput
                  control={control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                  className=""
                />
                <ControlledTextInput
                  control={control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter last name"
                />
              </Grid>
              <AppText className="-mb-2 text-[13px] font-medium">Phone Number</AppText>
              <View className="flex-row items-center gap-1">
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
                    placeholder="Enter phone number"
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
              <ControlledTextInput
                control={control}
                name="email"
                label="Email Address"
                placeholder="Enter email address"
              />
            </View>
            <View className="mt-2">
              {/* <AppText className="px-3 text-center text-sm">
                By contacting the property owner, you agree and accepts OikoTeck's{' '}
                <Link href={'/privacy-policy'} className="text-secondary underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href={'/terms-conditions'} className="text-secondary underline">
                  Terms & Conditions
                </Link>
                .
              </AppText> */}
            </View>
            <View className="mt-7" />
            <Grid cols={2} gap={2}>
              <PressableView
                onPress={onClose}
                className="h-12 rounded-full border border-[#C6CAD2]">
                <View>
                  <AppText className="font-bold text-[15px]">Cancel</AppText>
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(onSubmit, onError)}
                className="h-12 rounded-full border border-secondary bg-secondary">
                <View>
                  <AppText className="font-bold text-[15px] text-white">Send Message</AppText>
                </View>
              </PressableView>
            </Grid>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SendMessage;

const SendOfferSchema = z
  .object({
    firstName: z.string({ error: 'Enter First Name.' }).min(1, { error: 'Enter First Name.' }),
    lastName: z.string({ error: 'Enter First Name.' }).min(1, { error: 'Enter Last Name' }),
    email: z.union([
      z.literal(''),
      z.string().toLowerCase().trim().pipe(z.email('Must be a valid email address.')),
    ]),

    phone: z.string().optional(),
    message: z.string({ error: 'Enter Your Message' }).min(1, {
      error: 'Enter Your Message',
    }),
    country: z.object({
      ISO: z.string(),
      Country: z.string(),
      Code: z.number(),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Enter one or both contact methods',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Enter one or both contact methods',
      });
    }
  });

type SendOfferValues = z.infer<typeof SendOfferSchema>;

const displayNames: Record<keyof SendOfferValues, string> = {
  country: 'Country',
  email: 'Email Address',
  firstName: 'First Name',
  lastName: 'Last Name',
  message: 'Message',
  phone: 'Phone Number',
};
