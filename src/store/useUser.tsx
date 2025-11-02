// import { delete_cookie, get_cookie } from '@/actions/cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native';
import { create } from 'zustand';
import { emailsAddress } from '~/global';
import { User_Type } from '~/type/user';
import { useToast } from './useToast';
type Store = {
  user: Parse.User<User_Type> | null | undefined;
  setUser: (user: Parse.User<User_Type> | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    country?: {
      ISO: string;
      Country: string;
      Code: number;
    };
    userType: string;
    vat?: string;
    company_name?: string;
    terms: boolean;
    privacy: boolean;
    share_consent: boolean;
    email: string;
    password: string;
  }) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const useUser = create<Store>()((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user: user })),
  login: async (email: string, password: string) => {
    try {
      const user = (await Parse.User.logIn(
        email.toLowerCase().trim(),
        password
      )) as Parse.User<User_Type>;
      if (user.attributes.sessionToken) {
        await AsyncStorage.setItem('session_token', user.attributes.sessionToken);
      }
      set(() => ({ user: user }));
    } catch (e) {
      useToast.getState().addToast({
        type: 'error',
        heading: 'Authication Error',
        message: 'Invalid username/password.',
      });
    }
  },
  signup: async (data) => {
    try {
      const email = data.email.toLowerCase().trim();

      const newUser: Parse.User<User_Type> = new Parse.User();

      newUser.set('username', email.toLowerCase());
      newUser.set('email', email.toLowerCase());
      newUser.set('first_name', data.firstName);
      newUser.set('phone', data.phone);
      newUser.set('last_name', data.lastName);
      newUser.set('country_code', data.country?.Code);
      newUser.set('country', data.country?.Country);
      newUser.set('country_iso', data.country?.ISO);
      newUser.set('user_type', data.userType as User_Type['user_type']);
      newUser.set('vat', data.vat);
      newUser.set('company_name', data.company_name);
      newUser.set('terms', data.terms);
      newUser.set('privacy', data.privacy);
      newUser.set('share_consent', data.share_consent);
      newUser.set('social_signup', false);

      newUser.setPassword(data.password);

      const user = (await newUser.signUp()) as Parse.User<User_Type>;

      useToast.getState().addToast({
        type: 'success',
        heading: 'Account Validation',
        message: 'Check your email to validate your account ',
      });

      await fetch(emailsAddress, {
        method: 'POST',
        body: JSON.stringify({ email: 'account_validation', id: user.id }),
      });

      await fetch(emailsAddress, {
        method: 'POST',
        body: JSON.stringify({
          email: 'account_greetings',
          id: user?.id,
        }),
      });

      if (user.attributes.sessionToken) {
        await AsyncStorage.setItem('session_token', user.attributes.sessionToken);
      }

      set({ user });
    } catch (e) {
      useToast.getState().addToast({
        type: 'error',
        heading: 'Sign up Error',
        message: 'Internal Server Error',
      });
    }
  },
  refresh: async () => {
    const session_id = await AsyncStorage.getItem('session_token');

    if (session_id) {
      try {
        const user = (await Parse.User.me(session_id)) as Parse.User<User_Type>;
        set(() => ({ user: user }));
      } catch (e) {
        await AsyncStorage.removeItem('session_token');
        set(() => ({ user: null }));
      }
    } else {
      set(() => ({ user: null }));
    }
  },
  logout: async () => {
    await Parse.User.logOut();
    await AsyncStorage.removeItem('session_token');
    // await Promise.all([
    //   delete_cookie('user_id'),
    //   delete_cookie('session_token'),
    // ]);
    // localStorage.removeItem('oikoteck_user');
    set(() => ({ user: null }));
  },
}));

export default useUser;
