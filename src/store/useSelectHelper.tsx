import { create } from 'zustand';

export type Option = {
  label: React.ReactNode;
  value: string | number | boolean | null | Record<string, unknown>;
};

type Select = {
  label: string;
  className?: {
    label?: { wrapper?: string; text?: string };
    option_label?: { wrapper?: string; text?: string };
  };
  value?: Option['value'];
  onClose?: () => void;
  onPress?: (data: Option) => void;
  options: Option[];
  useFlatList?: boolean;
  hasXIcon?: boolean;
};

type Store = {
  opened: Select | null;
  openSelect: (value: Select | null) => void;
};

const useSelect = create<Store>()((set) => ({
  opened: null,
  openSelect: (p: Select | null) => {
    if (p === null) {
      set({ opened: null });
      return;
    }

    const wrapped: Select = {
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
