import { create } from 'zustand';

interface UserStore {
  name: string;
  initiated_name?: string;
  account_approved: string;
  login_id: string;
  roles: string; // Add the roles property
  permissions: string;
  setUserValue: (key: keyof UserStore, value: string | string[]) => void;
  setUserMultiValue: (data: Partial<UserStore>) => void;
}

const useUserStore = create<UserStore>((set) => ({
  name: '',
  initiated_name: '',
  account_approved: '',
  login_id: '',
  roles: '', // Initialize roles as an empty array
  permissions: '',

  setUserValue: (key, value) => set({ [key]: value }),
  setUserMultiValue: (data) =>
    set((state) => ({
      ...state,
      ...data, // Ensure the existing state is preserved
    })),
}));

export default useUserStore;
