import React from 'react';
import { create } from 'zustand';

type Select = {
  onClose?: () => void;
  modal: React.ReactElement;
};

type Store = {
  opened: Select | null;
  openModal: (value: Select | null) => void;
};

const useModal = create<Store>()((set) => ({
  opened: null,
  openModal: (p: Select | null) => {
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
    };

    set({ opened: wrapped });
  },
}));

export default useModal;
