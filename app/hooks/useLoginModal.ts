import { create } from 'zustand';

interface LoginModalStore {
  isOpen: boolean;
  onSuccess?: () => void;
  onOpen: (onSuccess?: () => void) => void;
  onClose: () => void;
}

const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  onSuccess: undefined,
  onOpen: (onSuccess) => set({ isOpen: true, onSuccess }),
  onClose: () => set({ isOpen: false, onSuccess: undefined })
}));

export default useLoginModal;