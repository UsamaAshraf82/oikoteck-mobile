import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from '~/components/Elements/AppText';
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
            <AppText className="text-lg font-semibold text-white" >Logout</AppText>
          </Pressable>
        </>
      )}
      {!user && (
        <Link
          href="/login"
          // onPress={logout}
          className="mx-6 mt-4 items-center justify-center rounded-md bg-secondary py-3 text-center">
          <AppText className="text-center text-lg font-semibold text-white" >Login</AppText>
        </Link>
      )}
    </View>
  );
};

export default Rental;
