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
import { TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import z from 'zod';
import AppText from '~/components/Elements/AppText';
import { ControlledCheckBox } from '~/components/Elements/Checkbox';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceHeight } from '~/utils/global';
import tailwind from '~/utils/tailwind';
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
  const [phone, setPhone] = useState(false);
  const [email, setEmail] = useState(false);
  const [message, setMessage] = useState(false);
  const [request_tour, setrequest_tour] = useState(false);
  const owner = normalizeOwner(property.owner);
  const { addToast } = useToast();

  const openWhatsApp = async () => {
    const url = `https://wa.me/${owner?.country_code}${owner?.phone}?text=${encodeURIComponent(
      `Hi ${owner?.first_name} ${owner?.last_name}! I found this listing on OikoTeck ${window.location.href} and would like to inquire about further information.`
    )}`;
    try {
      // const canOpen = await Linking.canOpenURL(url);

      // if (!canOpen) throw new Error('Cannot open');
      await Linking.openURL(url);
    } catch (error) {
      console.log(error)
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
  console.log(errors);

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
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View
          className="rounded-t-[20px] bg-white px-4 py-4"
          style={{
            maxHeight: deviceHeight * 0.9,
          }}>
          <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
          <View className="flex-row items-center justify-between">
            <AppText className="font-bold text-2xl text-primary">Contact Owner</AppText>
            <TouchableNativeFeedback hitSlop={100} onPress={onClose}>
              <XIcon />
            </TouchableNativeFeedback>
          </View>
          <View style={{ maxHeight: deviceHeight * 0.775 }}>
            <AppText className="text-base text-primary">
              Select your preferred way to contact the property owner
            </AppText>
            <View className="mt-4 flex-row items-center">
              <View className="h-16 w-16 flex-row items-center justify-center rounded-full bg-[#E2E4E8]">
                <UserIcon />
              </View>
              <View className="gap- ml-4 flex-1 flex-col">
                <View className="mb-1 flex-row items-center gap-2">
                  <AppText className="font-semibold text-xl">
                    {owner.first_name} {owner.last_name}
                  </AppText>
                  <View
                    className={cn('h-[19px] flex-row items-center gap-2 rounded-full px-2', {
                      'bg-agent/15 ': owner.user_type === 'agent',
                      'bg-individual/15 ': owner.user_type !== 'agent',
                    })}>
                    {owner.user_type === 'agent' ? (
                      <Image source={agent} style={{ width: 14, height: 14 }} />
                    ) : (
                      <UserIcon size={14} />
                    )}
                    <AppText
                      className={cn('text-xs', {
                        ' text-agent': owner.user_type === 'agent',
                        ' text-individual': owner.user_type !== 'agent',
                      })}>
                      {owner.user_type === 'agent' ? 'Broker' : 'Homeowner'}
                    </AppText>
                  </View>
                </View>
                <View className="my-1 flex-row gap-2">
                  <PressableView
                    onPress={handleSubmit(() => setPhone(true), onError)}
                    className="h-6 rounded-full bg-[#E2E4E8]">
                    <View className="px-2 py-1">
                      <AppText className="text-xs">Show Phone Number</AppText>
                    </View>
                  </PressableView>
                  <PressableView
                    onPress={handleSubmit(() => setEmail(true), onError)}
                    className="h-6 rounded-full bg-[#E2E4E8]">
                    <View className="px-2  py-1">
                      <AppText className="text-xs">Show Email Address</AppText>
                    </View>
                  </PressableView>
                </View>
              </View>
            </View>
            <View className="mt-8 flex-col items-center gap-4">
              <PressableView
                onPress={handleSubmit(openWhatsApp, onError)}
                className="h-16 w-full rounded-full bg-primary">
                <View className="h-full w-full flex-row items-center justify-center gap-3">
                  <AppText className="font-semibold text-sm text-white">Chat On WhatsApp</AppText>
                  <WhatsappLogoIcon color="white" size={20} />
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(() => setMessage(true), onError)}
                className="h-16 w-full rounded-full bg-secondary">
                <View className="h-full w-full flex-row items-center justify-center gap-3">
                  <AppText className="font-semibold text-sm text-white">Send a Message</AppText>
                  <ChatTeardropIcon color="white" size={20} />
                </View>
              </PressableView>
              <PressableView
                onPress={handleSubmit(() => setrequest_tour(true), onError)}
                className="h-16 w-full rounded-full border border-primary">
                <View className="h-full w-full flex-row items-center justify-center gap-3">
                  <AppText className="font-semibold text-sm text-primary">Request a tour</AppText>
                  <HouseLineIcon color={tailwind.theme.colors.primary} size={20} />
                </View>
              </PressableView>
            </View>
            <View className="mb-8 mt-5">
              <ControlledCheckBox
                control={control}
                alignTop
                name="terms"
                label={
                  <>
                    I confirm that I read and I agree with Oikoteck’s{' '}
                    <Link href="/terms-conditions" className="text-secondary">
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
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary">
                      Data Protection Notice
                    </Link>{' '}
                    and the{' '}
                    <Link
                      href="/cookie-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary">
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
    // Option 1: use attributes
    return owner.attributes as User_Type;

    // Option 2: if you want raw JSON
    // return owner.toJSON() as User_Type;
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
      // swipeDirection="down"
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      propagateSwipe={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        {/* <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" /> */}
        <View className="mb-3 flex-row items-center justify-between">
          <AppText className="font-bold text-2xl text-primary">Phone Number</AppText>
          <TouchableNativeFeedback hitSlop={100} onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <AppText className="text-base text-primary">Property owner’s phone number</AppText>
          <View className="mt-4 flex-row items-center justify-center rounded-3xl bg-[#8D95A5]/10 py-4">
            <AppText className="text-center font-bold text-2xl text-primary">
              +{owner.country_code} {owner.phone}
            </AppText>
          </View>
          <View className="mt-4 flex-col items-center gap-4">
            <PressableView
              onPress={() => Linking.openURL(`tel:+${owner.country_code} ${owner.phone}`)}
              className="h-16 w-full rounded-full border border-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <PhoneCallIcon color={tailwind.theme.colors.primary} size={20} />
                <AppText className="font-semibold text-sm text-primary">Call Now</AppText>
              </View>
            </PressableView>
          </View>
          <View className="mt-5"></View>
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
      // swipeDirection="down"
      coverScreen={false}
      hardwareAccelerated
      avoidKeyboard={false}
      propagateSwipe={false}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View
        className="rounded-t-[20px] bg-white px-4 py-4"
        style={{
          maxHeight: deviceHeight * 0.9,
        }}>
        {/* <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" /> */}
        <View className="mb-3 flex-row items-center justify-between">
          <AppText className="font-bold text-2xl text-primary">Email address</AppText>
          <TouchableNativeFeedback hitSlop={100} onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <AppText className="text-base text-primary">Property owner's email address</AppText>
          <View className="mt-4 flex-row items-center justify-center rounded-3xl bg-[#8D95A51A] py-4">
            <AppText className="text-center font-bold text-2xl text-primary">
              {owner.username}
            </AppText>
          </View>
          <View className="mt-4 flex-col items-center gap-4">
            <PressableView
              onPress={() => Linking.openURL(`mailto:${owner.username}`)}
              className="h-16 w-full rounded-full border border-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <EnvelopeIcon color={tailwind.theme.colors.primary} size={20} />
                <AppText className="font-semibold text-sm text-primary">Send Email</AppText>
              </View>
            </PressableView>
          </View>
          <View className="mt-5"></View>
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
  .superRefine((data, ctx) => {
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
