// store/toastStore.ts
import { create } from 'zustand';

type  Props = {
  isInActivity: boolean;
  startActivity: () => void;
  stopActivity: () => void;
};

const useActivityIndicator = create<Props>((set) => ({
  isInActivity: false,
  startActivity: () => set({ isInActivity: true }),
  stopActivity: () => set({ isInActivity: false }),
}));

export default useActivityIndicator
