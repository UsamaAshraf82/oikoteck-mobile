// import { delete_cookie, get_cookie } from '@/actions/cookie';
import { create } from 'zustand';

type Options<T> = { label: string; value: T };

type Select<T> = {
  label: string;
  onClose?: () => void;
  onPress?: (data: Options<T>) => void;
  options: Options<T>[];
};

type AnySelect = Select<string | number | boolean | null | Record<string, unknown>>;

type Store = {
  value: AnySelect | null;
  open: (value: AnySelect | null) => void;
};

const useSelect = create<Store>()((set) => ({
  value: null,
  open: (p: AnySelect | null) => {
    if (p === null) {
      set({ value: null });
      return;
    }
    const wrapped: AnySelect = {
      ...p,
      onClose: () => {
        set({ value: null });
        p.onClose?.();
      },
      onPress: (data) => {
        set({ value: null });
        p.onPress?.(data);
      },
    };
    set({ value: wrapped });
  },
}));

export default useSelect;
