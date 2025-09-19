import { Link } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import useUser from '~/store/useUser';

const PAGE_WIDTH = Dimensions.get('window').width;
const PAGE_HEIGHT = Dimensions.get('window').height;
const Rental = () => {
  const { user, logout } = useUser();

  return (
    <View
      id="carousel-component"
      // dataSet={{ kind: "custom-animations", name: "tinder" }}
    >
      {user && (
        <Pressable
          onPress={logout}
          className="mx-6 mt-4 items-center justify-center rounded-md bg-secondary py-3">
          <Text className="text-lg font-semibold text-white">Logout</Text>
        </Pressable>
      )}
      {!user && (
        <Link
          href="/login"
          // onPress={logout}
          className="mx-6 mt-4 items-center justify-center rounded-md bg-secondary py-3 text-center">
          <Text className="text-center text-lg font-semibold text-white">Login</Text>
        </Link>
      )}
    </View>
  );
};

export default Rental;
