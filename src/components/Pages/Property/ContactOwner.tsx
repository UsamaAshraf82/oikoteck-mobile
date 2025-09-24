import agent from '@/assets/svg/agent.svg';
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
import React, { useState } from 'react';
import { Text, TouchableNativeFeedback, View } from 'react-native';
import Modal from 'react-native-modal';
import PressableView from '~/components/HOC/PressableView';
import { cn } from '~/lib/utils';
import { useToast } from '~/store/useToast';
import { Property_Type } from '~/type/property';
import { User_Type } from '~/type/user';
import { deviceHeight } from '~/utils/global';
import tailwind from '~/utils/tailwind';
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
  const owner = normalizeOwner(property.owner);
  const { addToast } = useToast();

  const openWhatsApp = async () => {
    const url = `https://wa.me/+${owner?.country_code}${owner?.phone}?text=${encodeURIComponent(
      `Hi ${owner?.first_name} ${owner?.last_name}! I found this listing on OikoTeck ${window.location.href} and would like to inquire about further information.`
    )}`;
    try {
      await Linking.openURL(url);
    } catch (error) {
      addToast({
        header: 'Whatsapp',
        message: 'Cannot Open Whatsapp',
      });
    }
  };

  return (
    <Modal
      isVisible={visible}
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
        <PhoneNumberModal visible={phone} onClose={() => setPhone(false)} owner={owner} />
        <EmailModal visible={email} onClose={() => setEmail(false)} owner={owner} />
        <View className="mb-3 h-1 w-10 self-center rounded-sm bg-[#ccc]" />
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-primary">Contact Owner</Text>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <Text className="text-base text-primary">
            Select your preferred way to contact the property owner
          </Text>
          <View className="mt-4 flex-row items-center">
            <View className="h-16 w-16 flex-row items-center justify-center rounded-full bg-[#E2E4E8]">
              <UserIcon />
            </View>
            <View className="gap- ml-4 flex-1 flex-col">
              <View className="flex-row gap-2">
                <Text className="text-xl font-semibold">
                  {owner.first_name} {owner.last_name}
                </Text>
                <View
                  className={cn('flex-row items-center gap-2 rounded-full px-2 py-px', {
                    'bg-[#0E6DF1]/15 ': owner.user_type === 'agent',
                    'bg-[#5412A1]/15 ': owner.user_type !== 'agent',
                  })}>
                  {owner.user_type === 'agent' ? (
                    <Image source={agent} style={{ width: 14, height: 14 }} />
                  ) : (
                    <UserIcon size={14} />
                  )}
                  <Text
                    className={cn('text-xs', {
                      ' text-[#0E6DF1]': owner.user_type === 'agent',
                      ' text-[#5412A1]': owner.user_type !== 'agent',
                    })}>
                    {owner.user_type === 'agent' ? 'Broker' : 'Homeowner'}
                  </Text>
                </View>
              </View>
              <View className="my-1 flex-row gap-2">
                <PressableView
                  onPress={() => {
                    setPhone(true);
                  }}
                  className="h-6 rounded-full bg-[#E2E4E8]">
                  <View className="px-2 py-1">
                    <Text className="text-xs">Show Phone Number</Text>
                  </View>
                </PressableView>
                <PressableView
                  onPress={() => {
                    setEmail(true);
                  }}
                  className="h-6 rounded-full bg-[#E2E4E8]">
                  <View className="px-2  py-1">
                    <Text className="text-xs">Show Email Address</Text>
                  </View>
                </PressableView>
              </View>
            </View>
          </View>
          <View className="mt-8 flex-col items-center gap-4">
            <PressableView onPress={openWhatsApp} className="h-16 w-full rounded-full bg-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <Text className="text-sm font-semibold text-white">Chat On WhatsApp</Text>
                <WhatsappLogoIcon color="white" size={20} />
              </View>
            </PressableView>
            <PressableView className="h-16 w-full rounded-full bg-secondary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <Text className="text-sm font-semibold text-white">Send a Message</Text>
                <ChatTeardropIcon color="white" size={20} />
              </View>
            </PressableView>
            <PressableView className="h-16 w-full rounded-full border border-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <Text className="text-sm font-semibold text-primary">Request a tour</Text>
                <HouseLineIcon color={tailwind.theme.colors.primary} size={20} />
              </View>
            </PressableView>
          </View>
          <View className="mt-5">
            <Text className="px-4 text-center text-sm">
              By contacting the property owner, you agree and accepts OikoTeck's{' '}
              <Link href={'/privacy-policy'} className="text-secondary underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href={'/terms-conditions'} className="text-secondary underline">
                Terms & Conditions
              </Link>
              .
            </Text>
          </View>
        </View>
      </View>
    </Modal>
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
          <Text className="text-2xl font-bold text-primary">Phone Number</Text>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <Text className="text-base text-primary">Property owner’s phone number</Text>
          <View className="mt-4 flex-row items-center justify-center rounded-3xl bg-[#8D95A51A] py-4">
            <Text className="text-center text-2xl font-bold text-primary">
              +{owner.country_code} {owner.phone}
            </Text>
          </View>
          <View className="mt-4 flex-col items-center gap-4">
            <PressableView
              onPress={() => Linking.openURL(`tel:+${owner.country_code} ${owner.phone}`)}
              className="h-16 w-full rounded-full border border-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <PhoneCallIcon color={tailwind.theme.colors.primary} size={20} />
                <Text className="text-sm font-semibold text-primary">Call Now</Text>
              </View>
            </PressableView>
          </View>
          <View className="mt-5">
            <Text className="px-4 text-center text-sm">
              By contacting the property owner, you agree and accepts OikoTeck's{' '}
              <Link href={'/privacy-policy'} className="text-secondary underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href={'/terms-conditions'} className="text-secondary underline">
                Terms & Conditions
              </Link>
              .
            </Text>
          </View>
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
          <Text className="text-2xl font-bold text-primary">Email address</Text>
          <TouchableNativeFeedback onPress={onClose}>
            <XIcon />
          </TouchableNativeFeedback>
        </View>
        <View style={{ maxHeight: deviceHeight * 0.775 }}>
          <Text className="text-base text-primary">Property owner’s email address</Text>
          <View className="mt-4 flex-row items-center justify-center rounded-3xl bg-[#8D95A51A] py-4">
            <Text className="text-center text-2xl font-bold text-primary">{owner.username}</Text>
          </View>
          <View className="mt-4 flex-col items-center gap-4">
            <PressableView
              onPress={() => Linking.openURL(`mailto:${owner.username}`)}
              className="h-16 w-full rounded-full border border-primary">
              <View className="h-full w-full flex-row items-center justify-center gap-3">
                <EnvelopeIcon color={tailwind.theme.colors.primary} size={20} />
                <Text className="text-sm font-semibold text-primary">Send Email</Text>
              </View>
            </PressableView>
          </View>
          <View className="mt-5">
            <Text className="px-4 text-center text-sm">
              By contacting the property owner, you agree and accepts OikoTeck's{' '}
              <Link href={'/privacy-policy'} className="text-secondary underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href={'/terms-conditions'} className="text-secondary underline">
                Terms & Conditions
              </Link>
              .
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
