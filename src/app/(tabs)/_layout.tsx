// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from 'expo-router';
import {
  ChatCircleIcon,
  HouseLineIcon,
  KeyIcon,
  PlusCircleIcon,
  UserIcon,
} from 'phosphor-react-native';
import { View } from 'react-native';
import AppText from '~/components/Elements/AppText';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';
export default function TabsLayout() {
  return (
    <Tabs
      // initialRouteName="rent"
      initialRouteName="rent"
      detachInactiveScreens
      screenOptions={{
        lazy: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: tailwind.theme.colors.white, // slate-800
        },
        tabBarActiveTintColor: tailwind.theme.colors.secondary,
        tabBarInactiveTintColor: tailwind.theme.colors.o_light_gray,
        animation: 'fade',
        headerShown: false,

        tabBarItemStyle: {
          borderColor: tailwind.theme.colors.white,
        },
      }}>
      <Tabs.Screen
        name="rent"
        options={{
          tabBarLabel: (props) => {
            return <Label focused={props.focused} label="Rent" />;
          },
          tabBarIcon: ({ color }) => <HouseLineIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          tabBarLabel: (props) => {
            return <Label focused={props.focused} label="Buy" />;
          },
          tabBarIcon: ({ color }) => <KeyIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="post-listing"
        options={{
          tabBarLabel: (props) => {
            return <Label focused={props.focused} label="Post Listing" />;
          },
          tabBarIcon: ({ color }) => <PlusCircleIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="live-chat"
        options={{
          tabBarLabel: (props) => {
            return <Label focused={props.focused} label="Live Chat" />;
          },
          tabBarIcon: ({ color }) => <ChatCircleIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: (props) => {
            return <Label focused={props.focused} label="Account" />;
          },
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const Label = ({ focused, label }: { focused: boolean; label: string }) => {
  return (
    <View className="w-full flex-row items-center justify-center">
      <AppText
        className={cn(
          ' w-full whitespace-nowrap text-nowrap text-center text-xs leading-none text-o_light_gray',
          {
            'text-secondary': focused,
          }
        )}
        numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
};
