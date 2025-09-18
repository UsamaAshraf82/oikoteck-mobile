// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from 'expo-router';
import {
  ChatCircleIcon,
  HouseLineIcon,
  KeyIcon,
  PlusCircleIcon,
  UserIcon,
} from 'phosphor-react-native';
import tailwind from '~/utils/tailwind';
export default function TabsLayout() {
  return (
    <Tabs
      // initialRouteName="rent"
      initialRouteName="rent"
      detachInactiveScreens
      screenOptions={{
        lazy: true,

        tabBarStyle: {
          backgroundColor: tailwind.theme.colors.white, // slate-800
        },
        tabBarActiveTintColor: tailwind.theme.colors.secondary,
        tabBarInactiveTintColor: tailwind.theme.colors.o_light_gray,
        animation: 'fade',
        headerShown: false,

        // tabBarShowLabel: false,
        tabBarItemStyle: {
          borderColor: tailwind.theme.colors.white,
        },
        // tabBarButton: (props) => (
        //   <Pressable android_ripple={{ color: tailwind.theme.colors.secondary }}  />{p}</Pressable>
        // ),
      }}>
      <Tabs.Screen
        name="rent"
        options={{
          // tabBarShowLabel: false,
          tabBarLabel: 'Rent',
          tabBarIcon: ({ color }) => <HouseLineIcon color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="buy"
        options={{
          tabBarLabel: 'Buy',
          tabBarIcon: ({ color }) => <KeyIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="post-listing"
        options={{
          tabBarLabel: 'Post Listing',
          tabBarIcon: ({ color }) => <PlusCircleIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="live-chat"
        options={{
          tabBarLabel: 'Live Chat',
          tabBarIcon: ({ color }) => <ChatCircleIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="property/[id]"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}
