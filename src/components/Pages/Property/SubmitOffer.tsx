'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import { z } from 'zod';
import AppText from '~/components/Elements/AppText';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import TextInput, { ControlledTextInput } from '~/components/Elements/TextInput';
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

const SubmitOffer = ({ onClose, property }: SendOfferModalType) => {
  const { user } = useUser();
  const { addToast } = useToast();
  const { openSelect } = useSelect();
  const { startActivity, stopActivity } = useActivityIndicator();

  const p20 = property.price * 0.8;

  const SendOfferSchema = z
    .object({
      // privacy: z.boolean().optional(),
      // terms: z.boolean().optional(),
      firstName: z.string().min(1, { message: 'Enter First Name.' }),
      lastName: z.string().min(1, { message: 'Enter Last Name' }),
      email: z.union([
        z.literal(''),
        z.string().toLowerCase().trim().pipe(z.email('Must be a valid email address.')),
      ]),

      phone: z.string().optional(),
      price: z.coerce.number().min(p20, {
        message: `Your offer price is less than 20% (${p20.toFixed(0)}) of the asking price`,
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

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof SendOfferSchema>>({
    resolver: zodResolver(SendOfferSchema) as any,
    defaultValues: {
      country: { Code: flags[0].Code, Country: flags[0].Country, ISO: flags[0].ISO },
      email: '',
      firstName: '',
      lastName: '',
      phone: '',

      // privacy: false,
      // terms: false,
    },
  });

  const onSubmit: SubmitHandler<SendOfferValues> = async (data) => {
    // if (!data.privacy || !data.terms) {
    //   addToast({
    //     message:
    //       'You must agree to Privacy Policy and Terms & Conditions before contacting the listing owner',
    //     heading: 'Policy Consent',
    //   });

    //   return;
    // }
    startActivity();
    const myNewObject = new Parse.Object('Offers');
    myNewObject.set('Property', {
      __type: 'Pointer',
      className: 'Property',
      objectId: property.objectId,
    });
    myNewObject.set('User',user);
    myNewObject.set('owner', property.owner);
    myNewObject.set('first_name', data.firstName);
    myNewObject.set('last_name', data.lastName);
    myNewObject.set('listing_type', property.listing_for);
    myNewObject.set('actual_price', property.price);
    if (data.phone) {
      myNewObject.set('phone', data.country.Code + ' ' + data.phone);
    }
    myNewObject.set('email', data.email.toLowerCase());
    myNewObject.set('bid_price', data.price);
    myNewObject.set('read', false);

    await myNewObject.save();
    addToast({
      heading: 'Offer submission',
      message: 'Your offer is now submitted. Listing owner will contact you soon',
    });
    await fetch(emailsAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: 'offer_request',
        id: property.objectId,
        sender: data.firstName + ' ' + data.lastName,
        bid: data.price,
        email_address: data.email.toLowerCase(),
        phone_number: data.country.Code + ' ' + data.phone,
      }),
    });
    onClose();
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
          <View className="flex-col">
            <AppText className="font-bold text-2xl text-primary">Submit Offer</AppText>
            <AppText className="mt-0 text-base text-primary">
              Submit an Offer to the property owner
            </AppText>
          </View>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>

        <View style={{ maxHeight: deviceHeight * 0.9 }}>
          <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
            <View className="mt-5 flex-col gap-2">
              <Grid cols={2} gap={2}>
                <TextInput
                  readOnly
                  label="Asking Price"
                  value={property.price + ''}
                  // className=""
                />
                <ControlledTextInput
                  control={control}
                  name="price"
                  label="Your Offer"
                  placeholder="Enter Last Name"
                />
              </Grid>
              <AppText className="mt-0 text-xs text-primary">
                Your offer must not be more than 20% less than the asking price
              </AppText>
            </View>
            <View className="flex-col gap-2">
              <AppText className="mb-3 mt-5 font-semibold text-xl text-primary">
                How can we get back to you?
              </AppText>
              <Grid cols={2} gap={2}>
                <ControlledTextInput
                  control={control}
                  name="firstName"
                  multiline={true}
                  label="First Name"
                  placeholder="Enter First Name"
                  className=""
                />
                <ControlledTextInput
                  control={control}
                  name="lastName"
                  multiline={true}
                  label="Last Name"
                  placeholder="Enter Last Name"
                />
              </Grid>
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
              <ControlledTextInput
                control={control}
                name="email"
                multiline={true}
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
                  <AppText className="text-white">Send Message</AppText>
                </View>
              </PressableView>
            </Grid>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SubmitOffer;
