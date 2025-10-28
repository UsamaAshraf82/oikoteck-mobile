import { create } from 'zustand';

export type Option = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  onPress: () => void;
};

type Select = {
  label: string;
  onClose?: () => void;
  options: Option[];
  useFlatList?: boolean;
};

type Store = {
  opened: Select | null;
  openMenu: (value: Select | null) => void;
};

const useMenu = create<Store>()((set) => ({
  opened: null,
  openMenu: (p: Select | null) => {
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
      options: p.options.map((option) => ({
        ...option,
        onPress: () => {
          set({ opened: null });
          option.onPress();
        },
      })),
    };

    set({ opened: wrapped });
  },
}));

export default useMenu;
