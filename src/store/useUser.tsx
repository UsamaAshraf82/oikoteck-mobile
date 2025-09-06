// import { delete_cookie, get_cookie } from '@/actions/cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native';
import { create } from 'zustand';
import { User_Type } from '~/type/user';
type Store = {
  user: Parse.User<User_Type> | null | undefined;
  setUser: (user: Parse.User<User_Type> | null) => void;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const useUser = create<Store>()((set) => ({
  user: undefined,
  setUser: (user) => set(() => ({ user: user })),
  login: async (email: string, password: string) => {
    const user = (await Parse.User.logIn(
      email.toLowerCase().trim(),
      password
    )) as Parse.User<User_Type>;
    if (user.attributes.sessionToken) {
      await AsyncStorage.setItem('session_token', user.attributes.sessionToken);
    }
    set(() => ({ user: user }));
  },
  signup: async (_email, password) => {
    // Example Parse login
    const email = _email.toLowerCase().trim();

    const newUser: Parse.User<User_Type> = new Parse.User();
    newUser.set('email', email);
    newUser.set('username', email);
    newUser.setPassword(password);
    const user = (await newUser.signUp()) as Parse.User<User_Type>;

    if (user.attributes.sessionToken) {
      await AsyncStorage.setItem('session_token', user.attributes.sessionToken);
    }

    set({ user });
  },
  refresh: async () => {
    const session_id = await AsyncStorage.getItem('session_token');
    console.log(session_id);
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
