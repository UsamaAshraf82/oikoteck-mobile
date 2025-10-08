'use client';

import { TouchableWithoutFeedback } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import { ControlledTextInput } from '~/components/Elements/TextInput';
import Grid from '~/components/HOC/Grid';
import PressableView from '~/components/HOC/PressableView';
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
    // addToast({
    //   heading: 'Message submission',
    //   message: 'Your message is now sent. Listing owner will contact you soon',
    // });
    onClose();
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
    <Modal
      isVisible={true}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      // swipeDirection="down"
      hardwareAccelerated
      avoidKeyboard={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="flex-row items-center justify-between">
          <AppText className="text-2xl font-bold text-primary" >Send Message</AppText>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>

        <View style={{ maxHeight: deviceHeight * 0.9 }}>
          <ScrollView>
            <AppText className="mt-5 text-base text-primary">
              Send a message to the property owner
            </AppText>
            <View className="flex-col gap-2">
              <ControlledTextInput
                control={control}
                name="message"
                multiline={true}
                label="Message to the Owner"
                className="h-52 align-top"
              />
              <AppText className="mb-3 mt-5 text-xl font-semibold text-primary">
                How can we get back to you?
              </AppText>
              <Grid cols={2} gap={2}>
                <ControlledTextInput
                  control={control}
                  name="firstName"

                  label="First Name"
                  placeholder="Enter First Name"
                  className=""
                />
                <ControlledTextInput
                  control={control}
                  name="lastName"

                  label="Last Name"
                  placeholder="Enter Last Name"
                />
              </Grid>
              <AppText className="-mb-2" >Phone Number</AppText>
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
              <ControlledTextInput
                control={control}
                name="email"

                label="Email Address"
                placeholder="Enter your email address"
              />
            </View>
            <View className="mt-5">
              <AppText className="px-3 text-center text-sm">
                By contacting the property owner, you agree and accepts OikoTeck's{' '}
                <Link href={'/privacy-policy'} className="text-secondary underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href={'/terms-conditions'} className="text-secondary underline">
                  Terms & Conditions
                </Link>
                .
              </AppText>
            </View>
            <View className="mt-5" />
            <Grid cols={2} gap={2}>
              <PressableView
                onPress={onClose}
                className="h-12 rounded-full border border-[#C6CAD2]">
                <View>
                  <AppText>Cancel</AppText>
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(onSubmit, onError)}
                className="h-12 rounded-full border border-secondary bg-secondary">
                <View>
                  <AppText className="text-white" >Send Message</AppText>
                </View>
              </PressableView>
            </Grid>
          </ScrollView>
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
