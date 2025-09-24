// import { delete_cookie, get_cookie } from '@/actions/cookie';
import { create } from 'zustand';

type Options<T> = { label: React.ReactNode; value: T };

type Select<T> = {
  label: string;
  value?: T;
  onClose?: () => void;
  onPress?: (data: Options<T>) => void;
  options: Options<T>[];
  useFlatList?: boolean;
};

type AnySelect = Select<string | number | boolean | null | Record<string, unknown>>;

type Store = {
  opened: AnySelect | null;
  openSelect: (value: AnySelect | null) => void;
};

const useSelect = create<Store>()((set) => ({
  opened: null,
  openSelect: (p: AnySelect | null) => {
    if (p === null) {
      set({ opened: null });
      return;
    }
    const wrapped: AnySelect = {
      ...p,
      onClose: () => {
        set({ opened: null });
        p.onClose?.();
      },
      onPress: (data) => {
        set({ opened: null });
        p.onPress?.(data);
      },
    };
    set({ opened: wrapped });
  },
}));

export default useSelect;
