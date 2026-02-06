import { zodResolver } from '@hookform/resolvers/zod';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Modal from 'react-native-modal';
import { RefinementCtx, z } from 'zod';
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
  .superRefine((data: any, ctx: RefinementCtx) => {
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
    },
  });

  const onSubmit: SubmitHandler<Tour1Type> = async (data) => {
    startActivity();
    try {
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
      onClose();
    } catch (e: any) {
      addToast({
        type: 'error',
        heading: 'Error',
        message: e.message,
      });
    } finally {
      stopActivity();
    }
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
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            maxHeight: deviceHeight * 0.9,
          },
        ]}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Request a Tour</AppText>
          <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
            <View style={styles.closeBtn}>
              <XIcon color="#192234" size={24} />
            </View>
          </TouchableNativeFeedback>
        </View>

        <KeyboardAwareScrollView
          bottomOffset={50}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <AppText style={styles.headerSub}>Send a tour request to the listing owner</AppText>
          <View style={styles.formSection}>
            <Select
              varient
              options={Tour1Schema.shape.tour_type.options.map((i: string) => ({
                label: i,
                value: i,
              }))}
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
              options={Tour1Schema.shape.tour_time.options.map((i: string) => ({
                label: i,
                value: i,
              }))}
              label="Select a preferred visit time"
              title="Visit Type"
              value={{ label: watch('tour_time'), value: watch('tour_time') }}
              onChange={(value) => setValue('tour_time', value?.value as Tour1Type['tour_time'])}
            />
            <AppText style={styles.contactHeading}>How can we get back to you?</AppText>
            <Grid cols={2} gap={8}>
              <ControlledTextInput
                control={control}
                name="firstName"
                label="First Name"
                placeholder="Enter first name"
              />
              <ControlledTextInput
                control={control}
                name="lastName"
                label="Last Name"
                placeholder="Enter last name"
              />
            </Grid>
            <AppText style={styles.label}>Phone Number</AppText>
            <View style={styles.phoneRow}>
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
              style={styles.textArea}
            />
          </View>
          <View style={styles.spacer20}></View>
        </KeyboardAwareScrollView>

        <View style={styles.footer}>
          <Grid cols={2} gap={8}>
            <PressableView onPress={onClose} style={styles.cancelBtn}>
              <View style={styles.footerBtnInner}>
                <AppText style={styles.cancelBtnText}>Cancel</AppText>
              </View>
            </PressableView>
            <PressableView onPress={handleSubmit(onSubmit, onError)} style={styles.sendBtn}>
              <View style={styles.footerBtnInner}>
                <AppText style={styles.sendBtnText}>Request Tour</AppText>
              </View>
            </PressableView>
          </Grid>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  closeBtn: {
    padding: 8,
  },
  headerSub: {
    marginBottom: 16,
    marginTop: 12,
    fontSize: 15,
    color: '#575775',
  },
  formSection: {
    flexDirection: 'column',
    gap: 8,
  },
  contactHeading: {
    marginBottom: 12,
    marginTop: 24,
    fontFamily: 'LufgaSemiBold',
    fontSize: 20,
    color: '#192234',
  },
  label: {
    marginBottom: -8,
    fontFamily: 'LufgaMedium',
    fontSize: 13,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  textArea: {
    height: 208, // h-52
    textAlignVertical: 'top',
  },
  spacer20: {
    height: 20,
  },
  footer: {
    marginTop: 8,
  },
  cancelBtn: {
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C6CAD2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#82065e',
    backgroundColor: '#82065e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 15,
    color: '#192234',
  },
  sendBtnText: {
    fontFamily: 'LufgaBold',
    fontSize: 15,
    color: 'white',
  },
});

export default RequestTour;
