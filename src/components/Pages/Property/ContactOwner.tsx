import agent from '@/assets/svg/agent.svg';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import Parse from 'parse/react-native';
import {
    ChatTeardropIcon,
    EnvelopeIcon,
    HouseLineIcon,
    PhoneCallIcon,
    UserIcon,
    WhatsappLogoIcon,
    XIcon,
} from 'phosphor-react-native';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import z, { RefinementCtx } from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceHeight } from '~/utils/global';
import RequestTour from './RequestTour';
import SendMessage from './SendMessage';

export type filterType = {
  district: string | null;
  area_1: string | null;
  area_2: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSize: number | null;
  maxSize: number | null;
  minDate: Date | null;
  maxDate: Date | null;
  bedroom: number | null;
  furnished: boolean | null;
  bathroom: number | null;
  keywords: string | null;
  property_type: Property_Type['property_type'] | null;
  property_category: Property_Type['property_category'] | null;
};

type Props = {
  property: Property_Type;
  onClose: () => void;
  visible: boolean;
};

const ContactOwner = ({ property, onClose, visible }: Props) => {
  const ExpoImage = Image as any;
  const [phone, setPhone] = useState(false);
  const [email, setEmail] = useState(false);
  const [message, setMessage] = useState(false);
  const [request_tour, setrequest_tour] = useState(false);
  const owner = normalizeOwner(property.owner);
  const { addToast } = useToast();

  const openWhatsApp = async () => {
    const url = `https://wa.me/${owner?.country_code}${owner?.phone}?text=${encodeURIComponent(
      `Hi ${owner?.first_name} ${owner?.last_name}! I found this listing on OikoTeck  and would like to inquire about further information.`
    )}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      addToast({
        heading: 'Whatsapp',
        message: 'Cannot Open Whatsapp',
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShareConsentTypes>({
    resolver: zodResolver(ShareConsentSchema),
    defaultValues: {
      terms: false,
      privacy: false,
      share_consent: false,
    },
  });

  const onError = () => {
    const keys = Object.keys(errors) as (keyof ShareConsentTypes)[];
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

  const isAgent = owner.user_type === 'agent';

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        onSwipeComplete={onClose}
        swipeDirection="down"
        coverScreen={false}
        hardwareAccelerated
        avoidKeyboard={false}
        propagateSwipe={false}
        style={styles.modal}>
        <View
          style={[
            styles.container,
            {
              maxHeight: deviceHeight * 0.9,
            },
          ]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText style={styles.headerTitle}>Contact Owner</AppText>
            <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
              <View style={styles.closeIcon}>
                <XIcon color="#192234" size={24} />
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ maxHeight: deviceHeight * 0.775 }}>
            <AppText style={styles.subTitle}>
              Select your preferred way to contact the property owner
            </AppText>
            <View style={styles.ownerRow}>
              <View style={styles.avatar}>
                <UserIcon color="#192234" />
              </View>
              <View style={styles.ownerInfo}>
                <View style={styles.ownerNameRow}>
                  <AppText style={styles.ownerName}>
                    {owner.first_name} {owner.last_name}
                  </AppText>
                  <View
                    style={[
                      styles.badge,
                      isAgent ? styles.badgeAgent : styles.badgeIndividual,
                    ]}>
                    {isAgent ? (
                      <ExpoImage source={agent} style={{ width: 14, height: 14 }} />
                    ) : (
                      <UserIcon size={14} color="#5412A1" />
                    )}
                    <AppText
                      style={[
                         styles.badgeText,
                        isAgent ? styles.textAgent : styles.textIndividual,
                      ]}>
                      {isAgent ? 'Broker' : 'Homeowner'}
                    </AppText>
                  </View>
                </View>
                <View style={styles.actionRow}>
                  <PressableView
                    onPress={handleSubmit(() => setPhone(true), onError)}
                    style={styles.smallBtn}>
                    <View style={styles.smallBtnPadding}>
                      <AppText style={styles.smallBtnText}>Show Phone Number</AppText>
                    </View>
                  </PressableView>
                  <PressableView
                    onPress={handleSubmit(() => setEmail(true), onError)}
                    style={styles.smallBtn}>
                    <View style={styles.smallBtnPadding}>
                      <AppText style={styles.smallBtnText}>Show Email Address</AppText>
                    </View>
                  </PressableView>
                </View>
              </View>
            </View>
            <View style={styles.mainActions}>
              <PressableView
                onPress={handleSubmit(openWhatsApp, onError)}
                style={styles.whatsappBtn}>
                <View style={styles.btnInner}>
                  <AppText style={styles.btnTextWhite}>Chat On WhatsApp</AppText>
                  <WhatsappLogoIcon color="white" size={20} />
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(() => setMessage(true), onError)}
                style={styles.messageBtn}>
                <View style={styles.btnInner}>
                  <AppText style={styles.btnTextWhite}>Send a Message</AppText>
                  <ChatTeardropIcon color="white" size={20} />
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(() => setrequest_tour(true), onError)}
                style={styles.tourBtn}>
                <View style={styles.btnInner}>
                  <AppText style={styles.btnTextPrimary}>Request a tour</AppText>
                  <HouseLineIcon color="#192234" size={20} />
                </View>
              </PressableView>
            </View>
            <View style={styles.checkboxSection}>
              <ControlledCheckBox
                control={control}
                alignTop
                name="terms"
                label={
                  <>
                    I confirm that I read and I agree with Oikoteck’s{' '}
                    <Link href="/terms-conditions" style={styles.linkText}>
                      Terms & Conditions
                    </Link>{' '}
                    *
                  </>
                }
              />
              <ControlledCheckBox
                control={control}
                alignTop
                name="privacy"
                label={
                  <>
                    I confirm that I read and understood Oikoteck’s{' '}
                    <Link
                      href="/privacy-policy"
                      style={styles.linkText}>
                      Data Protection Notice
                    </Link>{' '}
                    and the{' '}
                    <Link
                      href="/cookie-policy"
                      style={styles.linkText}>
                      Cookies Policy
                    </Link>{' '}
                    *
                  </>
                }
              />
              <ControlledCheckBox
                control={control}
                alignTop
                name="share_consent"
                label="I consent to the sharing of my contact information and search preferences with real estate agents who offer listings which may align with my interests"
              />
            </View>
          </View>
        </View>
      </Modal>
      {phone && <PhoneNumberModal visible={phone} onClose={() => setPhone(false)} owner={owner} />}
      {email && <EmailModal visible={email} onClose={() => setEmail(false)} owner={owner} />}
      {message && <SendMessage onClose={() => setMessage(false)} property={property} />}
      {request_tour && <RequestTour onClose={() => setrequest_tour(false)} property={property} />}
    </>
  );
};

export default ContactOwner;

function normalizeOwner(owner: Parse.User<User_Type> | User_Type): User_Type {
  if (owner instanceof Parse.User) {
    return owner.attributes as User_Type;
  }
  return owner;
}

const PhoneNumberModal = ({
  onClose,
  visible,
  owner,
}: {
  owner: User_Type;
  onClose: () => void;
  visible: boolean;
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      propagateSwipe={false}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            maxHeight: deviceHeight * 0.9,
          },
        ]}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Phone Number</AppText>
          <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
            <View style={styles.closeIcon}>
               <XIcon color="#192234" size={24} />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <AppText style={styles.subTitle}>Property owner’s phone number</AppText>
          <View style={styles.numberBox}>
            <AppText style={styles.numberText}>
              +{owner.country_code} {owner.phone}
            </AppText>
          </View>
          <View style={styles.modalActions}>
            <PressableView
              onPress={() => Linking.openURL(`tel:+${owner.country_code} ${owner.phone}`)}
              style={styles.callNowBtn}>
              <View style={styles.btnInner}>
                <PhoneCallIcon color="#192234" size={20} />
                <AppText style={styles.btnTextPrimary}>Call Now</AppText>
              </View>
            </PressableView>
          </View>
          <View style={styles.spacer20}></View>
        </View>
      </View>
    </Modal>
  );
};

const EmailModal = ({
  onClose,
  visible,
  owner,
}: {
  owner: User_Type;
  onClose: () => void;
  visible: boolean;
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      propagateSwipe={false}
      style={styles.modal}>
      <View
        style={[
          styles.container,
          {
            maxHeight: deviceHeight * 0.9,
          },
        ]}>
        <View style={styles.header}>
          <AppText style={styles.headerTitle}>Email address</AppText>
          <TouchableNativeFeedback hitSlop={10} onPress={onClose}>
            <View style={styles.closeIcon}>
              <XIcon color="#192234" size={24} />
            </View>
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <AppText style={styles.subTitle}>Property owner's email address</AppText>
          <View style={styles.numberBox}>
            <AppText style={styles.numberText}>
              {owner.username}
            </AppText>
          </View>
          <View style={styles.modalActions}>
            <PressableView
              onPress={() => Linking.openURL(`mailto:${owner.username}`)}
              style={styles.emailNowBtn}>
              <View style={styles.btnInner}>
                <EnvelopeIcon color="#192234" size={20} />
                <AppText style={styles.btnTextPrimary}>Send Email</AppText>
              </View>
            </PressableView>
          </View>
          <View style={styles.spacer20}></View>
        </View>
      </View>
    </Modal>
  );
};

const ShareConsentSchema = z
  .object({
    terms: z.boolean(),
    privacy: z.boolean(),
    share_consent: z.boolean(),
  })
  .superRefine((data: ShareConsentTypes, ctx: RefinementCtx) => {
    if (!data.terms) {
      ctx.addIssue({
        code: 'custom',
        path: ['terms'],
        message: 'You Must Agree with Terms and Conditions',
      });
    }

    if (!data.privacy) {
      ctx.addIssue({
        code: 'custom',
        path: ['privacy'],
        message: 'You Must Agree with Privacy Policy',
      });
    }
  });

type ShareConsentTypes = z.infer<typeof ShareConsentSchema>;

const displayNames: Record<keyof ShareConsentTypes, string> = {
  privacy: 'Privacy Policy',
  share_consent: 'Share Consent',
  terms: 'Terms and Conditions',
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
  handle: {
    marginBottom: 12,
    height: 4,
    width: 40,
    alignSelf: 'center',
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  closeIcon: {
    padding: 8,
  },
  subTitle: {
    fontSize: 16,
    color: '#192234',
    marginBottom: 16,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    height: 64,
    width: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: '#E2E4E8',
  },
  ownerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ownerName: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 20,
    color: '#192234',
  },
  badge: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  badgeAgent: {
    backgroundColor: 'rgba(14, 109, 241, 0.15)',
  },
  badgeIndividual: {
    backgroundColor: 'rgba(84, 18, 161, 0.15)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'LufgaMedium',
  },
  textAgent: {
    color: '#0E6DF1',
  },
  textIndividual: {
    color: '#5412A1',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E4E8',
  },
  smallBtnPadding: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  smallBtnText: {
    fontSize: 12,
    color: '#192234',
  },
  mainActions: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  whatsappBtn: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    backgroundColor: '#192234',
  },
  messageBtn: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    backgroundColor: '#82065e',
  },
  tourBtn: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#192234',
  },
  btnInner: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  btnTextWhite: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: 'white',
  },
  btnTextPrimary: {
    fontFamily: 'LufgaSemiBold',
    fontSize: 14,
    color: '#192234',
  },
  checkboxSection: {
    marginBottom: 32,
  },
  linkText: {
    color: '#82065e',
  },
  numberBox: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(141, 149, 165, 0.1)',
    paddingVertical: 16,
  },
  numberText: {
    textAlign: 'center',
    fontFamily: 'LufgaBold',
    fontSize: 24,
    color: '#192234',
  },
  modalActions: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 16,
  },
  callNowBtn: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#192234',
  },
  emailNowBtn: {
    height: 64,
    width: '100%',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#192234',
  },
  spacer20: {
    height: 20,
  },
});
