import { Link } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import useUser from '~/store/useUser';

const Rental = () => {
  const { user, logout } = useUser();

  return (
    <View id="carousel-component">
      {user && (
        <>
          <Pressable
            onPress={logout}
            className="mx-6 mt-4 items-center justify-center rounded-md bg-secondary py-3">
            <Text className="text-lg font-semibold text-white">Logout</Text>
          </Pressable>
        </>
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
