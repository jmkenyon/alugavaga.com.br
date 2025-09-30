import { create } from 'zustand';

interface RegisterModalStore {
  isOpen: boolean;
  onSuccess?: () => void;
  onOpen: (onSuccess?: () => void) => void;
  onClose: () => void;
}

const useRegisterModal = create<RegisterModalStore>((set) => ({
  isOpen: false,
  onSuccess: undefined,
  onOpen: (onSuccess) => set({ isOpen: true, onSuccess }),
  onClose: () => set({ isOpen: false, onSuccess: undefined })
}));

export default useRegisterModal;