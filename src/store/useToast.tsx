// store/toastStore.ts
import { uid } from 'uid';
import { create } from 'zustand';

type Toast = {
  id: string;
  heading: string;
  message: string;
  time?: number;
  type?: 'success' | 'error' | 'info';
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uid();
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }));

    // auto-remove after 3s
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, toast.time || 5000);

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
