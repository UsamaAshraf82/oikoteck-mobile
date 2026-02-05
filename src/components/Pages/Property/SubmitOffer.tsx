import { zodResolver } from '@hookform/resolvers/zod';
import Parse from 'parse/react-native';
import { XIcon } from 'phosphor-react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Modal from 'react-native-modal';
import { RefinementCtx, z } from 'zod';
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
    .superRefine((data: any, ctx: RefinementCtx) => {
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
  } = useForm<SendOfferValues>({
    resolver: zodResolver(SendOfferSchema) as any,
    defaultValues: {
      country: { Code: flags[0].Code, Country: flags[0].Country, ISO: flags[0].ISO },
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      price: property.price,
    },
  });

  const onSubmit: SubmitHandler<SendOfferValues> = async (data) => {
    startActivity();
    try {
      const myNewObject = new Parse.Object('Offers');
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
          <View style={styles.headerTextCol}>
            <AppText style={styles.headerTitle}>Submit Offer</AppText>
            <AppText style={styles.headerSub}>
              Submit an offer to the listing owner
            </AppText>
          </View>
          <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
            <View style={styles.closeBtn}>
              <XIcon color="#192234" size={24} />
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={{ maxHeight: deviceHeight * 0.8 }}>
          <KeyboardAwareScrollView
            bottomOffset={50}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.priceSection}>
              <Grid cols={2} gap={8}>
                <TextInput
                  readOnly
                  label="Asking Price"
                  value={property.price + ''}
                />
                <ControlledTextInput
                  control={control}
                  name="price"
                  label="Your Offer"
                  placeholder="Enter your offer"
                />
              </Grid>
              <AppText style={styles.warningText}>
                Your offer must not be more than 20% less than the asking price
              </AppText>
            </View>
            <View style={styles.contactSection}>
              <AppText style={styles.contactHeading}>
                How can we get back to you?
              </AppText>
              <Grid cols={2} gap={8}>
                <ControlledTextInput
                  control={control}
                  name="firstName"
                  multiline={true}
                  label="First Name"
                  placeholder="Enter first name"
                />
                <ControlledTextInput
                  control={control}
                  name="lastName"
                  multiline={true}
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
                    placeholder="Enter phone number"
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
                placeholder="Enter email address"
              />
            </View>
            <View style={styles.spacer40} />
            <Grid cols={2} gap={8}>
              <PressableView
                onPress={onClose}
                style={styles.cancelBtn}>
                <View style={styles.footerBtnInner}>
                  <AppText style={styles.cancelBtnText}>Cancel</AppText>
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(onSubmit, onError)}
                style={styles.sendBtn}>
                <View style={styles.footerBtnInner}>
                  <AppText style={styles.sendBtnText}>Send Message</AppText>
                </View>
              </PressableView>
            </Grid>
          </KeyboardAwareScrollView>
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
  headerTextCol: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  headerSub: {
    marginBottom: 16,
    marginTop: 12,
    fontSize: 15,
    color: '#575775',
  },
  closeBtn: {
    padding: 8,
  },
  priceSection: {
    marginTop: 4,
    flexDirection: 'column',
    gap: 8,
  },
  warningText: {
    marginTop: 0,
    fontSize: 12,
    color: '#192234',
  },
  contactSection: {
    flexDirection: 'column',
    gap: 8,
  },
  contactHeading: {
    marginBottom: 12,
    marginTop: 20,
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
  spacer40: {
    marginTop: 40,
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
    color: 'white',
    fontFamily: 'LufgaBold',
    fontSize: 15,
  },
});

export default SubmitOffer;
