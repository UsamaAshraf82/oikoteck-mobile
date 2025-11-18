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
import { ControlledDatePicker } from '~/components/Elements/DatePicker';
import { flags, RenderFlagWithCode } from '~/components/Elements/Flags';
import Select from '~/components/Elements/Select';
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

const RequestTour = ({ onClose, property }: SendOfferModalType) => {
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
  } = useForm<Tour1Type>({
    resolver: zodResolver(Tour1Schema),
    defaultValues: {
      tour_time: 'Anytime',
      tour_type: 'In-Person',
      country: { Code: flags[0].Code, Country: flags[0].Country, ISO: flags[0].ISO },

      message: 'I would like to know more about this property.',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      // tour_date: null,
    },
  });

  const onSubmit: SubmitHandler<Tour1Type> = async (data) => {
    startActivity();
    const myNewObject = new Parse.Object('Tours');
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
    myNewObject.set('price', property.price);
    if (data.phone) {
      myNewObject.set('phone', data.country.Code + ' ' + data.phone);
    }
    myNewObject.set('tour_time', data.tour_time);
    myNewObject.set('tour_type', data.tour_type);
    myNewObject.set('tour_date', new Date(data.tour_date!));
    myNewObject.set('message', data.message);
    myNewObject.set('email', data.email.toLowerCase());
    myNewObject.set('price', property.price);
    myNewObject.set('read', false);

    await myNewObject.save();
    addToast({
      heading: 'Tour Request',
      message:
        'Your request to tour the property is now submitted. Listing owner will contact you soon',
    });
    await fetch(emailsAddress, {
      method: 'POST',
      body: JSON.stringify({
        email: 'tour_request',
        id: property.objectId,
        sender: data.firstName + ' ' + data.lastName,
        message: data.message,
        date: new Date(data.tour_date!).toDateString(),
        email_address: data.email.toLowerCase(),
        phone_number: data.country.Code + ' ' + data.phone,
      }),
    });
    stopActivity();
    onClose();
  };

  const onError = () => {
    const keys = Object.keys(errors) as (keyof Tour1Type)[];
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
        style={{ maxHeight: deviceHeight * 0.9 }}>
        {/* Handle */}
        {/* <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" /> */}

        {/* Title + Close */}
        <View className="flex-row items-center justify-between">
          <AppText className="font-bold text-2xl text-primary">Request a Tour</AppText>
          <TouchableNativeFeedback hitSlop={100} onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>

        <KeyboardAwareScrollView
          bottomOffset={50}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <AppText className="mb-4 mt-3  text-[15px] text-[#575775]">
            Send a tour request to the listing owner
          </AppText>
          <View className="flex-col gap-2">
            <Select
              varient
              options={Tour1Schema.shape.tour_type.options.map((i) => ({ label: i, value: i }))}
              label="Select a tour type"
              title="Tour Type"
              value={{ label: watch('tour_type'), value: watch('tour_type') }}
              onChange={(value) => setValue('tour_type', value?.value as Tour1Type['tour_type'])}
            />

            <ControlledDatePicker
              control={control}
              name="tour_date"
              label="Select a preferred visit date"
              withForm
            />

            <Select
              varient
              options={Tour1Schema.shape.tour_time.options.map((i) => ({ label: i, value: i }))}
              label="Select a preferred visit time"
              title="Visit Type"
              value={{ label: watch('tour_time'), value: watch('tour_time') }}
              onChange={(value) => setValue('tour_time', value?.value as Tour1Type['tour_time'])}
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
            <AppText className="-mb-2 font-medium text-[13px]">Phone Number</AppText>
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
                  placeholder="Enter Phone Number"
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
            <ControlledTextInput
              control={control}
              name="message"
              multiline={true}
              label="Message to the Owner"
              className="h-52 align-top"
            />
          </View>
          <View className="mt-5"></View>
        </KeyboardAwareScrollView>

        <View className="mt-2" />
        <Grid cols={2} gap={2}>
          <PressableView onPress={onClose} className="h-12 rounded-full border border-[#C6CAD2]">
            <View>
              <AppText className="font-bold text-[15px]">Cancel</AppText>
            </View>
          </PressableView>
          <PressableView
            onPress={handleSubmit(onSubmit, onError)}
            className="h-12 rounded-full border border-secondary bg-secondary">
            <View>
              <AppText className="font-bold text-[15px] text-white">Request Tour</AppText>
            </View>
          </PressableView>
        </Grid>
      </View>
    </Modal>
  );
};

export default RequestTour;

const Tour1Schema = z
  .object({
    tour_type: z.enum(['In-Person', 'Video Call'], {
      message: 'Tour Type is Required.',
    }),

    tour_date: z
      .string({ message: 'Enter a visit date' })
      .min(1, { message: 'Enter a visit date' }),
    tour_time: z.enum(['Anytime', 'Morning', 'Evening'], {
      message: 'Tour Type is Required.',
    }),
    firstName: z.string().min(1, { message: 'Enter First Name.' }),
    lastName: z.string().min(1, { message: 'Enter Last Name' }),
    email: z.union([z.literal(''), z.string().email({ message: 'Email is Not Valid' })]),

    phone: z.string().optional(),
    message: z.string().min(1, {
      message: 'Enter Your Message',
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
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Enter one or both contact methods',
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phone'],
        message: 'Enter one or both contact methods',
      });
    }
  });

type Tour1Type = z.infer<typeof Tour1Schema>;

const displayNames: Record<keyof Tour1Type, string> = {
  country: 'Country',
  email: 'Email Address',
  firstName: 'First Name',
  lastName: 'Last Name',
  message: 'Message',
  phone: 'Phone Number',
  tour_date: 'Visit Date',
  tour_time: 'Visit Time',
  tour_type: 'Tour Type',
};
