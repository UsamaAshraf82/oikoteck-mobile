import { Tabs } from 'expo-router';
import {
  ChatCircleIcon,
  HouseLineIcon,
  KeyIcon,
  PlusCircleIcon,
  UserIcon,
} from 'phosphor-react-native';
import { StyleSheet, View } from 'react-native';
import AppText from '~/components/Elements/AppText';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="rent"
      detachInactiveScreens
      screenOptions={{
        lazy: true,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: '#82065e',
        tabBarInactiveTintColor: '#ACACB9',
        animation: 'fade',
        headerShown: false,
        tabBarItemStyle: {
          borderColor: '#FFFFFF',
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
    <View style={styles.labelContainer}>
      <AppText
        style={[styles.labelText, focused ? styles.labelFocused : styles.labelInactive]}
        numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'LufgaMedium',
    lineHeight: 11,
  },
  labelFocused: {
    color: '#82065e',
  },
  labelInactive: {
    color: '#ACACB9',
  },
});
